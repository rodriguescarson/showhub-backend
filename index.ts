const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios');

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

app.get('/api/search', async (req, res) => {
  const query = req.query.query as string;
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Authorization token missing' });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
    const shows = response.data;

    res.status(200).json(shows);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});