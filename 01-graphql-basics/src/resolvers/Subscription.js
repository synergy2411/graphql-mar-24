const Subscription = {
  comment: {
    subscribe(parent, args, { db, pubsub }, info) {
      return pubsub.subscribe(`comment ${args.postId}`);
    },
    resolve: (payload) => payload,
  },
};

export default Subscription;
