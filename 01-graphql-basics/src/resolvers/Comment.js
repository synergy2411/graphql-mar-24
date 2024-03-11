const Comment = {
  post: (parent, args, { db }, info) => {
    return db.posts.find((post) => post.id === parent.post);
  },
  creator: (parent, args, { db }, info) => {
    return db.users.find((user) => user.id === parent.creator);
  },
};

export default Comment;
