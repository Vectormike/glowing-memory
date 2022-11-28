export interface CreateAccountInput {
	userId: string;
}

export interface DepositInput {
	userId: string;
	amount: number;
	reference: string;
}

export interface TransferInput {
	userId: string;
	amount: number;
	destinationAccountNumber: string;
}

export interface WithdrawalInput {
	userId: string;
	amount: number;
}
