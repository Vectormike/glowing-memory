import Joi from 'joi';
import pick from '../helpers/pick';
import ApiError from '../helpers/ApiError';
import httpStatus from 'http-status';

const validate = (schema: any) => (req: any, res: any, next: any) => {
	const validSchema = pick(schema, ['params', 'query', 'body']);
	const object = pick(req, Object.keys(validSchema));
	const { value, error } = Joi.compile(validSchema)
		.prefs({ errors: { label: 'key' }, abortEarly: false })
		.validate(object);

	if (error) {
		const errorMessage = error.details.map((details) => details.message).join(', ');
		return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
	}
	Object.assign(req, value);
	return next();
};

export default validate;
