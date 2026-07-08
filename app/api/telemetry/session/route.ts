import { NextResponse } from 'next/server';
import { createServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { analyticsSessionSchema } from '@/lib/validation/schemas';

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ sessionId: null, skipped: true });
    }

    const body = await request.json();
    const parsed = analyticsSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase!
      .from('analytics_sessions')
      .insert(parsed.data)
      .select('id')
      .single();

    if (error) {
      console.error('[telemetry/session] Insert failed:', error.message);
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    return NextResponse.json({ sessionId: data.id });
  } catch (error) {
    console.error('[telemetry/session] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ total: 0, configured: false });
    }

    const supabase = createServerSupabaseClient();
    const { count, error } = await supabase!
      .from('analytics_sessions')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch count' }, { status: 500 });
    }

    return NextResponse.json({ total: count ?? 0, configured: true });
  } catch {
    return NextResponse.json({ total: 0, configured: false });
  }
}
