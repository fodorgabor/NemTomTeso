import { checkAuth } from './_auth.js';

export default function handler(req, res) {
  const user = checkAuth(req);

  if (!user) {
    return res.status(401).json({ error: 'Nincs bejelentkezve' });
  }

  res.status(200).json({ user });
}