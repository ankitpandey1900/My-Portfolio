/**
 * Runtime Environment Variable Validation
 * Enforces strict presence of critical API variables to prevent runtime database or mail crash.
 */

const requiredServerEnv = {
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  NOTIFICATION_EMAIL_RECIPIENT: process.env.NOTIFICATION_EMAIL_RECIPIENT,
  GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
};

const requiredPublicEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export function validateEnv() {
  const missingServer = Object.entries(requiredServerEnv)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  const missingPublic = Object.entries(requiredPublicEnv)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingServer.length > 0 || missingPublic.length > 0) {
    const errorMessage = [
      'CRITICAL: Missing environment variables configuration:',
      missingPublic.length > 0 ? `  Public (Client): ${missingPublic.join(', ')}` : '',
      missingServer.length > 0 ? `  Server (Secrets): ${missingServer.join(', ')}` : '',
      'Refer to .env.example for setups. Verify your local .env.local file.',
    ]
      .filter(Boolean)
      .join('\n');

    throw new Error(errorMessage);
  }
}

// Automatically validate when imported in server executions (non-browser target)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
  validateEnv();
}

export const env = {
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  resendApiKey: process.env.RESEND_API_KEY ?? '',
  notificationRecipient: process.env.NOTIFICATION_EMAIL_RECIPIENT ?? '',
  githubToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN ?? '',
} as const;
