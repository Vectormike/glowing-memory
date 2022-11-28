import { createLogger, format, transports } from 'winston';
import env from '../helpers/env';
const nodeEnv = env.get('NODE_ENV');

const enumerateErrorFormat = format((info: any) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}
	return info;
});

const logger = createLogger({
	level: nodeEnv === 'development' ? 'debug' : 'info',
	format: format.combine(
		enumerateErrorFormat(),
		nodeEnv === 'development' ? format.colorize() : format.uncolorize(),
		format.splat(),
		format.printf(({ level, message }: any) => `${level}: ${message}`)
	),
	transports: [
		new transports.Console({
			stderrLevels: ['error'],
		}),
	],
});

export default logger;
