import { NextFunction } from 'express';
import jwt, { JwtHeader, JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import logger from '../config/logger';
import Env from '../helpers/env';
import knex from 'knex';
import userService from '../services/user.service';

const key = Env.get('JWT_AUTH_SECRET');

const verifyToken = async (req: any, res: any, next: NextFunction) => {
	const { authorization } = req.headers;
	if (!authorization) {
		return res.status(httpStatus.UNAUTHORIZED).send({
			status: 'error',
			message: 'Please sign in or create an account',
		});
	}

	const tokenBearer = req.headers.authorization.split(' ')[1];

	const token = req.get('x-access-token') || tokenBearer || authorization;

	if (!token) {
		return res.status(httpStatus.UNAUTHORIZED).send({
			status: 'error',
			message: 'Please sign in or create an account',
		});
	}

	try {
		const decoded = jwt.verify(token, key);
		// Get user details
		const user = await userService.getUserById(decoded.sub);
		// Save user to locals
		res.locals.user = user;
		next();
	} catch (error) {
		logger.error(error);
		return res.status(httpStatus.FORBIDDEN).send({
			status: 'error',
			message: 'You are not authorized to access this resource',
		});
	}
};

export default { verifyToken };
