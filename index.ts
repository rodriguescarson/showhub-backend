import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import cors from "cors";
const app: Express = express();
app.use(bodyParser.json());
app.use(cors());
interface UserCredentials {
  email: string;
  password: string;
}

const staticCredentials: UserCredentials[] = [
  { email: 'user1@example.com', password: 'pass12345' },
  { email: 'user2@example.com', password: 'pass45645' },
  { email: 'user3@example.com', password: 'pass78945' }
];
const secretKey: string = 'your-secret-key';
app.get('/', (req: Request, res: Response) => {
  res.send('Test');
});
app.post('/api/login', (req: Request, res: Response) => {
  const { email, password } = req.body as UserCredentials;

  const user = staticCredentials.find(cred => cred.email === email && cred.password === password);

  if (user) {
    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
});

app.get('/api/search', async (req: Request, res: Response) => {
  const query = req.query.query as string;
  const token = req.headers.authorization?.replace('Bearer ', '');
  console.log(token)
  if (!token) {
    res.status(401).json({ message: 'Authorization token missing' });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, secretKey) as { email: string };
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
