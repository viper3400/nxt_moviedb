import { PrismaClient } from '@prisma/client';
import startServer from '#root/server/startServer';

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  const genreCount = await prisma.videodb_genres.count()
  console.log(genreCount)
  startServer();
}
export const initConnection = () =>
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

