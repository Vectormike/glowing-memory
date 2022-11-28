import knex from '../config/database';

const createTransaction = async (transactionBody: any): Promise<any> => {
	return knex('transactions').insert(transactionBody);
};

const getTransactionByUserId = async (userId: string): Promise<any> => {
	return knex('transactions').where({ user_id: userId });
};

export default { createTransaction, getTransactionByUserId };
