'use client';

import { useState } from 'react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImportSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
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
        onImportSuccess(); // Call the parent function to refresh the table
        setTimeout(() => onClose(), 2000); // Close the modal after a delay
      }
    } catch (error) {
      console.error('Import error:', error);
      setMessage('An unexpected error occurred during import.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Import CSV</h2>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>
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
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Importing...' : 'Import'}
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

export default ImportModal;