import { Router } from 'express'
import UsageController from '../controllers/usage-controller'

const usageRoutes = Router()

// ✅ Rota para buscar todos os registros de uso
usageRoutes.get('/', UsageController.getUsageRecords)

// ✅ Rota para buscar um único registro de uso pelo ID
usageRoutes.get('/:id', UsageController.getUsageRecordById)

// ✅ Rota para buscar os registros de uso relacionados a um equipamento específico
usageRoutes.get('/all/:id', UsageController.getUsageRecordListById)

// ✅ Rota para criar um novo registro de uso
usageRoutes.post('/', UsageController.createUsageRecord)

// ✅ Rota para atualizar um registro de uso existente
usageRoutes.put('/:id', UsageController.updateUsageRecord)

// ✅ Rota para remover um registro de uso
usageRoutes.delete('/:id', UsageController.removeUsageRecord)

// ✅ Rota para buscar o último uso de um equipamento
usageRoutes.get('/last/:equipmentId', UsageController.getLastUsageByEquipmentId)

// ✅ Rota para registrar o retorno de um equipamento
usageRoutes.put('/return/:equipmentId', UsageController.returnEquipment)

export default usageRoutes
