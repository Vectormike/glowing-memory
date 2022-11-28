import httpStatus from 'http-status';
import ApiError from '../helpers/ApiError';
import utilities from '../utilities';
import { LoginUserInput } from '../interfaces/auth.interface';
import userService from './user.service';
import accountService from './account.service';

const loginUserWithEmailAndPassword = async (userDto: LoginUserInput): Promise<any> => {
	const { email, password } = userDto;

	// Check if email or username exists
	const user = await userService.getUserByEmail(email);
	if (!user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
	}

	// Check if password is correct
	const passwordMatches = await utilities.comparePassword(password, user.password);
	if (!passwordMatches) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
	}

	// Get account number
	const account = await accountService.getAccountByUserId(user.id);

	return { user, account };
};

export default { loginUserWithEmailAndPassword };
