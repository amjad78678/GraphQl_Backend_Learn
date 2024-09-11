import UserService, {
  createUserPayload,
  iGetUserTokenPayload,
} from "./../services/user";
const queries = {
  getUserToken: async (_: any, payload: iGetUserTokenPayload) => {
    const result = await UserService.getUserToken(payload);
    return result;
  },
  getCurrentLoggedInUser: async (_: any, paremeteres: any, context: any) => {
    console.log("iam _", _, paremeteres, context);
    if (!context.user) {
      throw new Error("You are not loggedIn");
    }
    const result = await UserService.getCurrentLoggedInUser(context);
    return result;
  },
};

const mutations = {
  createUser: async (_: any, payload: createUserPayload) => {
    const result = await UserService.createUser(payload);
    return result;
  },
};

export const resolvers = { queries, mutations };
