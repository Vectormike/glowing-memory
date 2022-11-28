import express, { Application } from 'express';
import env from './helpers/env';
// import connectDB from './config/database';
import logger from './config/logger';
import routes from './routes';
const cookieParser = require('cookie-parser');
import { errorConverter, errorHandler } from './middlewares/error';
import cors from 'cors';

const port = env.get('PORT');

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// enable cors
app.use(cors());

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

app.use(cookieParser());

app.use('/lendsqr', routes);

app.listen(port, () => {
	logger.info(`Server is running on port ${port}`);
});

let server: any;

const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info('Server closed');
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error: any) => {
	logger.error(error);
	exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
	logger.info('SIGTERM received');
	if (server) {
		server.close();
	}
});
