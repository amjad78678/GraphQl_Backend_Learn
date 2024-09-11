import { ApolloServer } from "@apollo/server";
import userModel from "../models/userModel";
import { User } from "./user";

async function createApolloGraphQlServer() {
  //Create GraphQl Server
  const gqlServer = new ApolloServer({
    typeDefs: ` 
        ${User.typeDefs}

        type Query {
          ${User.queries} 
        }

        type Mutation {
          ${User.mutations}
        }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
      },
    },
  });

  //Start the graphql server
  await gqlServer.start();
  return gqlServer;
}

export default createApolloGraphQlServer;
