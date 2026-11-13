import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/jwt';

const VALID_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'];

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const leadId = Number(id);
    if (isNaN(leadId) || leadId <= 0) {
      return NextResponse.json(
        { error: 'Invalid lead ID provided.' },
        { status: 400 }
      );
    }

    const existingLead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found.' },
        { status: 404 }
      );
    }

    if (existingLead.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to edit this lead.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();
    const company = (body.company || '').trim();
    const status = (body.status || existingLead.status).toUpperCase();
    const notes = (body.notes || '').trim();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Lead name and email are required.' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        status,
        notes: notes || null,
      },
    });

    return NextResponse.json(
      { message: 'Lead updated successfully.', lead: updatedLead },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error while updating lead.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const leadId = Number(id);
    if (isNaN(leadId) || leadId <= 0) {
      return NextResponse.json(
        { error: 'Invalid lead ID provided.' },
        { status: 400 }
      );
    }

    const existingLead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found.' },
        { status: 404 }
      );
    }

    if (existingLead.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to delete this lead.' },
        { status: 403 }
      );
    }

    await prisma.lead.delete({ where: { id: leadId } });

    return NextResponse.json(
      { message: 'Lead deleted successfully.' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error while deleting lead.' },
      { status: 500 }
    );
  }
}
