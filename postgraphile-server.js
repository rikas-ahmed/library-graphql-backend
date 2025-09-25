const express = require('express');
const { postgraphile } = require('postgraphile');

const app = express();
const port = 5000; // Use a different port to avoid conflicts with your main server

app.use(
  postgraphile(
    process.env.DATABASE_URL || 'postgres://postgres:5862@localhost:5432/library_db',
    ['public'], // This tells PostGraphile to expose the tables in the 'public' schema
    {
      graphiql: true, // Enables the GraphiQL interface for testing
      enhanceGraphiql: true,
      subscriptions: true,
      watchPg: true, // Automatically updates the schema when you run new migrations
      graphiqlRoute: '/graphiql'
    }
  )
);

app.listen(port, () => {
  console.log(`PostGraphile server running at http://localhost:${port}/graphql`);
});