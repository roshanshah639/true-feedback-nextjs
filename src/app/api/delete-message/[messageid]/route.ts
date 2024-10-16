/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/userModel";
import connectDB from "@/lib/connectDb";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  //extract messageid from request
  const messageId = params.messageid;

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

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    // if not updated
    if (updatedResult.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        {
          status: 404,
        }
      );
    }

    // return success response
    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error while deleting message", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update message",
      },
      {
        status: 500,
      }
    );
  }
}
