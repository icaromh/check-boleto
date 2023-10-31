import process from "process";
import puppeteer from "puppeteer-core";

import BoletoPO from "./BoletoPO";
import downloadFile from "./downloadFile";
import Configuration from "./services/configuration";
import Logger from "./services/logger";
import Storage from "./services/storage";
import TelegramService from "./services/telegram";

const logger = new Logger();

(async () => {
  logger.info("Starting bot");

  const telegramService = new TelegramService({
    logger,
    configuration: Configuration,
  });
  const browser = await puppeteer.launch({
    timeout: 120_000,
    headless: true,
    executablePath: Configuration.PUPPETEER_EXECUTABLE_PATH,
  });

  const shutDown = (message: string) => {
    logger.info(message);
    browser.close();
    return process.exit(0);
  };

  const page = await browser.newPage();
  const boletoPO = new BoletoPO({
    page,
    logger,
    configuration: Configuration,
  });

  await boletoPO.login();
  const hasOpenPayment = await boletoPO.hasOpenPayment();
  if (!hasOpenPayment) {
    return shutDown(`No open payments found, shutting down bot`);
  }

  const { id, value, docUrl } = await boletoPO.getPaymentDetails();
  const lastId = await Storage.getId();
  const isNewPayment = id && id !== lastId;
  if (isNewPayment === false) {
    return shutDown("No new payments found, shutting down bot");
  }
  if (!id || !docUrl) {
    return shutDown("Unable to get id or docUrl, shutting down bot");
  }

  try {
    const fileName = `${id?.replace("/", "-")}.pdf`;
    const message = `Valor: ${value}`;

    await downloadFile(docUrl, fileName);
    await telegramService.sendMessage({ fileName, message });
    await Storage.saveId(id);
  } catch (err: any) {
    logger.error(err);
  }

  shutDown(`Shutting down bot`);
})();
