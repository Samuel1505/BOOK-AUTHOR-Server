const { ApolloServer, gql } = require("apollo-server");

// Sample data
let authors = [
  { id: "1", name: "J.K. Rowling" },
  { id: "2", name: "J.R.R. Tolkien" },
  { id: "3", name: "Chinua Achebe" },
  { id: "4", name: "George R.R. Martin" },
];

let books = [
  { id: "1", title: "Harry Potter", authorId: "1" },
  { id: "2", title: "The Lord of the Rings", authorId: "2" },
  { id: "3", title: "Things fall Apart", authorId: "3" },
  { id: "4", title: "A Game of Thrones", authorId: "4" },
  { id: "5", title: "The Hobbit", authorId: "2" },
  { id: "6", title: "Arrow of God", authorId: "3" },
  { id: "7", title: "A Clash of Kings", authorId: "4" },
];

// GraphQL schema
const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    books: [Book!]!
  }

  type Book {
    id: ID!
    title: String!
    author: Author!
  }

  type Query {
    books: [Book!]!
    authors: [Author!]!
    getBooksByAuthor(name: String!): [Book!]!
    getAuthorByBook(title: String!): Author
  }

  type Mutation {
    addAuthor(name: String!): Author!
    addBook(title: String!, authorId: ID!): Book!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    books: () => books,
    authors: () => authors,
    getBooksByAuthor: (_, { name }) => {
      const author = authors.find((a) => a.name === name);
      return author ? books.filter((b) => b.authorId === author.id) : [];
    },
    getAuthorByBook: (_, { title }) => {
      const book = books.find((b) => b.title === title);
      return book ? authors.find((a) => a.id === book.authorId) : null;
    },
  },
  Mutation: {
    addAuthor: (_, { name }) => {
      const newAuthor = { id: String(authors.length + 1), name };
      authors.push(newAuthor);
      return newAuthor;
    },
    addBook: (_, { title, authorId }) => {
      const newBook = { id: String(books.length + 1), title, authorId };
      books.push(newBook);
      return newBook;
    },
  },
  Author: {
    books: (parent) => books.filter((b) => b.authorId === parent.id),
  },
  Book: {
    author: (parent) => authors.find((a) => a.id === parent.authorId),
  },
};

// Start Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
