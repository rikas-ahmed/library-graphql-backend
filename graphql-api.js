const { ApolloServer, gql } = require('apollo-server');
const { GraphQLClient } = require('graphql-request');

const postgraphileClient = new GraphQLClient('http://localhost:5000/graphql');

// Define your GraphQL schema. This is the public API contract.
const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
  }

  type Book {
    id: ID!
    title: String!
    genre: String
    publicationDate: String
    author: Author
  }

  type Query {
    listBooks: [Book]
    searchBooks(query: String!): [Book]
  }

  type Mutation {
    addBook(title: String!, authorId: Int!, genre: String, publicationDate: String): Book
    updateBook(id: Int!, authorId: Int, genre: String): Book
    deleteBook(id: Int!): Boolean
  }
`;

// Define the resolvers. This is where the logic happens.
const resolvers = {
  Query: {
    listBooks: async () => {
      // Forward the request to the PostGraphile server
      const query = gql`
        query {
          allBooks {
            nodes {
              id
              title
              genre
              publicationDate
              author: authorByAuthorId {
                id
                name
              }
            }
          }
        }
      `;
      const data = await postgraphileClient.request(query);
      return data.allBooks.nodes;
    },
    searchBooks: async (_, { query }) => {
      // This part will require a custom query or a filter on the PostGraphile side.
      // For now, we'll return an empty array as a placeholder.
      console.log(`Searching for books with query: "${query}"`);
      return [];
    },
  },
  Mutation: {
    addBook: async (_, { title, authorId, genre, publicationDate }) => {
      const mutation = gql`
        mutation AddBook($title: String!, $authorId: Int!, $genre: String, $publicationDate: String) {
          createBook(
            input: {
              book: {
                title: $title,
                authorId: $authorId,
                genre: $genre,
                publicationDate: $publicationDate
              }
            }
          ) {
            book {
              id
              title
              genre
            }
          }
        }
      `;
      const variables = { title, authorId, genre, publicationDate };
      const data = await postgraphileClient.request(mutation, variables);
      return data.createBook.book;
    },
    updateBook: async (_, { id, authorId, genre }) => {
      // Similar to `addBook`, you'll construct a mutation to call PostGraphile.
      // This is a placeholder for the logic.
      return { id, title: "Updated Placeholder", genre, authorId };
    },
    deleteBook: async (_, { id }) => {
      // Logic to check if a book is checked out and then delete it via PostGraphile.
      // This is also a placeholder for the logic.
      return true;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`GraphQL API server running at ${url}`);
});