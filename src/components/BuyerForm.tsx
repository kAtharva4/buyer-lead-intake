'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { buyerCreateSchema } from '@/lib/validation';
import {
  CITY_VALUES,
  PROPERTY_TYPE_VALUES,
  BHK_VALUES,
  PURPOSE_VALUES,
  TIMELINE_VALUES,
  SOURCE_VALUES,
} from '@/lib/validation';

type FormInputs = z.infer<typeof buyerCreateSchema>;

interface BuyerFormProps {
  initialValues?: FormInputs;
  onSubmit: SubmitHandler<FormInputs>;
  submitting: boolean;
}

const BuyerForm: React.FC<BuyerFormProps> = ({ initialValues, onSubmit, submitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInputs>({
    resolver: zodResolver(buyerCreateSchema),
    defaultValues: initialValues,
  });

  const propertyType = watch('propertyType');
  const isBhkRequired = propertyType === 'Apartment' || propertyType === 'Villa';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="lead-form-grid">
      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          {...register('fullName')}
          className="form-control"
          required
        />
        {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          {...register('phone')}
          className="form-control"
          required
        />
        {errors.phone && <p className="form-error">{errors.phone.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          {...register('email')}
          className="form-control"
        />
        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="city">City</label>
        <select
          id="city"
          {...register('city')}
          className="form-control"
          required
        >
          <option value="">Select City</option>
          {CITY_VALUES.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        {errors.city && <p className="form-error">{errors.city.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="propertyType">Property Type</label>
        <select
          id="propertyType"
          {...register('propertyType')}
          className="form-control"
          required
        >
          <option value="">Select Property Type</option>
          {PROPERTY_TYPE_VALUES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.propertyType && <p className="form-error">{errors.propertyType.message}</p>}
      </div>

      {isBhkRequired && (
        <div className="form-group">
          <label htmlFor="bhk">BHK</label>
          <select
            id="bhk"
            {...register('bhk')}
            className="form-control"
            required
          >
            <option value="">Select BHK</option>
            {BHK_VALUES.map((bhk) => (
              <option key={bhk} value={bhk}>{bhk.replace('_', ' ')}</option>
            ))}
          </select>
          {errors.bhk && <p className="form-error">{errors.bhk.message}</p>}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="purpose">Purpose</label>
        <select
          id="purpose"
          {...register('purpose')}
          className="form-control"
          required
        >
          <option value="">Select Purpose</option>
          {PURPOSE_VALUES.map((purpose) => (
            <option key={purpose} value={purpose}>{purpose}</option>
          ))}
        </select>
        {errors.purpose && <p className="form-error">{errors.purpose.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="budgetMin">Min Budget</label>
        <input
          id="budgetMin"
          type="number"
          {...register('budgetMin')}
          className="form-control"
        />
        {errors.budgetMin && <p className="form-error">{errors.budgetMin.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="budgetMax">Max Budget</label>
        <input
          id="budgetMax"
          type="number"
          {...register('budgetMax')}
          className="form-control"
        />
        {errors.budgetMax && <p className="form-error">{errors.budgetMax.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="timeline">Timeline</label>
        <select
          id="timeline"
          {...register('timeline')}
          className="form-control"
          required
        >
          <option value="">Select Timeline</option>
          {TIMELINE_VALUES.map((timeline) => (
            <option key={timeline} value={timeline}>{timeline}</option>
          ))}
        </select>
        {errors.timeline && <p className="form-error">{errors.timeline.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="source">Source</label>
        <select
          id="source"
          {...register('source')}
          className="form-control"
          required
        >
          <option value="">Select Source</option>
          {SOURCE_VALUES.map((source) => (
            <option key={source} value={source}>{source.replace('_', ' ')}</option>
          ))}
        </select>
        {errors.source && <p className="form-error">{errors.source.message}</p>}
      </div>

      <div className="form-group" style={{ gridColumn: 'span 2' }}>
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          {...register('notes')}
          className="form-control"
          rows={4}
        />
        {errors.notes && <p className="form-error">{errors.notes.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default BuyerForm;