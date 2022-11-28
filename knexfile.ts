import dotenv from 'dotenv';
dotenv.config();

const config: any = {
	development: {
		client: 'mysql2',
		connection: {
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
		},
		pool: {
			min: 2,
			max: 100,
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: './src/database/migrations',
			loadExtensions: ['.ts'],
			extension: 'ts',
		},
	},
	production: {
		client: 'mysql2',
		connection: {
			database: process.env.DB_URL,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: './src/database/migrations',
			loadExtensions: ['.ts'],
			extension: 'ts',
		},
	},
};
export default config;
