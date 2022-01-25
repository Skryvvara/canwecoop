import { PrismaClient, Category, Genre } from '../../node_modules/@prisma/client';
import { excludeProperties } from '.';

export async function upsertGame(
  data: any, 
  categories: Category[], 
  genres: Genre[], 
  db:  PrismaClient) 
  {
  const game = await db.game.upsert({
    where: { id: data.id },
    create: {
      ...data,
      categories: {
        connectOrCreate: categories.map((cat) => ({
          where: {
            id: cat.id
          },
          create: {
            ...cat
          }
        }))
      },
      genres: {
        connectOrCreate: genres.map((genre) => ({
          where: {
            id: genre.id
          },
          create: {
            ...genre
          }
        }))
      }
    },
    update: {
      ...excludeProperties(data, ['id']),
      categories: {
        connectOrCreate: categories.map((cat) => ({
          where: {
            id: cat.id
          },
          create: {
            ...cat
          }
        }))
      },
      genres: {
        connectOrCreate: genres.map((genre) => ({
          where: {
            id: genre.id
          },
          create: {
            ...genre
          }
        }))
      }
    },
    include: {
      categories: true,
      genres: true
    }
  });
  return game;
}
