export const dynamic = 'force-dynamic';

export default async function DebugPage() {
  const envVars = {
    DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || '❌ Not set',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL || 'Not on Vercel',
    VERCEL_URL: process.env.VERCEL_URL || 'N/A',
  };

  let dbTest = '❌ Not tested';
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.$connect();
    await prisma.$disconnect();
    dbTest = '✅ Database connection successful';
  } catch (error: any) {
    dbTest = `❌ Database error: ${error.message}`;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#000', color: '#0f0', minHeight: '100vh' }}>
      <h1>🔍 Deployment Debug Info</h1>
      <hr />
      
      <h2>Environment Variables:</h2>
      <pre>{JSON.stringify(envVars, null, 2)}</pre>
      
      <h2>Database Connection:</h2>
      <pre>{dbTest}</pre>
      
      <h2>Runtime Info:</h2>
      <pre>{JSON.stringify({
        platform: process.platform,
        nodeVersion: process.version,
        timestamp: new Date().toISOString(),
      }, null, 2)}</pre>
    </div>
  );
}
