import { Request, Response } from 'express'
import { connectToDatabase } from '../server'
import { ObjectId } from 'mongodb';

export default class EquipmentsController
{
    
    static async getEquipments(req: Request, res: Response){
        try {
            const database = await connectToDatabase()
            const collection = database.collection('equipments')
            const equipments = await collection.find({}).toArray()
            res.status(200).json(equipments)
          } catch (error) {
            console.error('Erro ao buscar dados da coleção equipments:', error)
            res.status(500).json({ error: 'Erro ao buscar dados da coleção equipments' })
          }
    }

    static async getEquipmentById(req: Request, res: Response){
        try {
            const { id } = req.params;
            const database = await connectToDatabase()
            const collection = database.collection('equipments')
            const equipment = await collection.findOne({ _id: new ObjectId(id) })
            if (equipment) {
                res.status(200).json(equipment);
            } else {
                res.status(404).json({ error: 'Equipamento não encontrado' });
            }
          } catch (error) {
            console.error('Erro ao buscar dados da coleção equipments:', error)
            res.status(500).json({ error: 'Erro ao buscar dados da coleção equipments' })
          }
    }
}