import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://framebase.qubickle.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3ODU3NTc5MzYsImV4cCI6MjEwMTExNzkzNn0.CqryCbpMhHLVdpU1faxT_5oGe8AfE6H3-_wVLC9iH3Q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: merchants, error: me } = await supabase.from('merchants').select('id, store_name, slug');
  console.log('Merchants:', merchants, me);
  
  const { data: members, error: meme } = await supabase.from('merchant_members').select('*');
  console.log('Merchant Members:', members, meme);
  
  const { data: users, error: ue } = await supabase.auth.admin.listUsers();
  console.log('Auth Users:', users.users.map(u => ({ email: u.email, id: u.id, metadata: u.user_metadata })));
}
check();
