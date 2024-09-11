import userModel from "../../models/userModel";
import jwt, { decode } from "jsonwebtoken";

export interface createUserPayload {
  name: string;
  email: string;
  password: string;
  age: number;
}

export interface iGetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  public static async createUser(payload: createUserPayload) {
    const { name, email, password, age } = payload;
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }
    const user = new userModel({ name, email, password, age });
    const savedUser = await user.save();
    return savedUser._id;
  }

  public static async getUserToken(payload: iGetUserTokenPayload) {
    const { email, password } = payload;
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    if (!(await user.matchPassword(password))) {
      throw new Error("Incorrect Password");
    }

    //Generate JWT Token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);
    return token;
  }

  public static async getCurrentLoggedInUser(context: any) {
    const user = await userModel.findOne({ _id: context.user._id });
    return user;
  }

  public static async decodeJwtToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }
}

export default UserService;
