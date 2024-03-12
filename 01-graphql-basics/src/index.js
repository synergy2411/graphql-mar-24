import { createSchema, createYoga, createPubSub } from "graphql-yoga";
import { createServer } from "node:http";
import { loadFile } from "graphql-import-files";
import db from "./db.js";
import resolvers from "./resolvers/index.js";

const typeDefs = loadFile("./src/schema.graphql");

const pubsub = createPubSub();

const schema = createSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  schema,
  graphiql: true,
  context: {
    db,
    pubsub,
  },
});

const server = createServer(yoga);

server.listen(4040, () => console.log("Yoga server started at PORT : 4040"));
