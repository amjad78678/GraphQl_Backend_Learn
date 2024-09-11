import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age?: number;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
