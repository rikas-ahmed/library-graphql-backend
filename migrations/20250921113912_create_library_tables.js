exports.up = function(knex) {
  return knex.schema
    .createTable('authors', function(table) {
      table.increments('id').primary(); 
      table.string('name').notNullable().unique();
    })
    .createTable('books', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('genre');
      table.date('publication_date');
      table.integer('author_id').unsigned().references('id').inTable('authors').onDelete('CASCADE');
    })
    .createTable('patrons', function(table) {
      table.increments('id').primary(); 
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('patrons')
    .dropTableIfExists('books')
    .dropTableIfExists('authors');
};
