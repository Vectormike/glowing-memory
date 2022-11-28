import { Request, Response } from 'express';
import catchAsync from '../helpers/catchAsync';
import userService from '../services/user.service';
import accountService from '../services/account.service';
import authService from '../services/auth.service';
import tokenService from '../services/token.service';
import httpStatus from 'http-status';

const register = catchAsync(async (req: Request, res: Response) => {
	const user = await userService.createUser(req.body);
	const account = await accountService.createAccount(user[0]);
	return res.status(httpStatus.CREATED).send({
		success: true,
		message: 'User registered successfully.',
		data: account,
	});
});

const login = catchAsync(async (req: Request, res: Response) => {
	const user = await authService.loginUserWithEmailAndPassword(req.body);
	const token = await tokenService.generateAuthTokens(user);
	return res.status(httpStatus.OK).send({
		success: true,
		message: 'User logged in successfully.',
		data: { user, token },
	});
});

export { register, login };
