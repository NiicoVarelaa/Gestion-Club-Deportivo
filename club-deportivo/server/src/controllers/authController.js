import { getSupabase } from '../utils/supabase.js';

export async function signup(req, res, next) {
  try {
    const supabase = getSupabase();
    const { email, password, nombre, apellido, dni } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre, apellido, dni } },
    });

    if (error) throw error;
    res.status(201).json({ message: 'User created successfully', user: data.user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const supabase = getSupabase();
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    res.json({ message: 'Login successful', user: data.user, session: data.session });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}
