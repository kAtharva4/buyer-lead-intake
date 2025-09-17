import { z } from 'zod';
import {
  buyerCreateSchema,
  buyerUpdateSchema,
  csvRowSchema,
} from '@/lib/validation';

export type BuyerCreateInput = z.infer<typeof buyerCreateSchema>;
export type BuyerUpdateInput = z.infer<typeof buyerUpdateSchema>;
export type CsvRow = z.infer<typeof csvRowSchema>;

export type BuyerFilterOptions = {
  q?: string;
  city?: string;
  propertyType?: string;
  status?: string;
  timeline?: string;
  page?: number;
};