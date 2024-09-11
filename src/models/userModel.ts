import mongoose, { Schema, Document } from "mongoose";
import bcryptjs from "bcryptjs";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age?: number;
  matchPassword(enteredPassword: string): Promise<boolean>;
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

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

const userModel = mongoose.model<IUser>("User", UserSchema);
export default userModel;
