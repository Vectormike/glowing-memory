import jwt from 'jsonwebtoken';
import moment from 'moment';
import Env from '../helpers/env';
import bcrypt from 'bcryptjs';

const key = process.env.JWT_AUTH_SECRET || 'mysecret';
const accessTokenExpiresMinutes = Env.get('ACCESSTOKENEXPIRESMINUTES');
const refreshTokenExpiresDays = Env.get('REFRESHTOKENEXPIRESDAYS');

const comparePassword = async (password: string, hash: string) => {
	return bcrypt.compare(password, hash);
};

const hashedPassword = async (password: string) => {
	return bcrypt.hash(password, 10);
};

// JWT Helpers
const generateToken = (_id: string, type: string, expiration: any, key: jwt.Secret) => {
	const payload = {
		_id,
		iat: moment().unix(),
		exp: expiration.unix(),
		type,
	};

	return jwt.sign(payload, key);
};

const generateLoginToken = (user: any) => {
	const { id } = user;
	const accessExpiration = moment().add(accessTokenExpiresMinutes, 'minutes');
	const accessToken = generateToken(id, 'access', accessExpiration, key);

	const refreshExpiration = moment().add(refreshTokenExpiresDays, 'days');
	const refreshToken = generateToken(id, 'refresh', refreshExpiration, key);

	return {
		access: {
			token: accessToken,
			expires: accessExpiration.local().format('YYYY-MM-DD HH:mm:ss'),
		},
		refresh: {
			token: refreshToken,
			expires: refreshExpiration.local().format('YYYY-MM-DD HH:mm:ss'),
		},
	};
};

export default {
	comparePassword,
	hashedPassword,
	generateLoginToken,
};
