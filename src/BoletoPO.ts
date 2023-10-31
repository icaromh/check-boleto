import type { Page } from "puppeteer-core";
import type Logger from "./services/logger";
import type { Configuration } from "./services/configuration";

class BoletoPO {
  private page: Page;
  private logger: Logger;
  private configuration: Configuration;

  constructor({
    page,
    logger,
    configuration,
  }: {
    page: Page;
    logger: Logger;
    configuration: Configuration;
  }) {
    this.page = page;
    this.logger = logger;
    this.configuration = configuration;
  }

  public async navigate(url: string, timeout = 30_000) {
    this.logger.info("Performing: navigate to " + url);
    await this.page.goto(url, { timeout });
    // await this.page.waitForNavigation();
  }

  public async login() {
    await this.navigate(this.configuration.URL_LOGIN, 60_000);

    this.logger.info("Performing: Login");
    await this.page.waitForSelector("#usuario");
    await this.page.type("#usuario", this.configuration.USERNAME);
    await this.page.type("#senha", this.configuration.PASSWORD);
    await this.page.click("#login input[type='submit']");
    await this.page.waitForNetworkIdle();

    await this.navigate(this.configuration.URL_POST_LOGIN);
    await this.navigate(this.configuration.URL_BOLETO, 120_000);
    await this.page.waitForSelector("#resultado-fase");
  }

  public async hasOpenPayment() {
    this.logger.info(`Performing: check if has open payment`);

    const row = await this.page.$("#resultado-fase tbody tr");
    const boletoToPayTitle = await row?.$eval("td", (el) => el.textContent);

    return boletoToPayTitle?.trim() === "Boletos em Aberto";
  }

  public async getPaymentDetails() {
    this.logger.info(`Performing: get payment details`);

    const row = await this.page.$("#resultado-fase tbody tr:nth-child(2)");
    const id = await row?.$eval("td:nth-child(2)", (el) => el.textContent);
    const value = await row?.$eval("td:nth-child(7)", (el) => el.textContent);
    const docUrl = await row?.$eval("td:nth-child(9) a", (el) => el.href);

    return {
      id: id?.trim(),
      value: value?.trim(),
      docUrl,
    };
  }
}

export default BoletoPO;
