import { getSupabase } from '../utils/supabase.js';
import { registroSchema } from '../utils/validations.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const signup = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { email, password, nombre, apellido, dni } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nombre, apellido, dni } },
  });

  if (error) throw error;
  res.status(201).json({ message: 'User created successfully', user: data.user });
});

export const login = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  res.json({ message: 'Login successful', user: data.user, session: data.session });
});

export const logout = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  res.json({ message: 'Logged out successfully' });
});

export const signupPublic = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const data = registroSchema.parse(req.body);

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { nombre: data.nombre, apellido: data.apellido, dni: data.dni },
    },
  });
  if (authError) throw authError;

  const { data: socio, error: socioError } = await supabase
    .from('Socio')
    .insert({
      dni: data.dni,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      telefono: data.telefono || null,
      supabaseUserId: authData.user.id,
    })
    .select('*')
    .single();

  if (socioError) throw socioError;

  res.status(201).json({ socio, session: authData.session });
});
