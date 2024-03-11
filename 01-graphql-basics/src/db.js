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

const db = { users, posts, comments };

export default db;
