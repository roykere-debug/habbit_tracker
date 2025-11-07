"use server";

import OpenAI from "openai";

export async function getAITip(): Promise<{
  success: boolean;
  tip?: string;
  error?: string;
}> {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: "OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env.local file.",
      };
    }

    // Initialize OpenAI client only if API key is available
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Give a short motivating tip to improve habit consistency.",
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const tip = completion.choices[0]?.message?.content?.trim();

    if (!tip) {
      return {
        success: false,
        error: "No response from AI. Please try again.",
      };
    }

    return {
      success: true,
      tip,
    };
  } catch (error) {
    console.error("Error getting AI tip:", error);
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to get AI tip. Please try again.",
    };
  }
}

