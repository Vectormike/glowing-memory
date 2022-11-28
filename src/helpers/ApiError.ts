class ApiError extends Error {
	statusCode: any;
	isOperational: boolean;
	constructor(statusCode: any, message: string | undefined, isOperational = true, stack = '') {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export default ApiError;
