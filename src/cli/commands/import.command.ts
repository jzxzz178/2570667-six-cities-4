import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import path from 'node:path';
import fs from 'node:fs';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filepath] = parameters;

    if (!filepath) {
      console.error('❌ Ошибка: Укажите путь к файлу.');
      return;
    }

    const fullPath = path.resolve(filepath.trim());

    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Ошибка: Файл ${fullPath} не найден.`);
      return;
    }

    console.info(`📥 Начинаем импорт данных из файла: ${fullPath}`);

    const fileReader = new TSVFileReader(fullPath);

    try {
      await fileReader.read();
      console.info(`✅ Импорт завершён. Всего записей: ${fileReader.toArray().length}`);

      console.table(fileReader.toArray().slice(0, 5));
    } catch (err) {
      if (err instanceof Error) {
        console.error(`❌ Ошибка при импорте: ${err.message}`);
      } else {
        throw err;
      }
    }
  }
}
