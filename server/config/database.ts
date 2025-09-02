import { Knex, knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: Knex.Config = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'nd_hw10',
    },
    migrations: {
        directory: './migrations',
        extension: 'ts'
    },
    seeds: {
        directory: './seeds'
    }
};

export const db = knex(config);

export default config;
