import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/jwt";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("staff_session")?.value;
    const session = await verifySession(token);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;
    const reminderId = Number(id);
    if (isNaN(reminderId) || reminderId <= 0) {
      return NextResponse.json(
        { error: "Invalid reminder ID." },
        { status: 400 },
      );
    }

    const existing = await prisma.reminder.findUnique({
      where: { id: reminderId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Reminder not found." },
        { status: 404 },
      );
    }

    if (existing.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const body = await request.json();
    const updated = await prisma.reminder.update({
      where: { id: reminderId },
      data: { completed: Boolean(body.completed) },
    });

    return NextResponse.json({ reminder: updated }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("staff_session")?.value;
    const session = await verifySession(token);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;
    const reminderId = Number(id);
    if (isNaN(reminderId) || reminderId <= 0) {
      return NextResponse.json(
        { error: "Invalid reminder ID." },
        { status: 400 },
      );
    }

    const existing = await prisma.reminder.findUnique({
      where: { id: reminderId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Reminder not found." },
        { status: 404 },
      );
    }

    if (existing.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    await prisma.reminder.delete({ where: { id: reminderId } });
    return NextResponse.json({ message: "Reminder deleted." }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
