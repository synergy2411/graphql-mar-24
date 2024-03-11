import { GraphQLError } from "graphql";
import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { v4 } from "uuid";

// u001 -> p001, p003 -> c001, c004, c002
// all the created posts to be deleted
// all the created comments to be deleted
// all the comment which is made on the post created by user to be deleted

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
  type Mutation {
    createUser(data: CreateUserInput): User!
    deleteUser(authorId: ID!): ID!
    createPost(data: CreatePostInput): Post!
    deletePost(postId: ID!): ID!
    createComment(data: CreateCommentInput): Comment!
    deleteComment(commentId: ID!): ID!
  }
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
  input CreateUserInput {
    name: String!
    age: Int!
    email: String!
  }
  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean
    authorId: ID!
  }
  input CreateCommentInput {
    text: String!
    postId: ID!
    creator: ID!
  }
`;

const resolvers = {
  Mutation: {
    createUser: (parent, args, context, info) => {
      const { name, age, email } = args.data;
      let isMatched = users.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );
      if (isMatched) {
        throw new GraphQLError("Email already taken.");
      }
      const newUser = {
        name,
        age,
        email,
        id: v4(),
      };
      users.push(newUser);
      return newUser;
    },
    deleteUser: (parent, args, context, info) => {
      const position = users.findIndex((user) => user.id === args.authorId);
      if (position === -1) {
        throw new GraphQLError("Unable to find user for - " + args.authorId);
      }

      posts = posts.filter((post) => {
        const isMatch = post.author === args.authorId;

        if (isMatch) {
          comments = comments.filter((comment) => comment.post !== post.id);
        }
        return !isMatch;
      });

      comments = comments.filter(
        (comment) => comment.creator !== args.authorId
      );

      const [deletedUser] = users.splice(position, 1);

      return deletedUser.id;
    },
    createPost: (parent, args, context, info) => {
      const { title, body, published, authorId } = args.data;

      const isMatched = users.some((user) => user.id === authorId);
      if (!isMatched) {
        throw new GraphQLError("User not found");
      }

      let newPost = {
        id: v4(),
        title,
        body,
        published: published ? published : false,
        author: authorId,
      };

      posts.push(newPost);

      return newPost;
    },
    deletePost: (parent, args, context, info) => {
      const position = posts.findIndex((post) => post.id === args.postId);

      if (position === -1) {
        throw new GraphQLError("Unable to find post for - " + args.postId);
      }

      comments = comments.filter((comment) => comment.post !== args.postId);

      const [deletedPost] = posts.splice(position, 1);
      return deletedPost.id;
    },
    createComment: (parent, args, context, info) => {
      const { text, postId, creator } = args.data;
      const isUserMatch = users.some((user) => user.id === creator);
      if (!isUserMatch) {
        throw new GraphQLError("Unable to find user");
      }
      const isPostMatched = posts.some((post) => post.id === postId);
      if (!isPostMatched) {
        throw new GraphQLError("Post not found");
      }
      const newComment = {
        id: v4(),
        text,
        post: postId,
        creator,
      };
      comments.push(newComment);
      return newComment;
    },
    deleteComment: (parent, args, context, info) => {
      const position = comments.findIndex(
        (comment) => comment.id === args.commentId
      );

      if (position === -1) {
        throw new GraphQLError("Unable to find comment for " + args.commentId);
      }

      const [deletedComment] = comments.splice(position, 1);

      return deletedComment.id;
    },
  },
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
