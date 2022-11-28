import { Request, Response } from 'express';
import catchAsync from '../helpers/catchAsync';
import httpStatus from 'http-status';
import accountService from '../services/account.service';

const fundAccount = catchAsync(async (req: Request, res: Response) => {
	const userId = res.locals.user.id;
	const { reference, amount } = req.body;
	const account = await accountService.deposit({ reference, amount, userId });
	return res.status(httpStatus.OK).send({
		message: 'Account funded successfully',
		status: 'success',
		data: account,
	});
});

const transferFund = catchAsync(async (req: Request, res: Response) => {
	const userId = res.locals.user.id;
	const { destinationAccountNumber, amount } = req.body;
	const account = await accountService.transfer({ destinationAccountNumber, amount, userId });
	return res.status(httpStatus.OK).send({
		message: 'Transfer successful',
		status: 'success',
		data: account,
	});
});

const withdrawFund = catchAsync(async (req: Request, res: Response) => {
	const userId = res.locals.user.id;
	const { amount } = req.body;
	const account = await accountService.withdraw({
		amount,
		userId,
	});
	return res.status(httpStatus.OK).send({
		message: 'Withdrawal successful',
		status: 'success',
		data: account,
	});
});

export default { fundAccount, transferFund, withdrawFund };
