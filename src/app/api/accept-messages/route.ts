/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/userModel";
import connectDB from "@/lib/connectDb";

export async function POST(request: Request) {
  // connect to db
  await connectDB();

  // get session
  const session = await getServerSession(authOptions);
  // get user from session
  const user: User = session?.user as User;

  // if session or user is not present
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User is not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  // extract id from user
  const userId = user._id;
  // extract acceptMessages flag
  const { acceptMessages } = await request.json();

  try {
    // find user by id & update
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true }
    );

    // if user does not exist
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    // return the success response
    return Response.json(
      {
        success: true,
        message: "User status to accept messages has been updated successfully",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to update user status to accept messages", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // connect to db
  await connectDB();

  // get session
  const session = await getServerSession(authOptions);
  // get user from session
  const user: User = session?.user as User;

  // if session or user is not present
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User is not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  // extract id from user
  const userId = user._id;

  try {
    // find user by id
    const foundUser = await UserModel.findById(userId);

    // if user does not exist
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // return the success response
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error getting user status to accept messages", error);

    return Response.json(
      {
        success: false,
        message: "Error getting user status to accept messages",
      },
      { status: 500 }
    );
  }
}
