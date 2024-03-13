const Query = {
  users: async (parent, args, { prisma }, info) => {
    const allUSers = await prisma.user.findMany({
      include: {
        posts: true,
      },
    });
    return allUSers;
  },
  posts: async (parent, args, { prisma }, info) => {
    const { take, skip, sort } = args;
    try {
      const allPosts = await prisma.post.findMany({
        include: {
          author: true,
        },
        take,
        skip,
        orderBy: {
          title: sort,
        },
      });
      return allPosts;
    } catch (err) {
      throw new GraphQLError(err);
    }
  },
};
export default Query;
