import { Suspense } from 'react';
import BuyerTable from '@/components/BuyerTable';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';
import { Prisma, City, PropertyType, Status, Timeline } from '@prisma/client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const BuyersPage = async ({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) => {
  const page = parseInt((searchParams?.page as string) || '1');
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const where: Prisma.BuyerWhereInput = {};

  if (searchParams?.q) {
    where.OR = [
      { fullName: { contains: searchParams.q as string, mode: 'insensitive' } },
      { phone: { contains: searchParams.q as string, mode: 'insensitive' } },
      { email: { contains: searchParams.q as string, mode: 'insensitive' } },
    ];
  }

  if (searchParams?.city) where.city = searchParams.city as City;
  if (searchParams?.propertyType) where.propertyType = searchParams.propertyType as PropertyType;
  if (searchParams?.status) where.status = searchParams.status as Status;
  if (searchParams?.timeline) where.timeline = searchParams.timeline as Timeline;

  try {
    const [items, total] = await prisma.$transaction([
      prisma.buyer.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        include: { owner: true },
      }),
      prisma.buyer.count({ where }),
    ]);

    const session = getSession();

    return (
      <div className="container full-width-container">
        <div className="card">
          <div className="page-header">
            <div>
              <h1 className="page-header-title">Buyer Leads Management</h1>
              <p className="page-header-subtitle">
                Manage your buyer leads and publishing status
              </p>
            </div>
            <div className="btn-group">
              <Link href="/" className="btn btn-success">
                View Live Site
              </Link>
              <Link href="/buyers/new" className="btn btn-primary">
                Add New Buyer
              </Link>
            </div>
          </div>

          <h2 className="page-header-subtitle" style={{ marginBottom: '1rem' }}>
            All Buyers
          </h2>

          <Suspense fallback={<div>Loading...</div>}>
            <BuyerTable
              buyers={items}
              total={total}
              currentPage={page}
              ownerId={session.id}
            />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch buyers:', error);
    return <div>Failed to load buyers.</div>;
  }
};

export default BuyersPage;
