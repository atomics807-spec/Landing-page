import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfcutidoviilwhgijkje.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmY3V0aWRvdmlpbHdoZ2lqa2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMjk1MjQsImV4cCI6MjA5OTYwNTUyNH0.Xa8bHSg5YrD0cYx1Kq1buyLzONOFWiU4nRZ3-GzDMy0';

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignUp() {
  const testEmail = `test-${Date.now()}@test.com`;
  const testPassword = 'TestPassword123!';
  
  console.log('\nAttempting sign up with:', testEmail);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    console.log('\n=== Response ===');
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('Error:', JSON.stringify(error, null, 2));
    
    if (error) {
      console.log('\n❌ Sign up failed with error:', error.message);
      console.log('Error type:', typeof error);
      console.log('Error keys:', Object.keys(error));
    } else {
      console.log('\n✅ Sign up succeeded!');
    }
  } catch (err) {
    console.error('\n❌ Exception during sign up:', err);
    console.error('Error type:', typeof err);
    console.error('Error:', err);
  }
}

testSignUp();
