import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../server'

export default class UsageController {

  static async getUsageRecords(req: Request, res: Response) {
    try {
      const database = await connectToDatabase()
      const collection = database.collection('usageRecords')
      const usageRecords = await collection.find({}).toArray()
      res.status(200).json(usageRecords)
    } catch (error) {
      console.error('Erro ao buscar dados da coleção usageRecords:', error)
      res.status(500).json({ error: 'Erro ao buscar dados da coleção usageRecords' })
    }
  }

  static async getUsageRecordById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const database = await connectToDatabase()
      const collection = database.collection('usageRecords')
      const usageRecord = await collection.findOne({ _id: new ObjectId(id) })
      if (usageRecord) {
        res.status(200).json(usageRecord)
      } else {
        res.status(404).json({ error: 'Registro de uso não encontrado' })
      }
    } catch (error) {
      console.error('Erro ao buscar dados da coleção usageRecords:', error)
      res.status(500).json({ error: 'Erro ao buscar dados da coleção usageRecords' })
    }
  }

  static async createUsageRecord(req: Request, res: Response) {
    try {
      const { equipmentId, userId, activity, startTime, endTime, totalHours } = req.body

      const newUsageRecord = {
        equipmentId,
        userId,
        activity,
        startTime,
        endTime,
        totalHours,
        createdAt: new Date().toISOString()
      }

      const database = await connectToDatabase()
      const collection = database.collection('usageRecords')
      const result = await collection.insertOne(newUsageRecord)

      res.status(201).json({ _id: result.insertedId, ...newUsageRecord })
    } catch (error) {
      console.error('Erro ao criar novo registro de uso:', error)
      res.status(500).json({ error: 'Erro ao criar novo registro de uso' })
    }
  }

  static async updateUsageRecord(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { equipmentId, userId, activity, startTime, endTime, totalHours } = req.body

      const updatedData = {
        equipmentId,
        userId,
        activity,
        startTime,
        endTime,
        totalHours
      }

      const database = await connectToDatabase()
      const collection = database.collection('usageRecords')
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      )

      if (result.matchedCount > 0) {
        res.status(200).json({ message: 'Registro de uso atualizado com sucesso' })
      } else {
        res.status(404).json({ error: 'Registro de uso não encontrado' })
      }
    } catch (error) {
      console.error('Erro ao atualizar registro de uso:', error)
      res.status(500).json({ error: 'Erro ao atualizar registro de uso' })
    }
  }

  static async removeUsageRecord(req: Request, res: Response) {
    try {
      const { id } = req.params

      const database = await connectToDatabase()
      const collection = database.collection('usageRecords')
      const result = await collection.deleteOne({ _id: new ObjectId(id) })

      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Registro de uso removido com sucesso' })
      } else {
        res.status(404).json({ error: 'Registro de uso não encontrado' })
      }
    } catch (error) {
      console.error('Erro ao remover registro de uso:', error)
      res.status(500).json({ error: 'Erro ao remover registro de uso' })
    }
  }
}
