// controllers/itemController.ts
import { Request, Response } from 'express';
import Item from '../models/index';

// Função para adicionar um item
export const addItem = async (req: Request, res: Response) => {
  const { name, price } = req.body;

  try {
    const newItem = new Item({ name, price });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Função para listar todos os itens
export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
