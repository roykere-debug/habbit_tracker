import { NextRequest, NextResponse } from "next/server";
import { toggleHabitEntry, getHabitEntries } from "@/app/actions/entries";
import { toggleEntrySchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get("habitId");
    
    if (!habitId) {
      return NextResponse.json(
        { error: "Habit ID is required" },
        { status: 400 }
      );
    }

    const result = await getHabitEntries(habitId);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error in GET /api/entries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = toggleEntrySchema.parse(body);
    const result = await toggleHabitEntry(validated);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error in POST /api/entries:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

