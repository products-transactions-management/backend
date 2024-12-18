// src/index.ts
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { productRoutes } from './routes/products';
import { transactionRoutes } from './routes/transactions';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
