import { Express } from "express"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const setupRoutes = (app: Express) => {
    app.get("/genres/:id", async (req, res, next) => {
        try {
            const user = await prisma.videodb_genres.findUnique( {
                where: {
                    id: parseInt(req.params.id, 10) 
                }
            })

            if (!user) return next(new Error("Invalid genre id!"))

            return(res.json(user))
        } catch (err) {
            return next(err)
        }
    })

    app.get("/movies/:id", async (req, res, next) => {
        try {
            const user = await prisma.videodb_videodata.findUnique( {
                where: {
                    id: parseInt(req.params.id, 10) 
                }
            })

            if (!user) return next(new Error("Invalid genre id!"))

            return(res.json(user))
        } catch (err) {
            return next(err)
        }
    })

    app.get("/movies", async (req, res, next) => {
        const { title, take } = req.query
    
        try {
            // Type narrowing: Ensure `title` is a valid string
            if (typeof title === 'string' && title.trim().length > 2) {
                // Parse 'take' as an integer if it's a valid string number
                const takeValue = typeof take === 'string' ? parseInt(take) : undefined
    
                // Build the query object dynamically
                const queryOptions = {
                    where: {
                        title: {
                            contains: title
                        }
                    },
                    select: {
                        title: true,
                        subtitle: true,
                        id: true
                    },
                    ...(takeValue && takeValue > 0 ? { take: takeValue } : {}) // Dynamically add 'take' if valid
                }
    
                const result = await prisma.videodb_videodata.findMany(queryOptions)
    
                if (!result) return next(new Error("Invalid request!"))
    
                return res.json(result)
            } else {
                return res.json("") // If title is not valid, return empty response
            }
        } catch (err) {
            return next(err)
        }
    })
}

export default setupRoutes