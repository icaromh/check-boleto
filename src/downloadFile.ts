import path from "path";
import fs from "fs";

import { Readable } from "stream";
import { finished } from "stream/promises";

async function downloadFile(url: string, fileName: string) {
  const res = await fetch(url);
  const destination = path.resolve("./downloads", fileName);
  const fileStream = fs.createWriteStream(destination, { flags: "wx" });
  if (res.body) {
    await finished(Readable.fromWeb(res.body as any).pipe(fileStream));
  }
}

export default downloadFile;
