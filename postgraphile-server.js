import express from 'express';
import { postgraphile } from 'postgraphile';

const app = express();
const port = 5000;

app.use(
  postgraphile(
    process.env.DATABASE_URL || 'postgres://postgres:5862@localhost:5432/library_db',
    ['public'],
    {
      graphiql: true, 
      enhanceGraphiql: true,
      subscriptions: true,
      watchPg: true,
      graphiqlRoute: '/graphiql'
    }
  )
);

app.listen(port, () => {
  console.log(`PostGraphile server running at http://localhost:${port}/graphql`);
});