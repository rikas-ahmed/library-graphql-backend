/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('authors', function(table) {
      table.increments('id').primary(); // Primary key for authors
      table.string('name').notNullable().unique();
    })
    .createTable('books', function(table) {
      table.increments('id').primary(); // Primary key for books
      table.string('title').notNullable();
      table.string('genre');
      table.date('publication_date');
      table.integer('author_id').unsigned().references('id').inTable('authors').onDelete('CASCADE');
    })
    .createTable('patrons', function(table) {
      table.increments('id').primary(); // Primary key for patrons
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('patrons')
    .dropTableIfExists('books')
    .dropTableIfExists('authors');
};
