import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const transactionSchema = z.object({
    product_id: z.number().int().positive(),
    quantity: z.number().int().positive(),
    transaction_date: z.string().datetime(),
});

router.post('/', async (req, res) => {
    try {
        const validatedData = transactionSchema.parse(req.body);
        const transaction = await prisma.transaction.create({ data: validatedData });
        res.json(transaction);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.get('/', async (req, res) => {
    try {
        const {
            sort,
            filter_start,
            filter_end,
            quantity_min,
            quantity_max,
        } = req.query;

        const where = {
            transaction_date: filter_start && filter_end
                ? {
                      gte: new Date(String(filter_start)),
                      lte: new Date(String(filter_end)),
                  }
                : undefined,
            quantity: quantity_min && quantity_max
                ? {
                      gte: Number(quantity_min),
                      lte: Number(quantity_max),
                  }
                : undefined,
        };

        const orderBy =
            sort === 'asc' || sort === 'desc'
                ? [{ transaction_date: sort as 'asc' | 'desc' }, { quantity: sort as 'asc' | 'desc' }]
                : undefined;

        const transactions = await prisma.transaction.findMany({
            where,
            orderBy,
        });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const validatedData = transactionSchema.partial().parse(req.body);
        const updatedTransaction = await prisma.transaction.update({ where: { id }, data: validatedData });
        res.json(updatedTransaction);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma.transaction.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export const transactionRoutes = router;