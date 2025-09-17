import { parse } from 'csv-parse';
import { z } from 'zod';

export async function parseCSV<T>(csvString: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    parse(
      csvString,
      {
        columns: true,
        skip_empty_lines: true,
      },
      (err, records: T[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      }
    );
  });
}

export function validateRows<T extends z.ZodRawShape>(
  rows: any[],
  schema: z.ZodObject<T>
) {
  const validRows = [];
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    const transformedRow = {
      ...row,
      tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
    };
    
    const validation = schema.safeParse(transformedRow);
    
    if (validation.success) {
      validRows.push(validation.data);
    } else {
      errors.push({
        row: i + 1,
        message: validation.error.flatten().fieldErrors,
      });
    }
  }

  return { validRows, errors };
}