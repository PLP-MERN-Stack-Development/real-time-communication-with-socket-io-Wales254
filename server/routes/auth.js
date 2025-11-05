// routes/auth.js
import express from 'express';
const router = express.Router();

router.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username || username.trim() === '') {
    return res.status(400).json({ error: 'Username required' });
  }

  // Create a dummy token for now
  const token = Buffer.from(username).toString('base64'); 
  res.json({ username, token, id: username });
});

export default router;
