import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { connectDB } from "./config/dbConnect";
import User from "./models/userModel";

async function startServer() {
  await connectDB();
  //Create GraphQl Server
  const gqlServer = new ApolloServer({
    typeDefs: ` 

        type User {
          name: String
          email: String
          password: String
        }

        type Query {
            hello: String
            fetchUserData(userId: String): User
            amjData(name: String): String
        }

        type Mutation {
          createUser(name: String!, email: String!, password: String!, age: Int): Boolean
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

      Mutation: {
        createUser: async (
          _,
          {
            name,
            email,
            password,
            age,
          }: { name: string; email: string; password: string; age: number }
        ) => {
          const userExists = await User.findOne({ email });
          if (userExists) return false;
          const user = await User.create({ name, email, password, age });
          if (!user) return false;
          return true;
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
