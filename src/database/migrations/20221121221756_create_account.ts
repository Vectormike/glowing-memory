import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('accounts', (t) => {
		t.increments('id').primary();
		t.string('user_id');
		t.string('accountNumber');
		t.decimal('balance', 10, 2).defaultTo(0);
		t.timestamp('created_at').defaultTo(knex.fn.now());
		t.timestamp('updated_at').defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('accounts');
}
