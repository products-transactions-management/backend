import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const productSchema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    stock: z.number().int().nonnegative(),
});

router.post('/', async (req, res) => {
    try {
        const validatedData = productSchema.parse(req.body);
        const product = await prisma.product.create({ data: validatedData });
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.get('/', async (req, res) => {
    try {
        const { search, sort } = req.query;

        const where = search
            ? { OR: [{ name: { contains: String(search) } }, { type: { contains: String(search) } }] }
            : undefined;

        const orderBy = sort && (sort === 'asc' || sort === 'desc') ? { name: sort as 'asc' | 'desc' } : undefined;

        const products = await prisma.product.findMany({
            where,
            orderBy,
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const validatedData = productSchema.partial().parse(req.body);
        const updatedProduct = await prisma.product.update({ where: { id }, data: validatedData });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma.product.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// router.get('/', async (req, res) => {
//     try {
//         const { search, sort } = req.query;
//         const where = search
//             ? { OR: [{ name: { contains: String(search) } }, { type: { contains: String(search) } }] }
//             : undefined;
//         const orderBy = sort === 'asc' || sort === 'desc' ? { name: sort as 'asc' | 'desc' } : undefined;

//         const products = await prisma.product.findMany({ where, orderBy });
//         res.json(products);
//     } catch (error) {
//         res.status(500).json({ error: (error as Error).message });
//     }
// });

export const productRoutes = router;
