'use client';

import { Buyer, User } from '@prisma/client';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface BuyerTableProps {
  buyers: (Buyer & { owner: User })[];
  total: number;
  currentPage: number;
  ownerId: string;
}

const BuyerTable: React.FC<BuyerTableProps> = ({ buyers, total, currentPage, ownerId }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    if (event.target.value) {
      params.set('q', event.target.value);
    } else {
      params.delete('q');
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Published':
      case 'Converted':
        return 'status-badge published';
      case 'Draft':
      case 'New':
        return 'status-badge draft';
      default:
        return 'status-badge';
    }
  };

  return (
    <div>
      <input
        type="text"
        className="search-input"
        placeholder="Search buyers..."
        onChange={handleSearch}
        defaultValue={searchParams.get('q') || ''}
      />
      
      <div className="product-table-header">
        <div>FULLNAME</div>
        <div>PHONE</div>
        <div>EMAIL</div>
        <div>CITY</div>
        <div>STATUS</div>
        <div>ACTIONS</div>
      </div>
      {buyers.map((buyer) => (
        <div key={buyer.id} className="product-row">
          <div>
            <div className="product-title">{buyer.fullName}</div>
            <div className="product-description">{buyer.notes}</div>
          </div>
          <div>{buyer.phone}</div>
          <div>{buyer.email}</div>
          <div>{buyer.city}</div>
          <div>
            <span className={getStatusBadgeClass(buyer.status)}>{buyer.status}</span>
          </div>
          <div>
            <Link href={`/buyers/${buyer.id}`} className="link">Edit</Link>
            {buyer.ownerId === ownerId && (
              <a href="#" className="link" style={{ marginLeft: '1rem', color: 'var(--danger-color)' }}>Delete</a>
            )}
          </div>
        </div>
      ))}
      
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn-text"
        >
          « Previous
        </button>
        <span style={{ fontSize: '1rem', fontWeight: 600 }}>Page {currentPage} of {Math.ceil(total / 10)}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * 10 >= total}
          className="btn-text"
        >
          Next »
        </button>
      </div>
    </div>
  );
};

export default BuyerTable;