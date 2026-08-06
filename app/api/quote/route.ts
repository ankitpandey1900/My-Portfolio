import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { quoteSchema } from '@/lib/validation/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = quoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, services, notes, priceEstimate } = parsed.data;

    const resendKey = process.env.RESEND_API_KEY;
    const recipient = process.env.NOTIFICATION_EMAIL_RECIPIENT;

    if (resendKey && recipient) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'Portfolio <onboarding@resend.dev>',
        to: recipient,
        replyTo: email,
        subject: `New Project Quote from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nServices Requested: ${services.join(', ')}\nEstimated Budget: $${priceEstimate}\n\nProject Notes:\n${notes ?? 'None provided'}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[quote] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
