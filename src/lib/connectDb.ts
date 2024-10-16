/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";
import { DB_NAME } from "@/constants";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const connectDB = async (): Promise<void> => {
  try {
    const db = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}` || "",
      {}
    );

    // create connection object
    connection.isConnected = db.connections[0].readyState;

    // Log the connection success
    console.log(`DB Connected Successfully! At Db Host: ${db.connection.host}`);
  } catch (error) {
    // Log the connection error
    console.error("DB Connection Failed! Make sure MongoDB is running!", error);

    // exit process with failure
    process.exit(1);
  }
};

export default connectDB;
