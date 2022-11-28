import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('transactions', (t) => {
		t.increments('id').primary();
		t.integer('user').unsigned().references('id').inTable('users');
		t.integer('account_id').unsigned().references('id').inTable('accounts');
		t.string('transaction_type').notNullable();
		t.string('transaction_reference').notNullable();
		t.decimal('balance_before').notNullable();
		t.decimal('balance_after').notNullable();
		t.decimal('amount').notNullable();
		t.timestamp('created_at').defaultTo(knex.fn.now());
		t.timestamp('updated_at').defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('transactions');
}
