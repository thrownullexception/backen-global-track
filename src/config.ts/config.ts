import dotenv from 'dotenv';
dotenv.config();

const AppConfig = {
    port: process.env.PORT || 3000,
    dbUrl: process.env.DATABASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
}

export default AppConfig;