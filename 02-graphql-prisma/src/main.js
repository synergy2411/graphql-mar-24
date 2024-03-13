import { loadFile } from "graphql-import-files";
import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "node:http";

import { PrismaClient } from "@prisma/client";
import Mutation from "./resolvers/Mutation.js";
import Query from "./resolvers/Query.js";

const PORT = process.env.PORT || 4040;

const prisma = new PrismaClient();

const startServer = () => {
  const schema = createSchema({
    typeDefs: loadFile("./src/schema.graphql"),
    resolvers: { Query, Mutation },
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
        prisma,
      };
    },
  });

  const server = createServer(yoga);

  server.listen(PORT, () =>
    console.log("Yoga Server started at PORT : ", PORT)
  );
};

async function main() {
  startServer();
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
