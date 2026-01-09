import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import AppConfig from '../config.ts/config';

const db = drizzle(AppConfig.dbUrl);
