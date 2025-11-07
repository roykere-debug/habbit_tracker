"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toggleEntrySchema } from "@/lib/validations";
import { checkSupabaseEnv } from "@/lib/supabase/check-env";
import { HabitEntry } from "@/types/habit";

export async function toggleHabitEntry(data: {
  habitId: string;
  date: string;
}): Promise<{ success: boolean; data?: HabitEntry; error?: string }> {
  try {
    // Check environment variables
    const envCheck = checkSupabaseEnv();
    if (!envCheck.valid) {
      return { success: false, error: envCheck.error };
    }

    // Validate input
    const validated = toggleEntrySchema.parse(data);

    const supabase = await createClient();

    // Check if entry exists
    const { data: existingEntry, error: fetchError } = await supabase
      .from("habit_entries")
      .select("*")
      .eq("habit_id", validated.habitId)
      .eq("date", validated.date)
      .single();

    let entry: HabitEntry;

    if (existingEntry) {
      // Toggle existing entry
      const { data: updatedEntry, error: updateError } = await supabase
        .from("habit_entries")
        .update({ completed: !existingEntry.completed })
        .eq("id", existingEntry.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating entry:", updateError);
        return { success: false, error: updateError.message };
      }

      entry = {
        id: updatedEntry.id,
        habitId: updatedEntry.habit_id,
        date: updatedEntry.date,
        completed: updatedEntry.completed,
      };
    } else {
      // Create new entry
      const { data: newEntry, error: insertError } = await supabase
        .from("habit_entries")
        .insert({
          habit_id: validated.habitId,
          date: validated.date,
          completed: true,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating entry:", insertError);
        return { success: false, error: insertError.message };
      }

      entry = {
        id: newEntry.id,
        habitId: newEntry.habit_id,
        date: newEntry.date,
        completed: newEntry.completed,
      };
    }

    revalidatePath("/");
    return { success: true, data: entry };
  } catch (error) {
    console.error("Error toggling entry:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to toggle entry" };
  }
}

export async function getHabitEntries(
  habitId: string
): Promise<{ success: boolean; data?: HabitEntry[]; error?: string }> {
  try {
    // Check environment variables
    const envCheck = checkSupabaseEnv();
    if (!envCheck.valid) {
      return { success: false, error: envCheck.error };
    }

    const supabase = await createClient();

    const { data: entries, error } = await supabase
      .from("habit_entries")
      .select("*")
      .eq("habit_id", habitId)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching entries:", error);
      return { success: false, error: error.message };
    }

    const habitEntries: HabitEntry[] = (entries || []).map((entry) => ({
      id: entry.id,
      habitId: entry.habit_id,
      date: entry.date,
      completed: entry.completed,
    }));

    return { success: true, data: habitEntries };
  } catch (error) {
    console.error("Error fetching entries:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to fetch entries" };
  }
}

