import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../server';

export default class EquipmentsController {

  static async getEquipment(req: Request, res: Response) {
    try {
      const searchQuery = req.query.search?.toString(); // Modificado para pegar o parâmetro de busca correto
      const database = await connectToDatabase();
      const collection = database.collection('equipments');

      let equipments;

      if (searchQuery && ObjectId.isValid(searchQuery)) {
        // Se for um ObjectId válido, busca pelo ID
        equipments = await collection.find({ _id: new ObjectId(searchQuery) }).toArray();
      } else if (searchQuery) {
        // Se não é um ObjectId, busca por descrição usando regex
        equipments = await collection.find({ description: { $regex: searchQuery, $options: 'i' } }).toArray();
      } else {
        // Sem query, retorna todos os equipamentos
        equipments = await collection.find({}).toArray();
      }

      // Se não encontrar equipamentos, retorna um array vazio
      if (equipments.length === 0 && searchQuery) {
        res.status(200).json([]); // Retorna um array vazio se não encontrar
      } else {
        res.status(200).json(equipments);
      }
    } catch (error) {
      console.error('Erro ao buscar dados da coleção equipments:', error);
      res.status(500).json({ error: 'Erro ao buscar dados da coleção equipments' });
    }
  }

  static async getEquipmentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const database = await connectToDatabase();
      const collection = database.collection('equipments');
      const equipment = await collection.findOne({ _id: new ObjectId(id) });
      if (equipment) {
        res.status(200).json(equipment);
      } else {
        res.status(404).json({ error: 'Equipamento não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao buscar dados da coleção equipments:', error);
      res.status(500).json({ error: 'Erro ao buscar dados da coleção equipments' });
    }
  }

  static async createEquipment(req: Request, res: Response) {
    try {
      const { description, marca, dataEntrada, status, qrCodeData } = req.body;

      const newEquipment = {
        description,
        marca,
        dataEntrada,
        status,
        qrCodeData,
      };

      const database = await connectToDatabase();
      const collection = database.collection('equipments');
      const result = await collection.insertOne(newEquipment);

      res.status(201).json({ _id: result.insertedId, ...newEquipment });
    } catch (error) {
      console.error('Erro ao criar novo equipamento:', error);
      res.status(500).json({ error: 'Erro ao criar novo equipamento' });
    }
  }

  static async updateEquipment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { description, marca, dataEntrada, status, qrCodeData } = req.body;

      const updatedData = {
        description,
        marca,
        dataEntrada,
        status,
        qrCodeData,
      };

      const database = await connectToDatabase();
      const collection = database.collection('equipments');
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );

      if (result.matchedCount > 0) {
        res.status(200).json({ message: 'Equipamento atualizado com sucesso' });
      } else {
        res.status(404).json({ error: 'Equipamento não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao atualizar equipamento:', error);
      res.status(500).json({ error: 'Erro ao atualizar equipamento' });
    }
  }

  static async removeEquipment(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const database = await connectToDatabase();
      const collection = database.collection('equipments');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Equipamento removido com sucesso' });
      } else {
        res.status(404).json({ error: 'Equipamento não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao remover equipamento:', error);
      res.status(500).json({ error: 'Erro ao remover equipamento' });
    }
  }
}
