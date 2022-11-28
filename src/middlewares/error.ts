import httpStatus from 'http-status';
import env from '../helpers/env';
import logger from '../config/logger';
import ApiError from '../helpers/ApiError';

const errorConverter = (err: any, req: any, res: any, next: any) => {
	let error: any = err;
	if (!(error instanceof ApiError)) {
		const statusCode: any = error.statusCode ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
		const message = error.message || httpStatus[statusCode];
		error = new ApiError(statusCode, message, false, err.stack);
	}
	next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: any, req: any, res: any, next: any) => {
	let { statusCode, message } = err;
	if (env.get('NODE_ENV') === 'production' && !err.isOperational) {
		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
		message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
	}

	res.locals.errorMessage = err.message;

	const response = {
		code: statusCode,
		message,
		...(env.get('NODE_ENV') === 'development' && { stack: err.stack }),
	};

	if (env.get('NODE_ENV') === 'development') {
		logger.error(err);
	}

	res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
