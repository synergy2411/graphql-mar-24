import { v4 } from "uuid";
import { GraphQLError } from "graphql";
const Mutation = {
  createUser: (parent, args, { db }, info) => {
    const { name, age, email } = args.data;
    let isMatched = db.users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
    if (isMatched) {
      throw new GraphQLError("Email already taken.");
    }
    const newUser = {
      name,
      age,
      email,
      id: v4(),
    };
    db.users.push(newUser);
    return newUser;
  },
  deleteUser: (parent, args, { db }) => {
    const position = db.users.findIndex((user) => user.id === args.authorId);
    if (position === -1) {
      throw new GraphQLError("Unable to find user for - " + args.authorId);
    }

    db.posts = db.posts.filter((post) => {
      const isMatch = post.author === args.authorId;

      if (isMatch) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }
      return !isMatch;
    });

    db.comments = db.comments.filter(
      (comment) => comment.creator !== args.authorId
    );

    const [deletedUser] = db.users.splice(position, 1);

    return deletedUser.id;
  },
  createPost: (parent, args, { db }, info) => {
    const { title, body, published, authorId } = args.data;

    const isMatched = db.users.some((user) => user.id === authorId);
    if (!isMatched) {
      throw new GraphQLError("User not found");
    }

    let newPost = {
      id: v4(),
      title,
      body,
      published: published ? published : false,
      author: authorId,
    };

    db.posts.push(newPost);

    return newPost;
  },
  deletePost: (parent, args, { db }, info) => {
    const position = db.posts.findIndex((post) => post.id === args.postId);

    if (position === -1) {
      throw new GraphQLError("Unable to find post for - " + args.postId);
    }

    db.comments = db.comments.filter((comment) => comment.post !== args.postId);

    const [deletedPost] = db.posts.splice(position, 1);
    return deletedPost.id;
  },
  createComment: (parent, args, { db, pubsub }, info) => {
    const { text, postId, creator } = args.data;
    const isUserMatch = db.users.some((user) => user.id === creator);
    if (!isUserMatch) {
      throw new GraphQLError("Unable to find user");
    }
    const isPostMatched = db.posts.some((post) => post.id === postId);
    if (!isPostMatched) {
      throw new GraphQLError("Post not found");
    }
    const newComment = {
      id: v4(),
      text,
      post: postId,
      creator,
    };
    pubsub.publish(`comment`, { mutationType: "CREATED", comment: newComment });
    db.comments.push(newComment);
    return newComment;
  },
  deleteComment: (parent, args, { db, pubsub }, info) => {
    const position = db.comments.findIndex(
      (comment) => comment.id === args.commentId
    );

    if (position === -1) {
      throw new GraphQLError("Unable to find comment for " + args.commentId);
    }

    const [deletedComment] = db.comments.splice(position, 1);

    pubsub.publish("comment", {
      mutationType: "DELETED",
      comment: deletedComment,
    });
    return deletedComment.id;
  },
  updateComment: (parent, args, { db, pubsub }, info) => {
    const { commentId, text } = args;
    const foundComment = db.comments.find(
      (comment) => comment.id === commentId
    );
    if (!foundComment) {
      throw new GraphQLError("Comment not founc for - " + commentId);
    }

    foundComment.text = text;

    pubsub.publish("comment", {
      mutationType: "UPDATED",
      comment: foundComment,
    });
    return foundComment;
  },
};

export default Mutation;
