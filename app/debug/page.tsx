export const dynamic = 'force-dynamic';

export default async function DebugPage() {
  let output = {
    envVars: {} as any,
    dbTest: '',
    runtimeInfo: {} as any,
    error: null as any
  };

  try {
    output.envVars = {
      DATABASE_URL: process.env.DATABASE_URL ? '✅ Set (length: ' + process.env.DATABASE_URL.length + ')' : '❌ Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || '❌ Not set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
      AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST || '❌ Not set',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL || 'Not on Vercel',
      VERCEL_URL: process.env.VERCEL_URL || 'N/A',
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing',
      REDIS_URL: process.env.UPSTASH_REDIS_REST_URL ? '✅ Set' : '❌ Missing',
      ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ? '✅ Set' : '❌ Missing',
    };

    output.runtimeInfo = {
      platform: process.platform,
      nodeVersion: process.version,
      timestamp: new Date().toISOString(),
    };

    // Test database
    try {
      const { prisma } = await import('@/lib/prisma');
      await prisma.$connect();
      const userCount = await prisma.user.count();
      await prisma.$disconnect();
      output.dbTest = `✅ Database OK - Found ${userCount} users`;
    } catch (error: any) {
      output.dbTest = `❌ Database error: ${error.message}`;
      output.error = error.stack;
    }
  } catch (error: any) {
    output.error = `Fatal error: ${error.message}\n${error.stack}`;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#000', color: '#0f0', minHeight: '100vh', fontSize: '14px' }}>
      <h1>🔍 Deployment Debug Info</h1>
      <hr />
      
      <h2>Environment Variables:</h2>
      <pre>{JSON.stringify(output.envVars, null, 2)}</pre>
      
      <h2>Database Connection:</h2>
      <pre>{output.dbTest}</pre>
      
      <h2>Runtime Info:</h2>
      <pre>{JSON.stringify(output.runtimeInfo, null, 2)}</pre>
      
      {output.error && (
        <>
          <h2 style={{ color: 'red' }}>Error Details:</h2>
          <pre style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{output.error}</pre>
        </>
      )}
    </div>
  );
}
