import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";

let users = [
  { id: "u001", name: "monica", email: "monica@example.com", age: 23 },
  { id: "u002", name: "ross", email: "ross@example.com", age: 28 },
  { id: "u003", name: "joey", email: "joey@example.com", age: 24 },
];

let posts = [
  {
    id: "p001",
    title: "GraphQL 101",
    body: "Awesome book",
    published: false,
    author: "u001",
  },
  {
    id: "p002",
    title: "Mastering GraphQL",
    body: "for advanced users",
    published: true,
    author: "u002",
  },
  {
    id: "p003",
    title: "Learn React",
    body: "Learn React from Beginning",
    published: true,
    author: "u001",
  },
];

// Scalar Types -> ID, String, Int, Boolean, Float
const typeDefs = /* GraphQL */ `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
  }
  type User {
    id: ID!
    name: String!
    age: Int
    email: String!
    posts: [Post!]!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }
`;

const resolvers = {
  Query: {
    posts: (parent, args, context, info) => {
      if (args.query) {
        return posts.filter(
          (post) =>
            post.title.toLowerCase().includes(args.query.toLowerCase()) ||
            post.body.toLowerCase().includes(args.query.toLowerCase())
        );
      }
      return posts;
    },
    users: (parent, args, context, info) => {
      if (args.query) {
        return users.filter((user) =>
          user.name.toLowerCase().includes(args.query.toLowerCase())
        );
      }
      return users;
    },
  },
  User: {
    posts: (parent, args, context, info) => {
      return posts.filter((post) => post.author === parent.id);
    },
  },
  Post: {
    author: (parent, args, context, info) => {
      return users.find((user) => user.id === parent.author);
    },
  },
};

const schema = createSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  schema,
  graphiql: true,
});

const server = createServer(yoga);

server.listen(4040, () => console.log("Yoga server started at PORT : 4040"));
