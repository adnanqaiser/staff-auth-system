import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/jwt';

const VALID_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'];

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('staff_session')?.value;
    const session = await verifySession(token);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in first.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 5));
    const search = (searchParams.get('search') || '').trim();
    const skip = (page - 1) * limit;

    const whereClause = {
      userId: session.userId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
              { company: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.lead.count({ where: whereClause }),
    ]);

    return NextResponse.json(
      {
        leads,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.max(1, Math.ceil(totalCount / limit)),
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error while fetching leads.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('staff_session')?.value;
    const session = await verifySession(token);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in first.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();
    const company = (body.company || '').trim();
    const status = (body.status || 'NEW').toUpperCase();
    const notes = (body.notes || '').trim();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Lead name and email are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        status,
        notes: notes || null,
        userId: session.userId,
      },
    });

    return NextResponse.json(
      { message: 'Lead created successfully.', lead },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error while creating lead.' },
      { status: 500 }
    );
  }
}
