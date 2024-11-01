import { Router } from 'express'
import EquipmentsController from '../controllers/equipments-controller'

const equipmentRoutes = Router()

equipmentRoutes.get('/', EquipmentsController.getEquipment)
equipmentRoutes.get('/:id', EquipmentsController.getEquipmentById)
equipmentRoutes.post('/', EquipmentsController.createEquipment)
equipmentRoutes.put('/:id', EquipmentsController.updateEquipment)
equipmentRoutes.delete('/:id', EquipmentsController.removeEquipment)

export default equipmentRoutes