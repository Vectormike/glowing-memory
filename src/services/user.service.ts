import { CreateUserInput } from '../interfaces/user.interface';
import httpStatus from 'http-status';
import ApiError from '../helpers/ApiError';
import knex from '../config/database';
import utilities from '../utilities';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody: CreateUserInput): Promise<any> => {
	// Check if email or username is taken
	if (await knex('users').where({ email: userBody.email }).first()) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
	}

	// Hash password
	const hashedPassword = await utilities.hashedPassword(userBody.password);

	return knex('users').insert({
		...userBody,
		password: hashedPassword,
	});
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id: any): Promise<any> => {
	return knex('users').where({ id }).first();
};

/**
 * Get user by email or username
 * @param {string} email
 * @param {string} username
 * @returns {Promise<User>}
 */

const getUserByEmail = async (email: string): Promise<any> => {
	return knex('users')
		.where({
			email,
		})
		.first();
};

export default { createUser, getUserById, getUserByEmail };
