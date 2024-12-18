import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const productSchema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    stock: z.number().int().nonnegative(),
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const validatedData = productSchema.parse(req.body);
        const product = await prisma.product.create({ data: validatedData });
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const product = await prisma.product.findUnique({ where: { id: Number(id) } });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const { search, sort_by_name } = req.query;

        const where = search
            ? { OR: [{ name: { contains: String(search) } }, { type: { contains: String(search) } }] }
            : undefined;

        const orderBy = sort_by_name && (sort_by_name === 'asc' || sort_by_name === 'desc') ? { name: sort_by_name as 'asc' | 'desc' } : undefined;

        const products = await prisma.product.findMany({
            where,
            orderBy,
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});


router.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const validatedData = productSchema.partial().parse(req.body);
        const updatedProduct = await prisma.product.update({ where: { id }, data: validatedData });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await prisma.product.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export const productRoutes = router;
