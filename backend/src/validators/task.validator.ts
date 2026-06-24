import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  projectId: z.string().min(1, 'Project ID is required'),
  assignedToId: z.string().optional(),
  status: z
    .enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'], {
      errorMap: () => ({ message: 'Invalid status value' }),
    })
    .optional(),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'], {
      errorMap: () => ({ message: 'Invalid priority value' }),
    })
    .optional(),
  dueDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined))
    .refine(
      (val) => val === undefined || !isNaN(val.getTime()),
      { message: 'Invalid date format' }
    ),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  description: z.string().optional(),
  assignedToId: z.string().nullable().optional(),
  status: z
    .enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'], {
      errorMap: () => ({ message: 'Invalid status value' }),
    })
    .optional(),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'], {
      errorMap: () => ({ message: 'Invalid priority value' }),
    })
    .optional(),
  dueDate: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (val === null) return null;
      if (val === undefined) return undefined;
      return new Date(val);
    })
    .refine(
      (val) => val === undefined || val === null || !isNaN((val as Date).getTime()),
      { message: 'Invalid date format' }
    ),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
