import fs from "fs/promises";

export default class Storage {
  public static filePath = "./lastId";

  static async getId(): Promise<string> {
    const buffer = await fs.readFile(Storage.filePath);
    return buffer.toString();
  }

  static async saveId(id: string): Promise<void> {
    return fs.writeFile(Storage.filePath, id);
  }
}
