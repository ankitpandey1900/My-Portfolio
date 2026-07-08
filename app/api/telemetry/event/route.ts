import { NextResponse } from 'next/server';
import { createServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { analyticsEventSchema } from '@/lib/validation/schemas';

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const body = await request.json();
    const parsed = analyticsEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { sessionId, eventType, payload } = parsed.data;

    const supabase = createServerSupabaseClient();
    const { error } = await supabase!.from('analytics_events').insert({
      session_id: sessionId,
      event_type: eventType,
      payload: payload ?? {},
    });

    if (error) {
      console.error('[telemetry/event] Insert failed:', error.message);
      return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[telemetry/event] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
