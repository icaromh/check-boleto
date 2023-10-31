import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
  URL_LOGIN: z.string().url(),
  URL_BOLETO: z.string().url(),
  URL_POST_LOGIN: z.string().url(),

  TELEGRAM_BOT_TOKEN: z.string(),
  TELEGRAM_CHAT_ID: z.string(),

  USERNAME: z.string(),
  PASSWORD: z.string(),

  PUPPETEER_EXECUTABLE_PATH: z
    .string()
    .default("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type Configuration = z.infer<typeof envSchema>;

const envServer = envSchema.safeParse({
  URL_LOGIN: process.env.URL_LOGIN,
  URL_BOLETO: process.env.URL_BOLETO,
  URL_POST_LOGIN: process.env.URL_POST_LOGIN,

  USERNAME: process.env.USERNAME,
  PASSWORD: process.env.PASSWORD,

  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,

  NODE_ENV: process.env.NODE_ENV,
});

if (!envServer.success) {
  console.error(envServer.error.issues);
  throw new Error("There is an error with the server environment variables");
  process.exit(1);
}

const envServerSchema = envServer.data;
export default envServerSchema;
