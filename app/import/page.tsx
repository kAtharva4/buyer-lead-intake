'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ImportPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to import.');
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Failed to import CSV.');
        setIsError(true);
      } else {
        setMessage(`Successfully imported ${data.inserted} buyers!`);
        setIsError(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Import error:', error);
      setMessage('An unexpected error occurred during import.');
      setIsError(true);
    }
  };

  return (
    <div className="container full-width-container">
      <div className="card">
        <h1 className="title">Import CSV</h1>
        <p className="page-header-subtitle">Upload a CSV file to import new buyer leads.</p>
        <form onSubmit={handleImport} className="lead-form-grid" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="csv-file">Choose a CSV file</label>
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Import
          </button>
        </form>
        {message && (
          <div className={isError ? 'alert alert-danger' : 'alert alert-success'} style={{ marginTop: '1rem' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportPage;