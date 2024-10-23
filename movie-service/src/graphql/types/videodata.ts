/* eslint-disable @typescript-eslint/no-explicit-any */
import { builder } from "../builder";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
  ],
});

// Optionally, listen for query events
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Params: ' + e.params);
  console.log('Duration: ' + e.duration + 'ms');
});

//https://www.prisma.io/blog/fullstack-nextjs-graphql-prisma-2-fwpc6ds155

// Use the generic to infer the type for 'videodb_videodata'
builder.prismaObject("videodb_videodata", {
  fields: (t: any) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    subtitle: t.exposeString("subtitle"),
    diskid: t.exposeString("diskid"), // Change to exposeString if diskid is a string
    // Map genre names to a string array
    genres: t.field({
      type: ["String"], // Define the type as an array of strings
      resolve: (video: any) => {
        // Map the included genre names to a string array
        return video.videodb_videogenre.map((vg: any) => vg.genre.name)
    }}),
    mediaType: t.field({
      type: "String",
      resolve: (video: any) => {
        return video.videodb_mediatypes.name
      }
    })
  }),
});

// Define the queryField and add an argument for filtering by 'title' and 'diskid'
builder.queryField("videos", (t) =>
  t.prismaField({
    type: ["videodb_videodata"],
    args: {
      title: t.arg.string(),
      diskid: t.arg.string(),
      genreName: t.arg.string(),
      mediaType: t.arg.stringList()
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { title, diskid, genreName, mediaType } = args; // Extract the title and diskid from the args
      
      return await prisma.videodb_videodata.findMany({
        where: {
          AND: [
            {
              OR: [
                { title: title ? { contains: title } : undefined }, // Apply title filter if provided
                { subtitle: title ? { contains: title } : undefined }, // Apply subtitle filter if provided
              ],
            },
            { diskid: diskid ? { startsWith: diskid } : undefined }, // Apply diskid filter if provided
              genreName ? { 
                videodb_videogenre: {
                  some: {
                      genre: {
                        name: genreName ? { contains: genreName } : undefined, // Filter by genre name if provided
                    },
                  },
                },
              } : {},
            {
              videodb_mediatypes: {
                  name: mediaType ? { in: mediaType } : undefined
              }
            },
          ],
        },
        include: {
          videodb_videogenre: {
            select: {
              genre: {
                select: {
                  name: true, // Select genre name
                },
              },
            },
          },
          videodb_mediatypes: {
            select: {
              name: true
            }
          }
        },
        ...query, // Spread any query information
      });
    },
  }),
);