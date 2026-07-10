import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://zufdacijsfhavwqygdat.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZmRhY2lqc2ZoYXZ3cXlnZGF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc4NTI5MywiZXhwIjoyMDk0MzYxMjkzfQ._SaOgVzWBhgGmEqnUFKSk2I_qeXXXbbywO0IC7vhlGI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const email = 'admin@gesclub.com'
const password = 'Admin1234'

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: {
    nombre: 'Admin',
    apellido: 'GesClub',
    role: 'admin',
  },
})

if (error) {
  console.error('Error creating admin user:', error.message)
  process.exit(1)
}

console.log('Admin user created successfully!')
console.log('Email:', email)
console.log('Password:', password)
console.log('User ID:', data.user.id)
