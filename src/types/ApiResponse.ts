/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from "@/models/userModel";

export type ApiResponse = {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
};
