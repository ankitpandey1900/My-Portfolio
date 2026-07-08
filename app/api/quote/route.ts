import { NextResponse } from 'next/server';
import { createServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { quoteSchema } from '@/lib/validation/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = quoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, services, notes, priceEstimate } = parsed.data;

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Backend not configured' }, { status: 503 });
    }

    const supabase = createServerSupabaseClient();
    const { error } = await supabase!.from('quotes').insert({
      name,
      email,
      services_selected: services,
      price_estimate: priceEstimate ?? 0,
      notes: notes ?? null,
    });

    if (error) {
      console.error('[quote] Supabase insert failed:', error.message);
      return NextResponse.json({ error: 'Failed to save quote request' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[quote] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
