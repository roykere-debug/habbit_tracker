"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createHabitSchema, updateHabitSchema } from "@/lib/validations";
import { checkSupabaseEnv } from "@/lib/supabase/check-env";
import { Habit, HabitEntry, HabitWithEntries } from "@/types/habit";

export async function createHabit(data: {
  name: string;
  color: string;
  icon: string;
}): Promise<{ success: boolean; data?: Habit; error?: string }> {
  try {
    // Check environment variables
    const envCheck = checkSupabaseEnv();
    if (!envCheck.valid) {
      return { success: false, error: envCheck.error };
    }

    // Validate input
    const validated = createHabitSchema.parse(data);

    const supabase = await createClient();

    // Insert habit
    const { data: habit, error } = await supabase
      .from("habits")
      .insert({
        name: validated.name,
        color: validated.color,
        icon: validated.icon,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating habit:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    return {
      success: true,
      data: {
        id: habit.id,
        name: habit.name,
        color: habit.color,
        icon: habit.icon,
        createdAt: new Date(habit.created_at),
      },
    };
  } catch (error) {
    console.error("Error creating habit:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create habit" };
  }
}

export async function getHabits(): Promise<{
  success: boolean;
  data?: HabitWithEntries[];
  error?: string;
}> {
  try {
    // Check environment variables
    const envCheck = checkSupabaseEnv();
    if (!envCheck.valid) {
      return { success: false, error: envCheck.error };
    }

    const supabase = await createClient();

    // Get all habits
    const { data: habits, error: habitsError } = await supabase
      .from("habits")
      .select("*")
      .order("created_at", { ascending: false });

    if (habitsError) {
      console.error("Error fetching habits:", habitsError);
      return { success: false, error: habitsError.message };
    }

    // Get all entries for these habits
    const habitIds = habits.map((h) => h.id);
    const { data: entries, error: entriesError } = await supabase
      .from("habit_entries")
      .select("*")
      .in("habit_id", habitIds);

    if (entriesError) {
      console.error("Error fetching entries:", entriesError);
      return { success: false, error: entriesError.message };
    }

    // Combine habits with their entries
    const habitsWithEntries: HabitWithEntries[] = habits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      color: habit.color,
      icon: habit.icon,
      createdAt: new Date(habit.created_at),
      entries: (entries || [])
        .filter((entry) => entry.habit_id === habit.id)
        .map((entry): HabitEntry => ({
          id: entry.id,
          habitId: entry.habit_id,
          date: entry.date,
          completed: entry.completed,
        })),
    }));

    return { success: true, data: habitsWithEntries };
  } catch (error) {
    console.error("Error fetching habits:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to fetch habits" };
  }
}

export async function updateHabit(
  id: string,
  data: Partial<{ name: string; color: string; icon: string }>
): Promise<{ success: boolean; data?: Habit; error?: string }> {
  try {
    // Check environment variables
    const envCheck = checkSupabaseEnv();
    if (!envCheck.valid) {
      return { success: false, error: envCheck.error };
    }

    // Validate input
    const validated = updateHabitSchema.parse(data);

    const supabase = await createClient();

    // Update habit
    const { data: habit, error } = await supabase
      .from("habits")
      .update(validated)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating habit:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    return {
      success: true,
      data: {
        id: habit.id,
        name: habit.name,
        color: habit.color,
        icon: habit.icon,
        createdAt: new Date(habit.created_at),
      },
    };
  } catch (error) {
    console.error("Error updating habit:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update habit" };
  }
}

export async function deleteHabit(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check environment variables
    const envCheck = checkSupabaseEnv();
    if (!envCheck.valid) {
      return { success: false, error: envCheck.error };
    }

    const supabase = await createClient();

    // Delete habit (entries will be cascade deleted)
    const { error } = await supabase.from("habits").delete().eq("id", id);

    if (error) {
      console.error("Error deleting habit:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting habit:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete habit" };
  }
}

