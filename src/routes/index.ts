import { Router } from 'express'
import equipmentRoutes from './equipments-routes'
import maintenanceRoutes from './maintenance-routes'
import usageRoutes from './usage-routes'

const routes = Router()

routes.use('/equipment', equipmentRoutes)
routes.use('/maintenance', maintenanceRoutes)
routes.use('/usage', usageRoutes)

export default routes

