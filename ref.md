# REST API

- Over-fetching : More data than needed in app
  /products : [ {name, qty, isAvailable, category}, {}, {}]

- Under-fetching : Less data than needed in app
  /books : [{id, title, authorName, isbn, numOfPages}]

/books/199

/books/199/author

/authors

# GraphQL API

- No over-fetching / under-fetching
- Single Endpoint
- Fast
- Flexble
- Better alternate to REST

# GraphQL Server using NodeJS

- graphql-yoga
- graphql

# Steps for Server Creation

- npm init -y
- npm install graphql-yoga graphql
- npm install nodemon -D
- Package.json file > "start" : "nodemon src/index.js"
- npm run start || npm start
- npm install uuid

# GraphQL Operations

- Query : Reading the data
- Mutation : Creating, Updating and Deleting the data
- Subscription : Real time updates; Connected Architecture based, PubSub Pattern

Request-Response Cycle

---

- Subscription
- MongoDB
- Prisma - ORM
- Authentication using JWT
- Protect the resources

# NoSQL Databases

- Document based DB -> MongoDB
- Column based DB -> Cassendra
- Graph based DB -> Neo4Js
- key-value pair based -> Redis

# MongoDB Installation

- mongod - Mongo Deamon - Server
- mongosh - Mongo Client

Mongo URI -
mongodb+srv://testuser:5D4Ib5fire4ZGPmK@cluster0.e9xsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

testuser
5D4Ib5fire4ZGPmK

# Prisma Project

> npm init -y
> npx prisma init
> install Extensions - Prettier, Prisma
> Open the workspace settings.json
> npx prisma db push || npx prisma migrate dev --name=myMigration
