import knex from 'knex';
import KnexConfig from '../../knexfile';
import dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';

export default knex(KnexConfig[env]);
