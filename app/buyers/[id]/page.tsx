'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Buyer, BuyerHistory } from '@prisma/client';
import BuyerForm from '@/components/BuyerForm';
import { z } from 'zod';
import { buyerUpdateSchema } from '@/lib/validation';

type FormInputs = z.infer<typeof buyerUpdateSchema>;

const ViewEditBuyerPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [buyer, setBuyer] = useState<
    (Buyer & { histories: BuyerHistory[] }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBuyer = async () => {
      try {
        const response = await fetch(`/api/buyers/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch buyer');
        }
        const data = await response.json();
        setBuyer(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyer();
  }, [id]);

  const handleSubmit = async (data: FormInputs) => {
    setSubmitting(true);
    try {
      if (!buyer) return;

      const response = await fetch(`/api/buyers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, updatedAt: buyer.updatedAt }),
      });

      if (response.status === 409) {
        alert('Record changed by another user. Please refresh.');
        router.refresh();
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to update buyer');
      }

      const updatedBuyer = await response.json();
      console.log('Buyer updated successfully:', updatedBuyer);
      router.push('/buyers');
    } catch (error) {
      console.error('Update error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading buyer details...</div>;
  }

  if (!buyer) {
    return <div>Buyer not found.</div>;
  }

  const initialFormValues = {
    ...buyer,
    email: buyer.email ?? undefined,
    bhk: buyer.bhk ?? undefined,
    budgetMin: buyer.budgetMin ?? undefined,
    budgetMax: buyer.budgetMax ?? undefined,
    notes: buyer.notes ?? undefined,
  };

  return (
    <div>
      <h1>View/Edit Buyer Lead</h1>
      <BuyerForm initialValues={initialFormValues} onSubmit={handleSubmit} submitting={submitting} />
      <h2>Last 5 Changes</h2>
      <ul>
        {buyer.histories.map((history) => (
          <li key={history.id}>
            {/* You'll need to parse the JSON `diff` and format this */}
            Change at {new Date(history.changedAt).toLocaleString()} by {history.changedBy}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewEditBuyerPage;