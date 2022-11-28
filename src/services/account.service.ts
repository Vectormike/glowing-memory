import httpStatus from 'http-status';
import ApiError from '../helpers/ApiError';
import knex from '../config/database';
import { CreateAccountInput, DepositInput, TransferInput, WithdrawalInput } from '../interfaces/account.interface';
import paymentService from '../config/paystack';
import transactionService from './transaction.service';
import logger from '../config/logger';

const generateAccountNumber = async () => {
	// generates a 10 digit account number
	return Math.floor((Math.random() * 10000000000 + 1000000000) % 10000000000).toString();
};

const generateReference = async () => {
	// generates a 10 digit reference number
	return Math.floor((Math.random() * 10000000000 + 1000000000) % 10000000000).toString();
};

/**
 * Create an Account
 * @param {Object} accountBody
 * @returns {Promise<Account>}
 */
const createAccount = async (accountBody: CreateAccountInput): Promise<any> => {
	// Generate account number
	const accountNumber = await generateAccountNumber();

	// Find user details and remove password
	const user = await knex('users').select('id', 'email').where({ id: accountBody }).first();

	const account = await knex('accounts').insert({ user_id: user.id, accountNumber });

	return { user, accountNumber: accountNumber };
};

/**
 * Confirm account number
 * @param {string} accountNumber
 * @returns {Promise<Account>}
 */
const confirmAccountNumber = async (accountNumber: string): Promise<any> => {
	const account = await knex('accounts').select('id', 'accountNumber', 'balance').where({ accountNumber }).first();

	if (!account) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
	}

	return account;
};

/**
 * Check if user has enough balance to transfer
 * @param {string} accountNumber
 * @param {number} userId
 * @param {number} amount
 * @returns {Promise<Account>}
 */
const checkBalance = async (accountNumber: string, userId: string, amount: number): Promise<any> => {
	const account = await knex('accounts').select('id', 'accountNumber', 'balance').where({ accountNumber }).first();

	if (!account) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
	}

	if (account.balance < amount) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
	}

	return account;
};

/**
 * Get account by user id
 * @param {string} userId
 * @returns {Promise<Account>}
 */
const getAccountByUserId = async (userId: string): Promise<any> => {
	return await knex('accounts').where({ user_id: userId }).first();
};

/**
 * Deposit money into account
 * @param {string} accountNumber
 * @param {number} amount
 * @returns {Promise<Account>}
 */
const deposit = async (depositBody: DepositInput): Promise<any> => {
	const transaction = await knex.transaction();

	try {
		const { reference, amount, userId } = depositBody;
		const isVerified = await paymentService.verifyTransaction(reference);
		if (!isVerified) {
			throw new ApiError(httpStatus.BAD_REQUEST, 'Deposit failed');
		}

		const account = await getAccountByUserId(userId);
		if (!account) {
			throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
		}

		const newBalance = Number(account.balance) + amount;

		// Update account balance
		await knex('accounts').where({ user_id: userId }).update({ balance: newBalance });

		// Save transaction
		await transactionService.createTransaction({
			user: userId,
			account_id: account.id,
			transaction_type: 'deposit',
			transaction_reference: reference,
			balance_before: Number(account.balance),
			balance_after: newBalance,
			amount: amount,
		});

		transaction.commit();

		return { account };
	} catch (error: any) {
		await transaction.rollback();
		logger.error(error, 'Deposit failed');
		throw new ApiError(httpStatus.BAD_REQUEST, 'Deposit failed');
	}
};

/**
 * Transfer money from one account to another
 * @param {string} accountNumber
 * @param {number} userId
 * @param {number} amount
 * @returns {Promise<Account>}
 */
const transfer = async (transferBody: TransferInput): Promise<any> => {
	const transaction = await knex.transaction();

	try {
		const { amount, userId, destinationAccountNumber } = transferBody;

		// Check if account number exists
		const destinationAccount = await confirmAccountNumber(destinationAccountNumber);
		if (!destinationAccount) {
			throw new ApiError(httpStatus.NOT_FOUND, 'Account number is invalid.');
		}

		const account = await getAccountByUserId(userId);
		if (!account) {
			throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
		}

		// Check if user has enough balance
		await checkBalance(account.accountNumber, userId, amount);

		// Deduct amount from sender account
		const newBalance = Number(account.balance) - amount;
		console.log(newBalance, 'newBalance');
		// Update account balance for sender
		await transaction('accounts').where({ user_id: userId }).update({ balance: newBalance });

		const reference = await generateReference();

		// Save transaction for sender
		await transactionService.createTransaction({
			user: userId,
			account_id: account.id,
			transaction_type: 'transfer',
			transaction_reference: reference,
			balance_before: Number(account.balance),
			balance_after: newBalance,
			amount: amount,
		});

		// Add amount to destination account
		const newDestinationBalance = Number(destinationAccount.balance) + amount;
		// Update account balance for destination
		await transaction('accounts').where({ accountNumber: destinationAccountNumber }).update({ balance: newDestinationBalance });

		// Save transaction for destination
		await transactionService.createTransaction({
			user: userId,
			account_id: destinationAccount.id,
			transaction_type: 'credit',
			transaction_reference: await generateReference(),
			balance_before: Number(destinationAccount.balance),
			balance_after: newDestinationBalance,
			amount: amount,
		});

		transaction.commit();

		return { account, destinationAccount };
	} catch (error: any) {
		await transaction.rollback();
		logger.error(error, 'Transfer failed');
		throw new ApiError(httpStatus.BAD_REQUEST, 'Transfer failed');
	}
};

const withdraw = async (withdrawBody: WithdrawalInput): Promise<any> => {
	const { amount, userId } = withdrawBody;

	const transaction = await knex.transaction();

	try {
		const account = await getAccountByUserId(userId);
		if (!account) {
			throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
		}

		// Check if user has enough balance
		await checkBalance(account.accountNumber, userId, amount);

		const newBalance = Number(account.balance) - amount;
		await knex('accounts').where({ user_id: userId }).update({ balance: newBalance });

		// Withdraw money from account to local bank account
		await paymentService.withdrawToBank({
			amount,
			accountNumber: account.accountNumber,
			bankCode: account.bankCode,
		});

		// Save transaction
		await transactionService.createTransaction({
			user: userId,
			account_id: account.id,
			transaction_type: 'withdrawal',
			transaction_reference: await generateReference(),
			balance_before: account.balance,
			balance_after: newBalance,
			amount: amount,
		});

		transaction.commit();

		return { account };
	} catch (error: any) {
		await transaction.rollback();
		logger.error(error, 'Withdrawal failed');
		throw new ApiError(httpStatus.BAD_REQUEST, 'Withdrawal failed');
	}
};

export default { createAccount, getAccountByUserId, deposit, transfer, withdraw };
