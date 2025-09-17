'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

const FilterBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.push(`/buyers?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search by name, phone, or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default FilterBar;