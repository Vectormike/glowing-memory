import Joi, { options } from 'joi';
import { password } from '../helpers/validation';

const register = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().custom(password),
	}),
};

const login = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().custom(password),
	}),
};

export default { register, login };
