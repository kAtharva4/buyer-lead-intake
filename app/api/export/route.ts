import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

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
  if (city) where.city = { equals: city as any };

  const propertyType = searchParams.get('propertyType');
  if (propertyType) where.propertyType = { equals: propertyType as any };

  const status = searchParams.get('status');
  if (status) where.status = { equals: status as any };

  const timeline = searchParams.get('timeline');
  if (timeline) where.timeline = { equals: timeline as any };

  try {
    const buyers = await prisma.buyer.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      select: {
        fullName: true,
        email: true,
        phone: true,
        city: true,
        propertyType: true,
        bhk: true,
        purpose: true,
        budgetMin: true,
        budgetMax: true,
        timeline: true,
        source: true,
        notes: true,
        tags: true,
        status: true,
        updatedAt: true,
      }
    });

    const csvRows = [
      "fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status",
      ...buyers.map(b => 
        `${b.fullName || ""},${b.email || ""},${b.phone || ""},${b.city || ""},${b.propertyType || ""},${b.bhk || ""},${b.purpose || ""},${b.budgetMin || ""},${b.budgetMax || ""},${b.timeline || ""},${b.source || ""},"${b.notes?.replace(/"/g, '""') || ""}",${b.tags.join(';') || ""},${b.status || ""}`
      )
    ];

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="buyers_export.csv"`,
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to export CSV." }, { status: 500 });
  }
}