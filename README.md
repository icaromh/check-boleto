# Check Boletos

This project automate the process of checking boletos status in a Brazilian website.

1. Automate login into the website using Puppeter
2. Scrape the page to check if is there a new Boleto open to pay.
3. If there is a new boleto, get the payment details
4. Send the PDF file and amount to pay via Telegram message;

![Example](./docs/example.png)

## Running the script

```bash
yarn start
```

## ENV_VARs

```bash
# NAVIGATION VARIABLES
URL_LOGIN="https://clienteonline.samisistemas.com.br/login.php?Sigla="
URL_BOLETO="https://clienteonline.samisistemas.com.br/2viaboleto.php"
URL_POST_LOGIN="https://clienteonline.samisistemas.com.br"

# LOGIN CREDENTIALS
PASSWORD=""
USERNAME=""

# TELEGRAM CONFIGURATION
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""

# PUPPETEER CONFIGURATION
PUPPETEER_EXECUTABLE_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```
