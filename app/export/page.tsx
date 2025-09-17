'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MouseEvent } from 'react';
import Link from 'next/link';

const ExportPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleExport = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    // This triggers the download by navigating to the API route with current filters
    router.push(`/api/export?${params.toString()}`);
  };

  return (
    <div className="container full-width-container">
      <div className="card">
        <h1 className="title">Export CSV</h1>
        <p className="page-header-subtitle">Download a CSV file of the current filtered list.</p>
        <button onClick={handleExport} className="btn btn-primary">
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default ExportPage;