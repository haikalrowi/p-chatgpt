import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, validateUIMessages } from "ai";

export async function POST(request: Request) {
  const { messages } = await request.json();
  const validatedMessages = await validateUIMessages({ messages: messages });

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(validatedMessages),
  });

  return result.toUIMessageStreamResponse();
}
