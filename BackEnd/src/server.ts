import app from './app';
import { createServer } from 'http';

const PORT = process.env.PORT || 3001;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});