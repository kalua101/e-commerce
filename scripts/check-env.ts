// Script to verify all required environment variables are set
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'REDIS_URL',
  'ALGOLIA_APP_ID',
  'ALGOLIA_ADMIN_API_KEY',
  'ALGOLIA_SEARCH_API_KEY',
  'RESEND_API_KEY',
  'HUGGINGFACE_API_KEY',
];

const optionalEnvVars = [
  'STRIPE_WEBHOOK_SECRET',
  'AUTH_TRUST_HOST',
];

console.log('🔍 Checking Environment Variables...\n');

let missingRequired = [];
let missingOptional = [];

// Check required variables
for (const envVar of requiredEnvVars) {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}`);
  } else {
    console.log(`❌ ${envVar} - MISSING!`);
    missingRequired.push(envVar);
  }
}

console.log('\n📋 Optional Variables:');
for (const envVar of optionalEnvVars) {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}`);
  } else {
    console.log(`⚠️  ${envVar} - Not set`);
    missingOptional.push(envVar);
  }
}

console.log('\n' + '='.repeat(50));

if (missingRequired.length > 0) {
  console.log('\n❌ MISSING REQUIRED VARIABLES:');
  missingRequired.forEach(v => console.log(`   - ${v}`));
  console.log('\n⚠️  Your application may not work correctly!');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set!');
  
  if (missingOptional.length > 0) {
    console.log('\n⚠️  Optional variables not set:');
    missingOptional.forEach(v => console.log(`   - ${v}`));
  }
  
  console.log('\n🎉 Environment check passed!');
}
