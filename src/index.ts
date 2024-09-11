import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { connectDB } from "./config/dbConnect";
import createApolloGraphQlServer from "./graphql";
import UserService from "./graphql/services/user";

async function startServer() {
  await connectDB();
  const app = express();
  const PORT = Number(process.env.PORT) || 8001;
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  const gqlServer = await createApolloGraphQlServer();
  app.use(
    "/graphql",
    expressMiddleware(gqlServer, {
      context: async ({ req, res }) => {
        const token = req.headers.authorization?.split(" ")[0];
        try {
          const user = await UserService.decodeJwtToken(token!);
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

startServer();
