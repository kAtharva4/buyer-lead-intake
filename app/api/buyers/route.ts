import { NextResponse, type NextRequest } from 'next/server';
import { Prisma, BHK, City, PropertyType, Purpose, Timeline, Source, Status } from '@prisma/client';
import prisma from '@/lib/db';
import { buyerCreateSchema } from '@/lib/validation';
import { getSession } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';

const createLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const where: Prisma.BuyerWhereInput = {};
  const q = searchParams.get('q');
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ];
  }
  const city = searchParams.get('city');
  if (city) where.city = city as City;
  const propertyType = searchParams.get('propertyType');
  if (propertyType) where.propertyType = propertyType as PropertyType;
  const status = searchParams.get('status');
  if (status) where.status = status as Status;
  const timeline = searchParams.get('timeline');
  if (timeline) where.timeline = timeline as Timeline;

  try {
    const [items, total] = await prisma.$transaction([
      prisma.buyer.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        include: { owner: true }
      }),
      prisma.buyer.count({ where }),
    ]);

    return NextResponse.json({ items, total });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch buyers." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const { success } = await createLimiter(ip);
  if (!success) {
    return new NextResponse(null, { status: 429, statusText: "Too Many Requests" });
  }

  const body = await request.json();
  const validation = buyerCreateSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({
      message: "Validation failed.",
      errors: validation.error.flatten().fieldErrors,
    }, { status: 400 });
  }

  try {
    const session = getSession();
    if (!session || !session.id) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    const user = await prisma.user.upsert({
      where: { email: session.email },
      update: {},
      create: {
        id: session.id,
        email: session.email,
      },
    });

    const newBuyer = await prisma.buyer.create({
      data: {
        ...validation.data,
        bhk: (validation.data.bhk as BHK) || null,
        ownerId: user.id,
      },
    });

    await prisma.buyerHistory.create({
      data: {
        buyerId: newBuyer.id,
        changedByUserId: user.id,
        changedBy: user.email || "unknown",
        diff: {
          field: "all fields",
          oldValue: null,
          newValue: newBuyer,
        },
      },
    });

    return NextResponse.json(newBuyer, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ message: 'A record with this phone number already exists.' }, { status: 409 });
      }
    }
    return NextResponse.json({ message: "Failed to create buyer." }, { status: 500 });
  }
} 