import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

const app = express();
app.use(bodyParser.json());

const staticCredentials = [
  { email: 'user1@example.com', password: 'pass123' },
  { email: 'user2@example.com', password: 'pass456' },
  { email: 'user3@example.com', password: 'pass789' }
];
const secretKey = 'your-secret-key';

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = staticCredentials.find(cred => cred.email === email && cred.password === password);

  if (user) {
    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
});
