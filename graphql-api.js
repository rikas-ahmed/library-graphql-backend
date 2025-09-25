//Dependencies
import { ApolloServer, gql } from 'apollo-server';
import { GraphQLClient } from 'graphql-request';

const postgraphileClient = new GraphQLClient('http://localhost:5000/graphql');

//GraphQL schema
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

  type BookConnection {
    nodes: [Book]
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type Query {
    listBooks(first: Int, after: String, genre: String, authorName: String): BookConnection
    searchBooks(query: String!): [Book]
  }

  type Mutation {
    addBook(title: String!, authorId: Int!, genre: String, publicationDate: String): Book
    updateBook(id: Int!, authorId: Int, genre: String): Book
    deleteBook(id: Int!): Boolean
  }
`;

//Resolvers
const resolvers = {
  Query: {
    listBooks: async (_, { first, after, genre, authorName }) => {
      //Filter condition
      let condition = {};
      if (genre) {
        condition.genre = { equalTo: genre };
      }
      if (authorName) {
        condition.authorByAuthorId = { name: { equalTo: authorName } };
      }

      //Pagination and filters
      const query = gql`
        query AllBooks($first: Int, $after: Cursor, $condition: BookCondition) {
          allBooks(first: $first, after: $after, condition: $condition) {
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
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
          }
        }
      `;
      const variables = { first, after, condition };
      const data = await postgraphileClient.request(query, variables);

      //Return data
      return {
        nodes: data.allBooks.nodes,
        pageInfo: data.allBooks.pageInfo,
      };
    },
    searchBooks: async (_, { query }) => {
      const searchMutation = gql`
        query Search($query: String!) {
          allBooks(condition: {
            or: [
              { title: { includesInsensitive: $query } },
              { authorByAuthorId: { name: { includesInsensitive: $query } } }
            ]
          }) {
            nodes {
              id
              title
              genre
              author: authorByAuthorId {
                id
                name
              }
            }
          }
        }
      `;
      const variables = { query };
      const data = await postgraphileClient.request(searchMutation, variables);
      return data.allBooks.nodes;
    },     
  },
  Mutation: {
    addBook: async (_, { title, authorId, genre, publicationDate }) => {
      const mutation = gql`
        mutation AddBook($title: String!, $authorId: Int!, $genre: String, $publicationDate: Date) {
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
      const mutation = gql`
        mutation UpdateBook($id: Int!, $authorId: Int, $genre: String) {
          updateBook(
            input: {
              id: $id,
              bookPatch: {
                authorId: $authorId,
                genre: $genre
              }
            }
          ) {
            book {
              id
              title
              genre
              author {
                id
                name
              }
            }
          }
        }
      `;
      const variables = { id, authorId, genre };
      const data = await postgraphileClient.request(mutation, variables);
      return data.updateBook.book;
    },
    deleteBook: async (_, { id }) => {
      //Delete mutation
      const mutation = gql`
        mutation DeleteBook($id: Int!) {
          deleteBook(input: { id: $id }) {
            book {
              id
            }
          }
        }
      `;
      const variables = { id };
      const data = await postgraphileClient.request(mutation, variables);
      return !!data.deleteBook; 
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`GraphQL API server running at ${url}`);
});