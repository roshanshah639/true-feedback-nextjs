/* eslint-disable @typescript-eslint/no-unused-vars */
import { resend } from "@/lib/resend";
import VerifyEmail from "../../emails/VerifyEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerifyEmail = async (
  username: string,
  email: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    // email config
    await resend.emails.send({
      from: "True Feedback <onboarding@resend.dev>",
      to: email,
      subject: "True Feedback | Email Verification Code",
      react: VerifyEmail({ username, otp: verifyCode }),
    });

    // return the success response
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Failed to send verification email", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
};

export default sendVerifyEmail;
