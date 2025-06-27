import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../server';

export default class EquipmentsController {

  static async getEquipment(req: Request, res: Response) {
    try {
      const searchQuery = req.query.search?.toString();
      const database = await connectToDatabase();
      const collection = database.collection('equipments');
      let equipments;

      if (!searchQuery) {
        // Se não houver uma query de busca, retorna todos os equipamentos.
        equipments = await collection.find({}).toArray();
      } else {
        // Se houver uma query, constrói uma busca versátil.
        const queryConditions = [];

        // Condição 1: Verifica se a busca pode ser um ID válido do MongoDB.
        if (ObjectId.isValid(searchQuery)) {
            queryConditions.push({ _id: new ObjectId(searchQuery) });
        }

        // Condição 2: Busca por descrição (case-insensitive).
        queryConditions.push({ description: { $regex: searchQuery, $options: 'i' } });

        // Condição 3: Busca por marca (case-insensitive).
        queryConditions.push({ marca: { $regex: searchQuery, $options: 'i' } });
        
        // Condição 4: Busca por correspondência exata do QR Code.
        queryConditions.push({ qrCodeData: searchQuery });

        // Executa a busca no banco com o operador $or, que encontra documentos
        // que correspondam a QUALQUER uma das condições acima.
        equipments = await collection.find({ $or: queryConditions }).toArray();
      }

      if (equipments.length === 0 && searchQuery) {
        // Retorna 404 se a busca não encontrou resultados.
        return res.status(404).json({ error: 'Nenhum equipamento encontrado com o critério fornecido.' });
      }
      
      res.status(200).json(equipments);

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
  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      if (!status) {
        return res.status(400).json({ error: 'O campo status é obrigatório' });
      }
  
      const updatedData = { status }; // Apenas o status será atualizado
  
      const database = await connectToDatabase();
      const collection = database.collection('equipments');
      
      // Atualiza o status do equipamento com o id fornecido
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
  
      if (result.matchedCount > 0) {
        res.status(200).json({ message: 'Status do equipamento atualizado com sucesso' });
      } else {
        res.status(404).json({ error: 'Equipamento não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao atualizar o status do equipamento:', error);
      res.status(500).json({ error: 'Erro ao atualizar o status do equipamento' });
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
