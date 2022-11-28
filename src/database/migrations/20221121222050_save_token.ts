import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('tokens', (t) => {
		t.increments('id').primary();
		t.string('token');
		t.integer('user').unsigned().references('id').inTable('users');
		t.timestamp('expires');
		t.string('type');
		t.boolean('blacklisted').defaultTo(false);
		t.timestamp('created_at').defaultTo(knex.fn.now());
		t.timestamp('updated_at').defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('tokens');
}
