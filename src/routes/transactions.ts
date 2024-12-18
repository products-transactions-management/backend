import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const transactionSchema = z.object({
    product_id: z.number().int().positive(),
    quantity: z.number().int().positive(),
    transaction_date: z.string().datetime(),
});

router.post('/', async (req: Request, res: Response) => {
    try {        
        const validatedData = transactionSchema.parse(req.body);

        // Check if stock 0
        const product = await prisma.product.findUnique({ where: { id: validatedData.product_id } });
        if (product?.stock === 0) {
            res.status(400).json({ 
                error: 'Product out of stock',
                stock: product.stock,
             });
        }

        const transaction = await prisma.transaction.create({ data: validatedData });
        // Decrement the stock of the product
        await prisma.product.update({
            where: { id: transaction.product_id },
            data: {
                stock: {
                    decrement: transaction.quantity,
                },
            },
        });
        
        res.json(transaction);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const transaction = await prisma.transaction.findUnique({ where: { id: Number(id) }});
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const {
            sort_by_date,
            date_start,
            date_end,
            quantity_min,
            quantity_max,
        } = req.query;

        const where = {
            transaction_date: date_start && date_end
                ? {
                      gte: new Date(String(date_start)),
                      lte: new Date(String(date_end)),
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
            sort_by_date === 'asc' || sort_by_date === 'desc'
                ? [{ transaction_date: sort_by_date as 'asc' | 'desc' }, { quantity: sort_by_date as 'asc' | 'desc' }]
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

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const validatedData = transactionSchema.partial().parse(req.body);
        const updatedTransaction = await prisma.transaction.update({ where: { id }, data: validatedData });
        res.json(updatedTransaction);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await prisma.transaction.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export const transactionRoutes = router;