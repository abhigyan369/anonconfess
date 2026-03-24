import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';
import { initSocket } from './config/socket';

const PORT = parseInt(process.env.PORT || '5001', 10);

const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});

initSocket(server);
