import { Command } from './command.interface.js';
import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';

import { ApiOffer } from '../../shared/types/api-data.js';
import { getRandomElement, getRandomNumber } from '../../utils/helpers.js';

export class GenerateCommand implements Command {
  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [countStr, filePath, apiUrl] = parameters;

    if (!countStr || !filePath || !apiUrl) {
      console.error('❌ Ошибка: неправильное использование команды.');
      console.info('Пример: --generate <количество> <путь к файлу> <API-URL>');
      return;
    }

    const count = parseInt(countStr, 10);
    if (isNaN(count) || count <= 0) {
      console.error('❌ Ошибка: количество должно быть положительным числом.');
      return;
    }

    console.info(`📥 Получаем базовые данные с API: ${apiUrl}`);

    try {
      const response = await axios.get<ApiOffer[]>(apiUrl);
      const baseOffers = response.data;

      if (baseOffers.length === 0) {
        console.error('❌ Ошибка: сервер не вернул данных.');
        return;
      }

      console.info(`✅ Данные получены. Генерируем ${count} предложений...`);

      const outputPath = path.resolve(filePath);
      const writeStream = fs.createWriteStream(outputPath);

      // Заголовки TSV
      writeStream.write(
        'title\tdescription\tcity\tpreviewImage\timages\tpremium\tfavorite\trating\ttype\trooms\tguests\tprice\tamenities\tlatitude\tlongitude\n'
      );

      for (let i = 0; i < count; i++) {
        const template = getRandomElement(baseOffers);

        const offer = {
          ...template,
          title: `${template.title}`,
          rating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
          rooms: getRandomNumber(1, 8),
          guests: getRandomNumber(1, 10),
          price: getRandomNumber(100, 100000),
          favorite: Math.random() < 0.5,
          premium: Math.random() < 0.5,
        };

        const tsvLine = `${offer.title}\t${offer.description}\t${offer.city}\t${
          offer.previewImage
        }\t${offer.images.join(',')}\t${offer.premium}\t${offer.favorite}\t${
          offer.rating
        }\t${offer.type}\t${offer.rooms}\t${offer.guests}\t${
          offer.price
        }\t${offer.amenities.join(',')}\t${offer.latitude}\t${
          offer.longitude
        }\n`;
        writeStream.write(tsvLine);
      }

      writeStream.end(() => {
        console.info(`✅ Файл сгенерирован: ${outputPath}`);
      });
    } catch (error) {
      console.error(
        `❌ Ошибка при получении данных с API: ${(error as Error).message}`
      );
    }
  }
}
