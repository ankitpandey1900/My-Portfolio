import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { contactSchema } from '@/lib/validation/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, message } = parsed.data;

    if (isSupabaseConfigured()) {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase!.from('contacts').insert({ name, email, message });
      if (error) {
        console.error('[contact] Supabase insert failed:', error.message);
        return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
      }
    }

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
