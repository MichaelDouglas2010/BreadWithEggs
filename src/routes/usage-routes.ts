import { Router } from 'express'
import UsageController from '../controllers/usage-controller'

const usageRoutes = Router()

usageRoutes.get('/', UsageController.getUsageRecords)
usageRoutes.get('/:id', UsageController.getUsageRecordById)
usageRoutes.post('/', UsageController.createUsageRecord)
usageRoutes.put('/:id', UsageController.updateUsageRecord)
usageRoutes.delete('/:id', UsageController.removeUsageRecord)

export default usageRoutes