"use server";

import OpenAI from "openai";
import { HabitWithEntries } from "@/types/habit";

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

function calculateHabitStats(habit: HabitWithEntries) {
  const today = new Date().toISOString().split("T")[0];
  const sortedEntries = [...habit.entries]
    .filter((entry) => entry.completed)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Calculate streak
  let streak = 0;
  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].date);
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);

    const entryDateStr = entryDate.toISOString().split("T")[0];
    const expectedDateStr = expectedDate.toISOString().split("T")[0];

    if (entryDateStr === expectedDateStr) {
      streak++;
    } else {
      break;
    }
  }

  // Calculate completion rate (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentEntries = habit.entries.filter(
    (entry) => entry.date >= thirtyDaysAgo.toISOString().split("T")[0]
  );
  const completedRecent = recentEntries.filter((entry) => entry.completed).length;
  const completionRate = recentEntries.length > 0 
    ? Math.round((completedRecent / recentEntries.length) * 100) 
    : 0;

  // Total completions
  const totalCompletions = habit.entries.filter((entry) => entry.completed).length;

  // Days since creation
  const createdAt = new Date(habit.createdAt);
  const daysSinceCreation = Math.floor(
    (new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Check if completed today
  const isCompletedToday = habit.entries.some(
    (entry) => entry.date === today && entry.completed
  );

  // Find longest streak
  let longestStreak = 0;
  let currentStreak = 0;
  const allEntries = [...habit.entries]
    .filter((entry) => entry.completed)
    .sort((a, b) => a.date.localeCompare(b.date));

  for (let i = 0; i < allEntries.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const prevDate = new Date(allEntries[i - 1].date);
      const currDate = new Date(allEntries[i].date);
      const daysDiff = Math.floor(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    streak,
    longestStreak,
    totalCompletions,
    completionRate,
    daysSinceCreation,
    isCompletedToday,
    totalDays: recentEntries.length || 30,
  };
}

export async function getHabitInsights(
  habit: HabitWithEntries
): Promise<{
  success: boolean;
  insights?: string;
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

    const stats = calculateHabitStats(habit);

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `Analyze the performance of this habit and provide personalized insights and recommendations.

Habit: "${habit.name}"
Current Streak: ${stats.streak} days
Longest Streak: ${stats.longestStreak} days
Total Completions: ${stats.totalCompletions}
Completion Rate (last ${stats.totalDays} days): ${stats.completionRate}%
Days Since Creation: ${stats.daysSinceCreation} days
Completed Today: ${stats.isCompletedToday ? "Yes" : "No"}

Provide:
1. A brief analysis of their performance
2. Specific strengths to celebrate
3. Actionable recommendations to improve consistency
4. Motivation tailored to their current progress

Keep it concise (2-3 paragraphs), encouraging, and practical. Write in a friendly, supportive tone.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const insights = completion.choices[0]?.message?.content?.trim();

    if (!insights) {
      return {
        success: false,
        error: "No response from AI. Please try again.",
      };
    }

    return {
      success: true,
      insights,
    };
  } catch (error) {
    console.error("Error getting habit insights:", error);
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to get habit insights. Please try again.",
    };
  }
}

