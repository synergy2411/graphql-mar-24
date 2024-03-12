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
  }
  type Query {
    users: [User!]!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
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
  }
`;

const resolvers = {
  Mutation: {
    createUser: async (parent, args, context, info) => {
      const { name, email, age, password } = args.data;
      const hashedPassword = hashSync(password, 12);
      try {
        const createdUser = await prisma.user.create({
          data: {
            name,
            email,
            age,
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
