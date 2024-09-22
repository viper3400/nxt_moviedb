import { Express } from "express";
import { PrismaClient } from '@prisma/client';
import { time } from "console";

const prisma = new PrismaClient()
async function main() {
    // ... you will write your Prisma Client queries here
    const allGenres = await prisma.videodb_videogenre.findMany()
    console.log(allGenres)
  }

const setupRoutes = (app: Express) => {
    app.get("/genres/:id", async (req, res, next) => {
        try {
            const user = await prisma.videodb_genres.findUnique( {
                where: {
                    id: parseInt(req.params.id, 10) 
                }
            });

            if (!user) return next(new Error("Invalid genre id!"));

            return(res.json(user));
        } catch (err) {
            return next(err);
        }
    })

    app.get("/movies/:id", async (req, res, next) => {
        try {
            const user = await prisma.videodb_videodata.findUnique( {
                where: {
                    id: parseInt(req.params.id, 10) 
                }
            });

            if (!user) return next(new Error("Invalid genre id!"));

            return(res.json(user));
        } catch (err) {
            return next(err);
        }
    })

    app.get("/search/:title", async (req, res, next) => {
        try {
            const result = await prisma.videodb_videodata.findMany( {
                where: {
                    title: {
                        contains: req.params.title
                    }
                }
            })
        ;

            if (!result) return next(new Error("Invalid genre id!"));

            return(res.json(result));
        
        } catch (err) {
            return next(err);
        }
    })
}

export default setupRoutes;