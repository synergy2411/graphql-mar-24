import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const { hashSync, compareSync } = bcrypt;

const Mutation = {
  createUser: async (parent, args, { prisma }, info) => {
    const { name, email, age, password, role } = args.data;
    const hashedPassword = hashSync(password, 12);
    try {
      const createdUser = await prisma.user.create({
        data: {
          name,
          email,
          age,
          role,
          password: hashedPassword,
        },
      });
      return createdUser;
    } catch (err) {
      throw new GraphQLError(err);
    }
  },
  userLogin: async (parent, args, { prisma }, info) => {
    const { email, password } = args.data;
    try {
      const foundUser = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (!foundUser) {
        throw new GraphQLError("Unable to find user");
      }

      const isMatch = compareSync(password, foundUser.password);

      if (!isMatch) {
        throw new GraphQLError("Password does not match");
      }

      // Create token
      const token = jwt.sign({ id: foundUser.id }, "MY_SECRET_KEY");
      // return token
      return { token };
    } catch (err) {
      throw new GraphQLError(err);
    }
  },
  createPost: async (parent, args, { token, prisma }, info) => {
    const { title, body, published } = args.data;

    if (!token) {
      throw new GraphQLError("Token Not found. Please login.");
    }

    try {
      const { id } = jwt.verify(token, "MY_SECRET_KEY");
      const foundUser = await prisma.user.findFirst({
        where: {
          id,
        },
      });
      if (!foundUser) {
        throw new GraphQLError("Unable to find user");
      }
      const createdPost = await prisma.post.create({
        data: {
          title,
          body,
          published,
          userId: id,
        },
      });
      return createdPost;
    } catch (err) {
      throw new GraphQLError(err);
    }
  },
  deletePost: async (parent, args, { token, prisma }, info) => {
    if (!token) {
      throw new GraphQLError("Unable to find the user");
    }

    try {
      const { id } = jwt.verify(token, "MY_SECRET_KEY");

      const foundUser = prisma.user.findUnique({ where: { id } });
      if (!foundUser) {
        throw new GraphQLError("Unable to find the user");
      }

      const deletedPost = await prisma.post.delete({
        where: {
          id: args.postId,
        },
      });

      return deletedPost.id;
    } catch (err) {
      throw new GraphQLError(err);
    }
  },
};

export default Mutation;
