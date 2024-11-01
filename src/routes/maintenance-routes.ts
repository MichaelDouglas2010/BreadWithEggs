import { Router } from 'express'
import MaintenanceController from '../controllers/maintenance-controller'

const maintenanceRoutes = Router()

maintenanceRoutes.get('/', MaintenanceController.getMaintenance)
maintenanceRoutes.get('/:id', MaintenanceController.getMaintenanceById)
maintenanceRoutes.post('/', MaintenanceController.createMaintenance)
maintenanceRoutes.put('/:id', MaintenanceController.updateMaintenance)
maintenanceRoutes.delete('/:id', MaintenanceController.removeMaintenance)

export default maintenanceRoutes