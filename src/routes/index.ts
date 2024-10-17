// routes/itemRoutes.ts
import { Router, Request, Response } from 'express';
import Item from '../models/index';
import { addItem, getItems } from '../controllers/index';

const router: Router = Router();

// Rota para adicionar um item
router.post('/add-item', addItem, async (req: Request, res: Response) => {
  const { name, price } = req.body;

  try {
    const newItem = new Item({ name, price });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Rota para listar todos os itens
router.get('/items', getItems, async (req: Request, res: Response) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
