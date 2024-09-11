import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function startServer() {
  //Create GraphQl Server
  const gqlServer = new ApolloServer({
    typeDefs: ` 

        type User {
          name: String
          number: String
        }
        type Query {
            fetchUserData(userId: String): User
            hello: String
            amjData(name: String): String
        }

    `, //Schema
    resolvers: {
      Query: {
        hello: () => `Hello mone i am from graphQl server`,
        amjData: (_, { name }) => `His name is ${name}`,
        fetchUserData: (_, { userId }) => {
          return {
            name: `Enter name amjad ente id ${userId}`,
            number: "7306149125",
          };
        },
      },
    },
  });

  //Start the graphql server
  await gqlServer.start();
  const app = express();
  const PORT = Number(process.env.PORT) || 8001;
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });
  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

startServer();
