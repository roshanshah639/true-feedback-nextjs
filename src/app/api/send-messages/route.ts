import connectDB from "@/lib/connectDb";
import UserModel from "@/models/userModel";
import { Message } from "@/models/userModel";

export async function POST(request: Request) {
  // connect to db
  await connectDB();

  try {
    // extract username, content from request/frontend
    const { username, content } = await request.json();

    // find user by username
    const user = await UserModel.findOne({ username });

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

    // if user is not accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 400 }
      );
    }

    // create new message
    const newMessage = {
      content,
      createdAt: new Date(),
    };

    // add message to user's messages array
    user.messages.push(newMessage as Message);

    // save user
    await user.save();

    // return success response
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send messages", error);
    return Response.json(
      {
        success: false,
        message: "Failed to send messages",
      },
      { status: 500 }
    );
  }
}
