import { Request, Response } from 'express';
import catchAsync from '../helpers/catchAsync';
import userService from '../services/user.service';
import httpStatus from 'http-status';

const createUser = catchAsync(async (req: Request, res: Response) => {
	const user = await userService.createUser(req.body);
	return res.status(httpStatus.CREATED).send({
		success: true,
		message: 'User account created successfully.',
		data: user,
	});
});

const getUser = catchAsync(async (req: Request, res: Response) => {
	const user = await userService.getUserByEmail(req.params.email);
	return res.status(httpStatus.OK).send({
		success: true,
		message: 'User account retrieved successfully.',
		data: user,
	});
});

export default { createUser, getUser };
