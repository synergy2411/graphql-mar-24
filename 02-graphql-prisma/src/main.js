import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const createdUser = await prisma.user.create({
    data: {
      name: "ross",
      email: "ross@test.com",
      age: 25,
    },
  });

  console.log(createdUser);
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
