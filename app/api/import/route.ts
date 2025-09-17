import { NextResponse, type NextRequest } from 'next/server';
import { parseCSV, validateRows } from '@/lib/csv';
import { csvRowSchema, CsvRow } from '@/lib/validation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { BHK, City, PropertyType, Purpose, Timeline, Source, Status } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session || !session.id) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
  }

  if (file.size > 200 * 1024 * 1024) {
    return NextResponse.json({ message: 'CSV file has more than 200 rows.' }, { status: 400 });
  }

  try {
    const csvString = await file.text();
    const records = await parseCSV<any[]>(csvString);

    if (records.length > 200) {
      return NextResponse.json({ message: 'CSV file has more than 200 rows.' }, { status: 400 });
    }

    const { validRows, errors } = validateRows(records, csvRowSchema);

    if (errors.length > 0) {
      return NextResponse.json({ inserted: 0, errors }, { status: 400 });
    }

    const insertedCount = await prisma.$transaction(
      validRows.map((row: any) => {
        const data = {
          fullName: row.fullName,
          email: row.email || null,
          phone: row.phone,
          city: row.city as City,
          propertyType: row.propertyType as PropertyType,
          bhk: (row.bhk as BHK) || null,
          purpose: row.purpose as Purpose,
          budgetMin: row.budgetMin || null,
          budgetMax: row.budgetMax || null,
          timeline: row.timeline as Timeline,
          source: row.source as Source,
          status: (row.status as Status) || null,
          notes: row.notes || null,
          tags: row.tags || [],
          ownerId: session.id,
        };
        
        return prisma.buyer.create({ data });
      })
    );

    return NextResponse.json({ inserted: insertedCount.length, errors: [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to process CSV file.' }, { status: 500 });
  }
}