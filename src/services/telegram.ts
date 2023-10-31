import { createReadStream } from "fs";

import TelegramBot from "node-telegram-bot-api";
import type { Configuration } from "./configuration";
import type Logger from "./logger";

class TelegramService {
  private bot: TelegramBot;
  private chatId: string;
  private logger: Logger;
  private configuration: Configuration;

  constructor({
    logger,
    configuration,
  }: {
    logger: Logger;
    configuration: Configuration;
  }) {
    this.logger = logger;
    this.configuration = configuration;
    this.bot = new TelegramBot(this.configuration.TELEGRAM_BOT_TOKEN, {
      polling: false,
    });
    this.chatId = this.configuration.TELEGRAM_CHAT_ID;
  }

  public async sendMessage({
    message,
    fileName,
  }: {
    message: string;
    fileName: string;
  }) {
    this.logger.info("Performing: send message to telegram");

    await this.bot.sendDocument(
      this.chatId,
      createReadStream(`./downloads/${fileName}`),
      {
        caption: message,
      },
      {
        contentType: "application/octet-stream",
      },
    );
  }
}

export default TelegramService;
