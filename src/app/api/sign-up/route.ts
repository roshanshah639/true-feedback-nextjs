/* eslint-disable @typescript-eslint/no-unused-vars */
import connectDB from "@/lib/connectDb";
import UserModel from "@/models/userModel";
import sendVerifyEmail from "@/helpers/sendVerifyEmail";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
  // connect to db
  await connectDB();

  try {
    // extract details from request/frontend
    const { username, email, password } = await request.json();

    // find user by username
    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // if user already exists
    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "User already exists with this username",
        },
        { status: 400 }
      );
    }

    // find user by email
    const existingUserByEmail = await UserModel.findOne({ email });

    // generate verify code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // check if user already exists
    if (existingUserByEmail) {
      // if user is already verified
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        // hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // update user
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        // save user
        await existingUserByEmail.save();
      }
    } else {
      // hash the password
      const hashedPassword = await bcryptjs.hash(password, 10);

      // set new expiry date
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      // create new user
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAccepptingMessages: true,
        messages: [],
      });

      // save user
      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerifyEmail(username, email, verifyCode);

    // if email response is not success
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 403 }
      );
    }

    // send success response
    return Response.json(
      {
        success: true,
        message:
          "User registered successfully. Check your email for verification code",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to register user", error);
    return Response.json(
      {
        success: false,
        message: "Failed to register user",
      },
      { status: 500 }
    );
  }
}
