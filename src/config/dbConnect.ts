import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    console.log(`MongoDB Connected in ${connectionInstance.connection.host}`);
  } catch (error) {
    const err: Error = error as Error;
    console.error(err.message);
    process.exit(1);
  }
};

export { connectDB };
