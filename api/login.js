import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Csak POST engedélyezett' });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email és jelszó kötelező' });
  }

  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`SELECT id, email, password_hash, role FROM users WHERE email = ${email}`;
  const user = rows[0];

  // Ugyanaz a hibaüzenet, akár az email, akár a jelszó rossz
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Hibás email vagy jelszó' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.status(200).json({ token, user: { email: user.email, role: user.role } });
}