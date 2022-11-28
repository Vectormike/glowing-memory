import * as dotenv from 'dotenv';

// Load .env file based on environment
if (process.env.NODE_ENV === 'development') dotenv.config({ path: '.env' });

class Env {
	nodeEnv = this.get('NODE_ENV');

	get(variable: any): any {
		return process.env[variable];
	}

	getBackendUrl(): string {
		if (this.nodeEnv === 'development') {
			return this.get('BASE_URL_DEV');
		}
		return this.get('BASE_URL_URL_PROD');
	}
}

export default new Env();
