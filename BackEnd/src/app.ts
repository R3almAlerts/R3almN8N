import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import type { Router } from 'express'; // Type-only for routes
import workflowRoutes from './routes/workflows.js';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/workflows', workflowRoutes);

export default app;