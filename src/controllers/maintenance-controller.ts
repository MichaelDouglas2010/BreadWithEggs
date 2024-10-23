import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../server'

export default class MaintenanceController {

  static async getMaintenance(req: Request, res: Response) {
    try {
      const database = await connectToDatabase()
      const collection = database.collection('maintenances')
      const maintenances = await collection.find({}).toArray()
      res.status(200).json(maintenances)
    } catch (error) {
      console.error('Erro ao buscar dados da coleção maintenances:', error)
      res.status(500).json({ error: 'Erro ao buscar dados da coleção maintenances' })
    }
  }

  static async getMaintenanceById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const database = await connectToDatabase()
      const collection = database.collection('maintenances')
      const maintenance = await collection.findOne({ _id: new ObjectId(id) })
      if (maintenance) {
        res.status(200).json(maintenance)
      } else {
        res.status(404).json({ error: 'Manutenção não encontrada' })
      }
    } catch (error) {
      console.error('Erro ao buscar dados da coleção maintenances:', error)
      res.status(500).json({ error: 'Erro ao buscar dados da coleção maintenances' })
    }
  }

  static async createMaintenance(req: Request, res: Response) {
    try {
      const { equipmentId, description, cost, date, performedBy } = req.body

      const newMaintenance = {
        equipmentId,
        description,
        cost,
        date,
        performedBy,
        createdAt: new Date().toISOString()
      }

      const database = await connectToDatabase()
      const collection = database.collection('maintenances')
      const result = await collection.insertOne(newMaintenance)

      res.status(201).json({ _id: result.insertedId, ...newMaintenance })
    } catch (error) {
      console.error('Erro ao criar nova manutenção:', error)
      res.status(500).json({ error: 'Erro ao criar nova manutenção' })
    }
  }

  static async updateMaintenance(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { equipmentId, description, cost, date, performedBy } = req.body

      const updatedData = {
        equipmentId,
        description,
        cost,
        date,
        performedBy
      }

      const database = await connectToDatabase()
      const collection = database.collection('maintenances')
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      )

      if (result.matchedCount > 0) {
        res.status(200).json({ message: 'Manutenção atualizada com sucesso' })
      } else {
        res.status(404).json({ error: 'Manutenção não encontrada' })
      }
    } catch (error) {
      console.error('Erro ao atualizar manutenção:', error)
      res.status(500).json({ error: 'Erro ao atualizar manutenção' })
    }
  }

  static async removeMaintenance(req: Request, res: Response) {
    try {
      const { id } = req.params

      const database = await connectToDatabase()
      const collection = database.collection('maintenances')
      const result = await collection.deleteOne({ _id: new ObjectId(id) })

      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Manutenção removida com sucesso' })
      } else {
        res.status(404).json({ error: 'Manutenção não encontrada' })
      }
    } catch (error) {
      console.error('Erro ao remover manutenção:', error)
      res.status(500).json({ error: 'Erro ao remover manutenção' })
    }
  }
}
