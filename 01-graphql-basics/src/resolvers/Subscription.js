const Subscription = {
  comment: {
    subscribe(parent, args, { db, pubsub }, info) {
      return pubsub.subscribe(`comment`);
    },
    resolve: (payload) => payload,
  },
  post: {
    subscribe: (parent, args, { db, pubsub }, info) => {
      return pubsub.subscribe("post");
    },
    resolve: (payload) => payload,
  },
};

export default Subscription;
