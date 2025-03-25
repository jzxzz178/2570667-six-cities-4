import convict from 'convict';
import convictFormatWithValidator from 'convict-format-with-validator';
import dotenv from 'dotenv';

dotenv.config();

convict.addFormats(convictFormatWithValidator);

const configSchema = convict({
  port: {
    doc: 'Порт, на котором приложение ожидает подключения.',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  dbHost: {
    doc: 'IP-адрес сервера баз данных.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'DB_HOST'
  },
  salt: {
    doc: 'Соль для хэширования паролей или прочих данных.',
    format: String,
    default: '',
    env: 'SALT'
  }
});

configSchema.validate({ allowed: 'strict' });

export default configSchema.getProperties();
