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
