'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BuyerForm from '@/components/BuyerForm';
import { z } from 'zod';
import { buyerCreateSchema } from '@/lib/validation';

type FormInputs = z.infer<typeof buyerCreateSchema>;

const NewBuyerPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: FormInputs) => {
    console.log("Form submission started with data:", data);
    setSubmitting(true);
    try {
      const response = await fetch('/api/buyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert(errorData.message || 'Failed to create buyer.');
        return;
      }

      const newBuyer = await response.json();
      console.log('Buyer created successfully:', newBuyer);
      router.push('/buyers');
    } catch (error) {
      console.error('Submission error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container full-width-container">
      <div className="card">
        <h1 className="title text-center">Create New Buyer Lead</h1>
        <BuyerForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
};

export default NewBuyerPage;