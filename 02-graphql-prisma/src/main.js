import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const typeDefs = `
type Query {
    hello : String!
}
`;

const resolvers = {
  Query: {
    hello: () => "Hello Prisma",
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
