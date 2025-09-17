import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/db';
import { buyerUpdateSchema } from '@/lib/validation';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const buyer = await prisma.buyer.findUnique({
      where: { id: params.id },
      include: { histories: { take: 5, orderBy: { changedAt: 'desc' } } },
    });

    if (!buyer) {
      return NextResponse.json({ message: "Buyer not found." }, { status: 404 });
    }

    return NextResponse.json(buyer);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch buyer." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { updatedAt, ...data } = body;
  const validation = buyerUpdateSchema.safeParse(data);

  if (!validation.success) {
    return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const session = getSession();
  if (!session || !session.id) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  try {
    const originalBuyer = await prisma.buyer.findUnique({
      where: { id: params.id },
      select: { ownerId: true, updatedAt: true },
    });

    if (!originalBuyer) {
      return NextResponse.json({ message: "Buyer not found." }, { status: 404 });
    }

    if (originalBuyer.ownerId !== session.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 403 });
    }

    if (originalBuyer.updatedAt.getTime() !== new Date(updatedAt).getTime()) {
      return NextResponse.json({ message: "Record changed, please refresh." }, { status: 409 });
    }

    const updatedBuyer = await prisma.buyer.update({
      where: { id: params.id },
      data: validation.data,
    });

    return NextResponse.json(updatedBuyer);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update buyer." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || !session.id) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  try {
    const buyer = await prisma.buyer.findUnique({ where: { id: params.id } });
    if (!buyer) {
      return NextResponse.json({ message: "Buyer not found." }, { status: 404 });
    }

    if (buyer.ownerId !== session.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 403 });
    }

    await prisma.buyer.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Buyer deleted successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to delete buyer." }, { status: 500 });
  }
}