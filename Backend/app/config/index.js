import dotenv from 'dotenv';
dotenv.config();

export default { 
  PORT: process.env.PORT || 3000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'titanes_fc_db',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecret_titanes',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'supersecret_refresh',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
};
