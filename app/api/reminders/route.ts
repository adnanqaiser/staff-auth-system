import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/jwt';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('staff_session')?.value;
    const session = await verifySession(token);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }

    const reminders = await prisma.reminder.findMany({
      where: { userId: session.userId },
      orderBy: { remindAt: 'asc' },
    });

    return NextResponse.json({ reminders }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal server error while fetching reminders.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('staff_session')?.value;
    const session = await verifySession(token);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }

    const body = await request.json();
    const title = (body.title || '').trim();
    const leadName = (body.leadName || '').trim();
    const remindAtRaw = body.remindAt;

    if (!title || !remindAtRaw) {
      return NextResponse.json(
        { error: 'Reminder title and future date/time are required.' },
        { status: 400 }
      );
    }

    const remindAt = new Date(remindAtRaw);
    if (isNaN(remindAt.getTime())) {
      return NextResponse.json({ error: 'Invalid date/time format.' }, { status: 400 });
    }

    if (remindAt.getTime() <= Date.now()) {
      return NextResponse.json(
        { error: 'Reminder date and time must be in the future.' },
        { status: 400 }
      );
    }

    const reminder = await prisma.reminder.create({
      data: {
        title,
        leadName: leadName || null,
        remindAt,
        userId: session.userId,
      },
    });

    return NextResponse.json({ message: 'Reminder scheduled successfully.', reminder }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error while creating reminder.' }, { status: 500 });
  }
}
