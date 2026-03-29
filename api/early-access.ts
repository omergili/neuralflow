import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email || !email.includes('@') || email.length < 5) {
    return res.status(400).json({ error: 'Bitte gib eine gueltige E-Mail-Adresse ein.' });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Server-Konfiguration unvollstaendig.' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase
      .from('early_access')
      .insert({ email: email.toLowerCase().trim() });

    if (error) {
      if (error.code === '23505') {
        return res.status(200).json({ success: true, message: 'Du bist bereits auf der Liste!' });
      }
      console.error('Signup error:', error);
      return res.status(500).json({ error: 'Fehler beim Speichern.' });
    }

    return res.status(200).json({ success: true, message: 'Danke! Du bekommst als Erster Zugang.' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Fehler beim Speichern.' });
  }
}
