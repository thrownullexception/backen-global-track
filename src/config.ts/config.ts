import dotenv from 'dotenv';
dotenv.config();

const AppConfig = {
    port: process.env.PORT || 3000,
    dbUrl: process.env.DB_URL || '',
}

export default AppConfig;