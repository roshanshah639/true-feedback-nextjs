/* eslint-disable @typescript-eslint/no-unused-vars */
import connectDB from "@/lib/connectDb";
import UserModel from "@/models/userModel";
import { use } from "react";

export async function POST(request: Request) {
  // connect to db
  await connectDB();

  try {
    // extract code & username from request/frontend
    const { username, code } = await request.json();

    // decode username
    const decodedUsername = decodeURIComponent(username);

    // find user by username
    const user = await UserModel.findOne({ username: decodedUsername });

    // if user does not exist
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // check if code is valid
    const isCodeValid = user.verifyCode === code;
    // check if code is not expired
    const isCodeNotExpired = user.verifyCodeExpiry > new Date();

    // if code is valid & not expired
    if (isCodeValid && isCodeNotExpired) {
      // update isVerified to true
      user.isVerified = true;

      // save updated user
      await user.save();

      // return success response
      return Response.json(
        {
          success: true,
          message: "User email verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has been expired. Please signup again to get new verification code",
        },
        { status: 500 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Failed to verify user email", error);
    return Response.json(
      {
        success: false,
        message: "Failed to verify user email",
      },
      { status: 500 }
    );
  }
}
