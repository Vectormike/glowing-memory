import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('users', (t) => {
		t.increments('id').primary();
		t.string('email');
		t.string('password');
		t.timestamp('created_at').defaultTo(knex.fn.now());
		t.timestamp('updated_at').defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('users');
}
