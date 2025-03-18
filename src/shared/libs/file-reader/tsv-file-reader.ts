import { FileReader } from './file-reader.interface.js';
import fs from 'node:fs';
import readline from 'node:readline';
import { Offer, OfferType } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private data: Offer[] = [];
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  public async read(): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(this.filePath, { encoding: 'utf-8' });

      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
      });

      rl.on('line', (line) => {
        if (!line.trim()) {
          return;
        }

        const [
          title, description, createdDate, image, type, price, categories,
          firstname, lastname, email, avatarPath
        ] = line.split('\t');

        if (!title || !description || !createdDate || !type || !price || !email) {
          console.warn(`⚠ Пропущена некорректная строка: ${line}`);
          return;
        }

        this.data.push({
          title,
          description,
          postDate: new Date(createdDate),
          image,
          type: OfferType[type as keyof typeof OfferType] ?? OfferType.Sell, // Безопасная типизация
          categories: categories.split(';').map((name) => ({ name })),
          price: Number.parseInt(price, 10),
          user: { email, firstname, lastname, avatarPath },
        });
      });

      rl.on('close', () => {
        console.info(`✅ Файл успешно прочитан. Всего записей: ${this.data.length}`);
        resolve();
      });

      stream.on('error', (err) => {
        console.error(`❌ Ошибка чтения файла: ${err.message}`);
        reject(err);
      });
    });
  }

  public toArray(): Offer[] {
    return this.data;
  }
}
