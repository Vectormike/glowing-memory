import ApiError from '../helpers/ApiError';
import moment from 'moment';
import jwt, { Jwt } from 'jsonwebtoken';
import Env from '../helpers/env';
import knex from '../config/database';

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {Promise<Jwt>}
 */
const generateToken = (userId: string, expires: any, type: string, secret: string = Env.get('JWT_AUTH_SECRET')): any => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix(),
		type,
	};
	return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = (token: string, userId: string, expires: any, type: string, blacklisted: boolean = false): Promise<any> => {
	return knex('tokens').insert({
		token,
		user: userId,
		expires: expires.toDate(),
		type,
		blacklisted,
	});
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user: { user: { id: string } }): Promise<object> => {
	const accessTokenExpires = moment().add(Env.get('ACCESSTOKENEXPIRESMINUTES'), 'minutes');
	const accessToken = generateToken(user.user.id, accessTokenExpires, 'access');

	const refreshTokenExpires = moment().add(Env.get('REFRESHTOKENEXPIRESDAYS'), 'days');
	const refreshToken = generateToken(user.user.id, refreshTokenExpires, 'refresh');

	await saveToken(refreshToken, user.user.id, refreshTokenExpires, 'refresh');

	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		},
		refresh: {
			token: refreshToken,
			expires: refreshTokenExpires.toDate(),
		},
	};
};

export default { generateAuthTokens };
