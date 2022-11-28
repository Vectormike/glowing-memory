import Joi from 'joi';

const createUser = {
	body: Joi.object().keys({
		email: Joi.string().email().required(),
		password: Joi.string().required().min(6).max(128),
	}),
};

export default { createUser };
