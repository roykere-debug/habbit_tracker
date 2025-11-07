import { z } from "zod";

export const habitSchema = z.object({
  name: z.string().min(1, "Habit name is required").max(100, "Habit name is too long"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  icon: z.string().min(1, "Icon is required").max(10, "Icon is too long"),
});

export const habitEntrySchema = z.object({
  habitId: z.string().min(1, "Habit ID is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  completed: z.boolean(),
});

export const createHabitSchema = habitSchema;
export const updateHabitSchema = habitSchema.partial();
export const toggleEntrySchema = z.object({
  habitId: z.string().min(1, "Habit ID is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type ToggleEntryInput = z.infer<typeof toggleEntrySchema>;

