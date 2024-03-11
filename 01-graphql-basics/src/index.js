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

let comments = [
  { id: "c001", text: "I like it", post: "p001", creator: "u003" },
  { id: "c002", text: "I love ❤️ it", post: "p003", creator: "u002" },
  { id: "c003", text: "Too good", post: "p002", creator: "u003" },
  { id: "c004", text: "This is how to graphql", post: "p001", creator: "u002" },
];

// Scalar Types -> ID, String, Int, Boolean, Float
const typeDefs = /* GraphQL */ `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
  }
  type User {
    id: ID!
    name: String!
    age: Int
    email: String!
    posts: [Post!]!
    comments: [Comment!]!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
  type Comment {
    id: ID!
    text: String!
    post: Post!
    creator: User!
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
    comments: (parent, args, context, info) => {
      return comments;
    },
  },
  User: {
    posts: (parent, args, context, info) => {
      return posts.filter((post) => post.author === parent.id);
    },
    comments: (parent, args, context, info) => {
      return comments.filter((comment) => comment.author === parent.id);
    },
  },
  Post: {
    author: (parent, args, context, info) => {
      return users.find((user) => user.id === parent.author);
    },
    comments: (parent, args, context, info) => {
      return comments.filter((comment) => comment.post === parent.id);
    },
  },
  Comment: {
    post: (parent, args, context, info) => {
      return posts.find((post) => post.id === parent.post);
    },
    creator: (parent, args, context, info) => {
      return users.find((user) => user.id === parent.creator);
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
