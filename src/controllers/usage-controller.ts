import { Request, Response } from 'express';
import { Collection, Document, ObjectId } from 'mongodb';
import { connectToDatabase } from '../server';

// Interface agora definida localmente dentro deste arquivo.
interface UsageRecord {
  _id: ObjectId;
  equipmentId: ObjectId;
  userId: ObjectId;
  description?: string;
  marca?: string;
  activity: string;
  startTime: Date;
  endTime: Date | null;
  totalHours: number;
  assinatura: string | null;
  observacoes: string | null;
  retiradoPor: string | null;
  createdAt: Date;
}

export default class UsageController {

  private static async getCollection(): Promise<Collection<Document>> {
    const database = await connectToDatabase();
    return database.collection('usageRecords');
  }

  private static handleError(res: Response, error: unknown, defaultMessage: string) {
    console.error(`❌ ${defaultMessage}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ error: defaultMessage, details: error.message });
    } else {
      res.status(500).json({ error: 'Ocorreu um erro desconhecido.' });
    }
  }

  // --- Funções Principais (Saída e Entrada) ---

  static async createUsageRecord(req: Request, res: Response): Promise<void | Response> {
    try {
      const { retiradoPor, observacoes, equipmentId, description, marca, userId, activity, assinatura } = req.body;

      if (!equipmentId || !userId || !activity || !assinatura || !retiradoPor) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando: equipmentId, userId, activity, assinatura, retiradoPor.' });
      }

      if (!ObjectId.isValid(equipmentId) || !ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'ID de equipamento ou de usuário inválido.' });
      }

      const newUsageRecord = {
        equipmentId: new ObjectId(equipmentId),
        userId: new ObjectId(userId),
        description,
        marca,
        activity,
        startTime: new Date(),
        endTime: null,
        totalHours: 0,
        assinatura,
        observacoes,
        retiradoPor,
        createdAt: new Date(),
      };

      const collection = await UsageController.getCollection();
      const result = await collection.insertOne(newUsageRecord);

      res.status(201).json({ ...newUsageRecord, _id: result.insertedId });

    } catch (error) {
      UsageController.handleError(res, error, 'Erro ao criar novo registro de uso');
    }
  }

  /**
   * Registra a devolução de um equipamento (Entrada).
   * Esta função foi refatorada para ser mais robusta e dar melhores retornos de erro.
   */
  static async returnEquipment(req: Request, res: Response): Promise<void | Response> {
    try {
      const { equipmentId } = req.params; 

      if (!ObjectId.isValid(equipmentId)) {
        return res.status(400).json({ error: 'ID de equipamento inválido.' });
      }
      
      const collection = await UsageController.getCollection();
  
      // Passo 1: Encontra o registo de uso mais recente para este equipamento.
      const latestUsageRecord = await collection.findOne(
        { equipmentId: new ObjectId(equipmentId) },
        { sort: { startTime: -1 } }
      );
  
      // Passo 2: Verifica o estado do registo encontrado.
      if (!latestUsageRecord) {
        return res.status(404).json({ error: 'Nenhum histórico de uso encontrado para este equipamento.' });
      }

      if (latestUsageRecord.endTime !== null) {
        const lastReturnDate = new Date(latestUsageRecord.endTime).toLocaleString('pt-BR');
        // Usa o status 409 Conflict, pois a ação não pode ser executada no estado atual do recurso.
        return res.status(409).json({ error: `Este equipamento já foi devolvido em ${lastReturnDate}.` });
      }
  
      // Se o código chegou até aqui, o registo está em aberto e pode ser atualizado.
      const startTime = new Date(latestUsageRecord.startTime);
      const endTime = new Date();
      
      const diffInMs = endTime.getTime() - startTime.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);

      const result = await collection.updateOne(
        { _id: latestUsageRecord._id },
        { 
          $set: { 
            endTime: endTime,
            totalHours: parseFloat(diffInHours.toFixed(2))
          } 
        }
      );

      if (result.modifiedCount > 0) {
        res.status(200).json({ message: 'Equipamento devolvido com sucesso.' });
      } else {
        res.status(500).json({ error: 'Falha ao atualizar o registro de devolução.' });
      }

    } catch (error) {
      UsageController.handleError(res, error, 'Erro ao devolver equipamento');
    }
  }

  // --- Funções de Busca (GET) ---

  static async getUsageRecords(req: Request, res: Response): Promise<void> {
    try {
      const collection = await UsageController.getCollection();
      const usageRecords = await collection.find({}).sort({ startTime: -1 }).toArray();
      res.status(200).json(usageRecords);
    } catch (error) {
      UsageController.handleError(res, error, 'Erro ao buscar registros de uso');
    }
  }
  
  static async getUsageRecordById(req: Request, res: Response): Promise<void | Response> {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID de registro inválido.' });
      }

      const collection = await UsageController.getCollection();
      const usageRecord = await collection.findOne({ _id: new ObjectId(id) });

      if (usageRecord) {
        res.status(200).json(usageRecord);
      } else {
        res.status(404).json({ error: 'Registro de uso não encontrado.' });
      }
    } catch (error) {
      UsageController.handleError(res, error, 'Erro ao buscar registro de uso por ID');
    }
  }

  static async getUsageRecordListById(req: Request, res: Response): Promise<void | Response> {
    try {
      const { id } = req.params; 
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID de equipamento inválido.' });
      }

      const collection = await UsageController.getCollection();
      const usageRecords = await collection
        .find({ equipmentId: new ObjectId(id) })
        .sort({ startTime: -1 })
        .limit(10)
        .toArray();

      res.status(200).json(usageRecords);
    } catch (error) {
      UsageController.handleError(res, error, 'Erro ao listar registros do equipamento');
    }
  }

  static async getLastUsageByEquipmentId(req: Request, res: Response): Promise<void | Response> {
    try {
      const { equipmentId } = req.params;
      if (!ObjectId.isValid(equipmentId)) {
        return res.status(400).json({ error: 'ID de equipamento inválido.' });
      }

      const collection = await UsageController.getCollection();
      const lastUsageRecord = await collection.findOne(
        { equipmentId: new ObjectId(equipmentId) },
        { sort: { startTime: -1 } }
      );
      
      if (lastUsageRecord) {
        res.status(200).json(lastUsageRecord);
      } else {
        res.status(404).json({ error: 'Nenhum registro de uso encontrado para este equipamento.' });
      }
    } catch (error) {
      UsageController.handleError(res, error, 'Erro ao buscar último registro de uso');
    }
  }

  // --- Funções de Modificação (PUT, DELETE) ---

  static async updateUsageRecord(req: Request, res: Response): Promise<void | Response> {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID de registro inválido.' });
      }

      const updateData = req.body;
      delete updateData._id;

      const collection = await UsageController.getCollection();
      const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

      if (result.matchedCount > 0) {
        res.status(200).json({ message: 'Registro de uso atualizado com sucesso.' });
      } else {
        res.status(404).json({ error: 'Registro de uso não encontrado para atualização.' });
      }
    } catch (error) {
      UsageController.handleError(res, error, 'Erro ao atualizar registro de uso');
    }
  }

  static async removeUsageRecord(req: Request, res: Response): Promise<void | Response> {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID de registro inválido.' });
      }

      const collection = await UsageController.getCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Registro de uso removido com sucesso.' });
      } else {
        res.status(404).json({ error: 'Registro de uso não encontrado para remoção.' });
      }
    } catch (error) {
      UsageController.handleError(res, error, 'Erro ao remover registro de uso');
    }
  }
}
