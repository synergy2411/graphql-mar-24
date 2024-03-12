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
  }
  type Query {
    users: [User!]!
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
    userId: ID!
  }
  enum Role {
    ANALYST
    PROGRAMMER
    MANAGER
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
        const token = jwt.sign({ id: foundUser.id }, "MY_SECRET_KET");
        // return token
        return { token };
      } catch (err) {
        throw new GraphQLError(err);
      }
    },
    createPost: async (parent, args, context, info) => {
      const { title, body, published, userId } = args.data;

      try {
        const foundUser = await prisma.user.findFirst({
          where: {
            id: userId,
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
            userId,
          },
        });
        return createdPost;
      } catch (err) {
        throw new GraphQLError(err);
      }
    },
  },
  Query: {
    users: async () => {
      const allUSers = await prisma.user.findMany();
      return allUSers;
    },
  },
};

const startServer = () => {
  const schema = createSchema({
    typeDefs,
    resolvers,
  });

  const yoga = createYoga({ schema });

  const server = createServer(yoga);

  server.listen(4044, () => console.log("Yoga Server started at PORT : 4044"));
};

async function main() {
  startServer();
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
