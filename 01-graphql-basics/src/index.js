import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";

let users = [
  { id: "u001", name: "monica", email: "monica@example.com", age: 23 },
  { id: "u002", name: "ross", email: "ross@example.com", age: 28 },
  { id: "u003", name: "joey", email: "joey@example.com", age: 24 },
];

let posts = [
  { id: "p001", title: "GraphQL 101", body: "Awesome book", published: false },
  {
    id: "p002",
    title: "Mastering GraphQL",
    body: "for adbaced users",
    published: true,
  },
  {
    id: "p003",
    title: "Learn React",
    body: "Learn React from Beginning",
    published: true,
  },
];

// Scalar Types -> ID, String, Int, Boolean, Float
const typeDefs = /* GraphQL */ `
  type Query {
    userId: ID!
    hello: String!
    age: Int!
    isAdmin: Boolean!
    gpa: Float!
    me: User!
    post: Post!
    friends: [String!]!
    users: [User!]!
    posts: [Post!]!
  }
  type User {
    id: ID!
    name: String!
    age: Int
    email: String!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

const resolvers = {
  Query: {
    posts: () => {
      return posts;
    },
    users: () => {
      return users;
    },
    friends: () => {
      return ["Monica", "Ross", "Rachel", "Joey"];
    },
    hello: () => "World",
    age: () => 21,
    isAdmin: () => true,
    gpa: () => 3.14,
    userId: () => "test123",
    me: () => {
      const user = {
        id: "110",
        name: "Monica",
        email: "monica@test.com",
        age: null,
      };
      return user;
    },
    post: () => {
      const post = {
        id: "p001",
        title: "Graphql 101",
        body: "...",
        published: false,
      };
      return post;
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
