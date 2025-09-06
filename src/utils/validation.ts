import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.date({
    message: 'Date of birth is required',
  }),
  avatar: z.string().url('Invalid URL').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  dateOfBirth: z.date({
    message: 'Date of birth is required',
  }),
  avatar: z.string().url('Invalid URL').optional(),
});

export const groupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100, 'Group name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less'),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().max(1000, 'Description must be 1000 characters or less'),
  points: z.number().min(1, 'Points must be at least 1').max(1000, 'Points cannot exceed 1000'),
  deadline: z.date({
    message: 'Deadline is required',
  }),
  assignedTo: z.string().optional(),
});

export const wishlistItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().max(1000, 'Description must be 1000 characters or less'),
  estimatedPrice: z.number().min(0, 'Price cannot be negative').max(999999, 'Price is too high'),
  link: z.string().url('Invalid URL').optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    message: 'Priority is required',
  }),
});

export const inviteCodeSchema = z.object({
  inviteCode: z.string().min(1, 'Invite code is required').max(20, 'Invalid invite code format'),
});

export type UserInput = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type GroupInput = z.infer<typeof groupSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type WishlistItemInput = z.infer<typeof wishlistItemSchema>;
export type InviteCodeInput = z.infer<typeof inviteCodeSchema>;