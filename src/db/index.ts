// db.index.ts
import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
// import AppConfig from '../config.ts/config';

export const db = drizzle(process.env.DATABASE_URL!);
