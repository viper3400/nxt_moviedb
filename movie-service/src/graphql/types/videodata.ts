import { builder } from "../builder";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//https://www.prisma.io/blog/fullstack-nextjs-graphql-prisma-2-fwpc6ds155

// Use the generic to infer the type for 'videodb_videodata'
builder.prismaObject("videodb_videodata", {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: (t: any) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    subtitle: t.exposeString("subtitle"),
    diskid: t.exposeID("diskid"),
  }),
});

// Define the queryField and add an argument for filtering by 'title' and 'disikd'
builder.queryField("videodb_videodata", (t) =>
  t.prismaField({
    type: ["videodb_videodata"],
    args: {
      title: t.arg.string(),
      diskid: t.arg.string(),
    },
    resolve: (query, _parent, args, _ctx, _info) => {
      const { title, diskid } = args; // Extract the title and diskid from the args
      return prisma.videodb_videodata.findMany({
        where: {
          AND: [
            {
              OR: [
                { title: title ? { contains: title } : undefined }, // Apply title filter if provided
                { subtitle: title ? { contains: title } : undefined }, // Apply subtitle filter if provided
              ],
            },
            { diskid: diskid ? { startsWith: diskid } : undefined }, // Apply diskid filter if provided
          ],
        },
        ...query, // Spread any query information
      });
    },
  }),
);
