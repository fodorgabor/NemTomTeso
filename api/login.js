import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Csak POST engedélyezett' });
  }

  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Felhasználónév és jelszó kötelező' });
  }

  const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL);
  const rows = await sql`
    SELECT id, username, password_hash, role
    FROM users
    WHERE username = ${username}
  `;
  const user = rows[0];

  // Ugyanaz a hibaüzenet, akár a felhasználónév, akár a jelszó rossz
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Hibás felhasználónév vagy jelszó' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.status(200).json({
    token,
    user: { username: user.username, role: user.role }
  });
}