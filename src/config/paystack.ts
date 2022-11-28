import Env from '../helpers/env';
import axios, { AxiosRequestConfig } from 'axios';
import logger from '../config/logger';
const PAYSTACK_SECRET_KEY = Env.get('PAYSTACK_SECRET_KEY');

const verifyTransaction = async (reference: string) => {
	try {
		const config: AxiosRequestConfig = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
			},

			url: `https://api.paystack.co/transaction/verify/${reference}`,
		};

		const response = await axios(config);
		logger.info(`Fetched transaction`);

		return response.data;
	} catch (error: any) {
		logger.error(`Error fetching transaction: ${error.response.data.message}`);
		throw new Error(error.response.data.message);
	}
};

const withdrawToBank = async (body: any) => {
	try {
		const config: AxiosRequestConfig = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
			},

			url: `https://api.paystack.co/transferrecipient`,
			data: {
				type: 'nuban',
				name: body.name,
				description: body.description,
				account_number: body.accountNumber,
				bank_code: body.bankCode,
				currency: 'NGN',
			},
		};

		const response = await axios(config);
		logger.info(`Fetched transaction`);

		return response.data;
	} catch (error: any) {
		logger.error(`Error Withdrawing: ${error.response.data.message}`);
		throw new Error(error.response.data.message);
	}
};

export default { verifyTransaction, withdrawToBank };
