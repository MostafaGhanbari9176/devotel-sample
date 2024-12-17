import * as process from 'node:process';

export default () => ({
  DB_HOST: process.env.DB_HOST || 'http://127.0.0.1',
  DB_Port: process.env.DB_Port || '5432',
  DB_NAME: process.env.DB_NAME || 'devoteldb',
  DB_USERNAME: process.env.DB_USERNAME || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || 'devotel',
});
