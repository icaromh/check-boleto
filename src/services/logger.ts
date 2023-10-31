import pino from "pino";

export default class Logger {
  private logger;

  constructor() {
    this.logger = pino({
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
    });
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }
}
