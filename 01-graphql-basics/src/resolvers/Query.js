import { GraphQLError } from "graphql";
const Query = {
  posts: (parent, args, { db }, info) => {
    if (args.query) {
      return db.posts.filter(
        (post) =>
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
      );
    }
    return db.posts;
  },
  users: (parent, args, { db }, info) => {
    if (args.query) {
      return db.users.filter((user) =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
    }
    return db.users;
  },
  comments: (parent, args, { db }, info) => {
    return db.comments;
  },
};

export default Query;
