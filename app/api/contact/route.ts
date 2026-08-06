import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema } from '@/lib/validation/schemas';

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 3;

export async function POST(request: Request) {
  try {
    // 1. Basic Rate Limiting by IP
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const userLimit = rateLimit.get(ip);

    if (userLimit) {
      if (now - userLimit.timestamp < RATE_LIMIT_WINDOW) {
        if (userLimit.count >= MAX_REQUESTS) {
          return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
          );
        }
        userLimit.count++;
      } else {
        rateLimit.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    // Periodically clean up the Map to prevent memory leaks (runs roughly every 100 requests)
    if (Math.random() < 0.01) {
      for (const [key, value] of rateLimit.entries()) {
        if (now - value.timestamp > RATE_LIMIT_WINDOW) {
          rateLimit.delete(key);
        }
      }
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, message } = parsed.data;

    const resendKey = process.env.RESEND_API_KEY;
    const recipient = process.env.NOTIFICATION_EMAIL_RECIPIENT;

    if (resendKey && recipient) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'Portfolio <onboarding@resend.dev>',
        to: recipient,
        replyTo: email,
        subject: `Portfolio contact from ${name}`,
        text: `${message}\n\n— ${name} (${email})`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[contact] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
