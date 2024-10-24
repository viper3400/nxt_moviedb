import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { schema } from "../graphql/schema";

import accessEnv from "#root/helpers/accessEnv";
import { createYoga } from "graphql-yoga";

const yoga = createYoga({ schema });

const PORT = parseInt(accessEnv("PORT", "7100"), 10);

const startServer = () => {
  const app = express();

  app.use(bodyParser.json());

  app.use(
    cors({
      origin: (origin, cb) => cb(null, true),
      credentials: true,
    }),
  );

  //setupRoutes(app)

  app.use(yoga.graphqlEndpoint, yoga);

  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    return res.status(500).json({ message: err.message });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Users service listening at port ${PORT}`);
  });
};

export default startServer;
