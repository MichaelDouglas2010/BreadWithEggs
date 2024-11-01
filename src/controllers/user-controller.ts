import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../server'

export default class UserController {

  static async getUser(req: Request, res: Response) {
    try {
      const database = await connectToDatabase()
      const collection = database.collection('users')
      const users = await collection.find({}).toArray()
      res.status(200).json(users)
    } catch (error) {
      console.error('Erro ao buscar dados da coleção users:', error)
      res.status(500).json({ error: 'Erro ao buscar dados da coleção users' })
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const database = await connectToDatabase()
      const collection = database.collection('users')
      const user = await collection.findOne({ _id: new ObjectId(id) })
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ error: 'Usuário não encontrado' })
      }
    } catch (error) {
      console.error('Erro ao buscar dados da coleção users:', error)
      res.status(500).json({ error: 'Erro ao buscar dados da coleção users' })
    }
  }

  static async getUserByEmail(req: Request, res: Response) {
    try {
      const { em } = req.params
      const database = await connectToDatabase()
      const collection = database.collection('users')
      const user = await collection.findOne({ email: em })
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ error: 'Usuário não encontrado' })
      }
    } catch (error) {
      console.error('Erro ao buscar dados da coleção users:', error)
      res.status(500).json({ error: 'Erro ao buscar dados da coleção users' })
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { name, email, password, team } = req.body

      const newUser = {
        name,
        email,
        password,
        team,
        createdAt: new Date().toISOString()
      }

      const database = await connectToDatabase()
      const collection = database.collection('users')
      const result = await collection.insertOne(newUser)

      res.status(201).json({ _id: result.insertedId, ...newUser })
    } catch (error) {
      console.error('Erro ao criar novo usuário:', error)
      res.status(500).json({ error: 'Erro ao criar novo usuário' })
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, email, password, team } = req.body

      const updatedData = {
        name,
        email,
        password,
        team
      }

      const database = await connectToDatabase()
      const collection = database.collection('users')
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      )

      if (result.matchedCount > 0) {
        res.status(200).json({ message: 'Usuário atualizado com sucesso' })
      } else {
        res.status(404).json({ error: 'Usuário não encontrado' })
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      res.status(500).json({ error: 'Erro ao atualizar usuário' })
    }
  }

  static async removeUser(req: Request, res: Response) {
    try {
      const { id } = req.params

      const database = await connectToDatabase()
      const collection = database.collection('users')
      const result = await collection.deleteOne({ _id: new ObjectId(id) })

      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Usuário removido com sucesso' })
      } else {
        res.status(404).json({ error: 'Usuário não encontrado' })
      }
    } catch (error) {
      console.error('Erro ao remover usuário:', error)
      res.status(500).json({ error: 'Erro ao remover usuário' })
    }
  }
}