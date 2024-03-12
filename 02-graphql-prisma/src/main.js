import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";
import { GraphQLError } from "graphql";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { hashSync, compareSync } = bcrypt;

const prisma = new PrismaClient();

const typeDefs = /* GraphQL */ `
  type Mutation {
    createUser(data: CreateUserInput!): User!
    userLogin(data: LoginUserInput): LoginPayload!
    createPost(data: CreatePostInput): Post!
    deletePost(postId: ID!): ID!
  }
  type Query {
    users: [User!]!
    posts(take: Int, skip: Int, sort: SortEnum): [Post!]!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
    role: Role!
    posts: [Post!]!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean
    author: User!
  }
  type LoginPayload {
    token: String!
  }
  input LoginUserInput {
    email: String!
    password: String!
  }
  input CreateUserInput {
    name: String!
    email: String!
    age: Int!
    password: String!
    role: Role!
  }
  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean
  }
  enum Role {
    ANALYST
    PROGRAMMER
    MANAGER
  }
  enum SortEnum {
    asc
    desc
  }
`;

const resolvers = {
  Mutation: {
    createUser: async (parent, args, context, info) => {
      const { name, email, age, password, role } = args.data;
      const hashedPassword = hashSync(password, 12);
      try {
        const createdUser = await prisma.user.create({
          data: {
            name,
            email,
            age,
            role,
            password: hashedPassword,
          },
        });
        return createdUser;
      } catch (err) {
        throw new GraphQLError(err);
      }
    },
    userLogin: async (parent, args, context, info) => {
      const { email, password } = args.data;
      try {
        const foundUser = await prisma.user.findFirst({
          where: {
            email,
          },
        });
        if (!foundUser) {
          throw new GraphQLError("Unable to find user");
        }

        const isMatch = compareSync(password, foundUser.password);

        if (!isMatch) {
          throw new GraphQLError("Password does not match");
        }

        // Create token
        const token = jwt.sign({ id: foundUser.id }, "MY_SECRET_KEY");
        // return token
        return { token };
      } catch (err) {
        throw new GraphQLError(err);
      }
    },
    createPost: async (parent, args, { token }, info) => {
      const { title, body, published } = args.data;

      if (!token) {
        throw new GraphQLError("Token Not found. Please login.");
      }

      try {
        const { id } = jwt.verify(token, "MY_SECRET_KEY");
        const foundUser = await prisma.user.findFirst({
          where: {
            id,
          },
        });
        if (!foundUser) {
          throw new GraphQLError("Unable to find user");
        }
        const createdPost = await prisma.post.create({
          data: {
            title,
            body,
            published,
            userId: id,
          },
        });
        return createdPost;
      } catch (err) {
        throw new GraphQLError(err);
      }
    },
    deletePost: async (parent, args, { token }, info) => {
      if (!token) {
        throw new GraphQLError("Unable to find the user");
      }

      try {
        const { id } = jwt.verify(token, "MY_SECRET_KEY");

        const foundUser = prisma.user.findUnique({ where: { id } });
        if (!foundUser) {
          throw new GraphQLError("Unable to find the user");
        }

        const deletedPost = await prisma.post.delete({
          where: {
            id: args.postId,
          },
        });

        return deletedPost.id;
      } catch (err) {
        throw new GraphQLError(err);
      }
    },
  },
  Query: {
    users: async () => {
      const allUSers = await prisma.user.findMany({
        include: {
          posts: true,
        },
      });
      return allUSers;
    },
    posts: async (parent, args, context, info) => {
      const { take, skip, sort } = args;
      try {
        const allPosts = await prisma.post.findMany({
          include: {
            author: true,
          },
          take,
          skip,
          orderBy: {
            title: sort,
          },
        });
        return allPosts;
      } catch (err) {
        throw new GraphQLError(err);
      }
    },
  },
};

const startServer = () => {
  const schema = createSchema({
    typeDefs,
    resolvers,
  });

  const yoga = createYoga({
    schema,
    graphiql: true,
    context: ({ request, params }) => {
      let token = null;
      const authHeader = request.headers.get("authorization");
      if (authHeader) {
        token = authHeader.split(" ")[1];
      }
      return {
        token,
      };
    },
  });

  const server = createServer(yoga);

  server.listen(4044, () => console.log("Yoga Server started at PORT : 4044"));
};

async function main() {
  startServer();
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
