import Joi, { options } from 'joi';

const fundAccount = {
	body: Joi.object().keys({
		amount: Joi.number().required(),
		reference: Joi.string().required(),
	}),
};

const transferFund = {
	body: Joi.object().keys({
		amount: Joi.number().required(),
		destinationAccountNumber: Joi.string().required(),
	}),
};

const withdrawFund = {
	body: Joi.object().keys({
		amount: Joi.number().required(),
	}),
};

export default { fundAccount, transferFund, withdrawFund };
