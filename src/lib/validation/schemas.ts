import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(254),
  message: z.string().min(10).max(5000),
});

export const quoteSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(254),
  services: z.array(z.string()).min(1).max(10),
  notes: z.string().max(2000).optional(),
  priceEstimate: z.number().min(0).max(1_000_000).optional(),
});

export const analyticsSessionSchema = z.object({
  referrer: z.string().max(2048).optional(),
  country: z.string().max(3).optional(),
  device: z.string().max(64).optional(),
  browser: z.string().max(128).optional(),
});

export const analyticsEventSchema = z.object({
  sessionId: z.string().uuid(),
  eventType: z.string().min(1).max(64),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
