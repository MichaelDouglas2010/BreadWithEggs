import { Router } from 'express'
import EquipmentsController from '../controllers/equipments-controller'

const equipmentRoutes = Router()

equipmentRoutes.get('/', EquipmentsController.getEquipments)
equipmentRoutes.get('/:id', EquipmentsController.getEquipmentById)
/*clienteRoutes.get('/get', ClienteController.index)
clienteRoutes.get('/get/:id', ClienteController.show)
clienteRoutes.delete('/delete/:id',ClienteController.delete)
clienteRoutes.put('/update/:id',ClienteController.update)*/

export default equipmentRoutes