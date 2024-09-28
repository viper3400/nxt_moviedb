import { builder } from "../builder"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Use the generic to infer the type for 'videodb_videodata'
builder.prismaObject('videodb_videodata', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: (t: any) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    subtitle: t.exposeString('subtitle'),
    diskid: t.exposeID('diskid')
  })
})

// Define the queryField and add an argument for filtering by 'title'
builder.queryField("videodb_videodata", (t) =>
  t.prismaField({
    type: ['videodb_videodata'],
    args: {
      title: t.arg.string(), // Add the 'title' argument
    },
    resolve: (query, _parent, args, _ctx, _info) => {
      const { title } = args // Extract the title from the args

      // If 'title' is provided, filter based on the title
      return prisma.videodb_videodata.findMany({
        where: {
          title: title ? { contains: title } : undefined, // Apply title filter if provided
        },
        ...query, // Spread any query information
      })
    },
  })
)
