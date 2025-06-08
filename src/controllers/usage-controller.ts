import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../server';

export default class UsageController {
  
  // Função para obter todos os registros de uso
  static async getUsageRecords(req: Request, res: Response) {
    try {
      const database = await connectToDatabase();
      const collection = database.collection('usageRecords');
      const usageRecords = await collection.find({}).toArray();
      res.status(200).json(usageRecords);
    } catch (error: unknown) { // Alteração aqui: tipagem do erro
      if (error instanceof Error) {
        console.error('Erro ao buscar dados da coleção usageRecords:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados da coleção usageRecords', details: error.message });
      } else {
        res.status(500).json({ error: 'Erro desconhecido ao buscar dados' });
      }
    }
  }

  // Função para obter um registro de uso pelo ID
  static async getUsageRecordById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Verificando se o ID é válido
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const database = await connectToDatabase();
      const collection = database.collection('usageRecords');
      const usageRecord = await collection.findOne({ _id: new ObjectId(id) });

      if (usageRecord) {
        res.status(200).json(usageRecord);
      } else {
        res.status(404).json({ error: 'Registro de uso não encontrado' });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar dados da coleção usageRecords:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados da coleção usageRecords', details: error.message });
      } else {
        res.status(500).json({ error: 'Erro desconhecido ao buscar dados' });
      }
    }
  }

  // Função para listar registros de uso de um equipamento específico
  static async getUsageRecordListById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Verificando se o ID é válido
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const database = await connectToDatabase();
      const collection = database.collection('usageRecords');
      const usageRecords = await collection
        .find({ equipmentId: id })
        .sort({ startTime: -1 })
        .limit(10)
        .toArray();

      if (usageRecords.length > 0) {
        res.status(200).json(usageRecords);
      } else {
        res.status(404).json({ error: 'Nenhum registro de uso encontrado' });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar dados da coleção usageRecords:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados da coleção usageRecords', details: error.message });
      } else {
        res.status(500).json({ error: 'Erro desconhecido ao buscar dados' });
      }
    }
  }

  // Função para criar um novo registro de uso
  static async createUsageRecord(req: Request, res: Response) {
    try {
      const { retiradoPor, observacoes, equipmentId, description, marca, userId, activity, startTime, endTime, totalHours, assinatura } = req.body;

      if (!equipmentId || !userId || !activity || !startTime || !totalHours || !assinatura) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }

      const newUsageRecord = {
        equipmentId,
        userId,
        description,
        marca,
        activity,
        startTime,
        endTime,
        assinatura,
        observacoes,
        retiradoPor,
        totalHours: parseFloat(totalHours),
        createdAt: new Date().toISOString(),
      };

      const database = await connectToDatabase();
      const collection = database.collection('usageRecords');
      const result = await collection.insertOne(newUsageRecord);

      res.status(201).json({ _id: result.insertedId, ...newUsageRecord });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao criar novo registro de uso:', error.message);
        res.status(500).json({ error: 'Erro ao criar novo registro de uso', details: error.message });
      } else {
        res.status(500).json({ error: 'Erro desconhecido ao criar novo registro de uso' });
      }
    }
  }

  // Função para atualizar um registro de uso
  static async updateUsageRecord(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { equipmentId, description, marca, userId, activity, startTime, endTime, totalHours, assinatura, observacoes,retiradoPor } = req.body;

      // Verificando se o ID é válido
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      if (!equipmentId || !userId || !activity || !startTime || !endTime || !totalHours) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }

      const updatedData = {
        equipmentId,
        userId,
        description,
        marca,
        activity,
        startTime,
        endTime,
        assinatura,
        observacoes,
        retiradoPor,
        totalHours: parseFloat(totalHours),
      };

      const database = await connectToDatabase();
      const collection = database.collection('usageRecords');
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );

      if (result.matchedCount > 0) {
        res.status(200).json({ message: 'Registro de uso atualizado com sucesso' });
      } else {
        res.status(404).json({ error: 'Registro de uso não encontrado' });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao atualizar registro de uso:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar registro de uso', details: error.message });
      } else {
        res.status(500).json({ error: 'Erro desconhecido ao atualizar registro de uso' });
      }
    }
  }

  // Função para remover um registro de uso
  static async removeUsageRecord(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificando se o ID é válido
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const database = await connectToDatabase();
      const collection = database.collection('usageRecords');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Registro de uso removido com sucesso' });
      } else {
        res.status(404).json({ error: 'Registro de uso não encontrado' });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao remover registro de uso:', error.message);
        res.status(500).json({ error: 'Erro ao remover registro de uso', details: error.message });
      } else {
        res.status(500).json({ error: 'Erro desconhecido ao remover registro de uso' });
      }
    }
  }

  // Função para obter o último registro de uso de um equipamento
  static async getLastUsageByEquipmentId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const database = await connectToDatabase();
      const collection = database.collection('usageRecords');
      
      // Encontra o último registro de uso do equipamento
      const lastUsageRecord = await collection.find({ equipmentId: id })
        .sort({ startTime: -1 })
        .limit(1)
        .toArray();

      if (lastUsageRecord.length > 0) {
        res.status(200).json(lastUsageRecord[0]);
      } else {
        res.status(404).json({ error: 'Nenhum registro de uso encontrado para este equipamento' });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar último registro de uso:', error.message);
        res.status(500).json({ error: 'Erro ao buscar último registro de uso' });
      } else {
        res.status(500).json({ error: 'Erro desconhecido ao buscar último registro de uso' });
      }
    }
  }

  // Função para marcar a devolução de um equipamento
  static async returnEquipment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { endTime } = req.body; // pega o endTime do corpo da requisição
      const database = await connectToDatabase();
      const collection = database.collection('usageRecords');
  
      // Busca o último registro de uso do equipamento com o ID como string
      const lastUsageRecord = await collection.find({ equipmentId: id })
        .sort({ startTime: -1 })
        .limit(1)
        .toArray();
  
      if (lastUsageRecord.length > 0) {
        // Usa o endTime enviado, ou o horário atual se não for enviado
        const updatedEndTime = endTime || new Date().toISOString();
  
        const result = await collection.updateOne(
          { _id: lastUsageRecord[0]._id },
          { $set: { endTime: updatedEndTime } }
        );
  
        if (result.modifiedCount > 0) {
          res.status(200).json({ message: 'Equipamento devolvido com sucesso' });
        } else {
          res.status(500).json({ error: 'Erro ao atualizar o registro de devolução do equipamento' });
        }
      } else {
        res.status(404).json({ error: 'Nenhum registro de uso encontrado para este equipamento' });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao devolver equipamento:', error.message);
        res.status(500).json({ error: 'Erro ao devolver equipamento' });
      } else {
        res.status(500).json({ error: 'Erro desconhecido ao devolver equipamento' });
      }
    }
  }
}
