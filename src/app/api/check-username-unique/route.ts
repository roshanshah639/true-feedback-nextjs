/* eslint-disable @typescript-eslint/no-unused-vars */
import connectDB from "@/lib/connectDb";
import UserModel from "@/models/userModel";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

// create username query schema
const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  // connect to db
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    // decode username
    const result = usernameQuerySchema.safeParse(queryParam);

    // if result is not success
    if (!result.success) {
      const usernameErrors = result?.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Invalid Query Parameters",
        },
        {
          status: 400,
        }
      );
    }

    // extract username from results
    const { username } = result.data;

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
          message: "Username is already taken",
        },
        {
          status: 400,
        }
      );
    }

    // return success response
    return Response.json(
      {
        success: true,
        message: "Username is unique & available",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to check username unique", error);
    return Response.json(
      {
        success: false,
        message: "Failed to check username unique",
      },
      {
        status: 500,
      }
    );
  }
}
