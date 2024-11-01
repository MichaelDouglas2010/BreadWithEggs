import { Router } from 'express'
import equipmentRoutes from './equipments-routes'
import maintenanceRoutes from './maintenance-routes'
import usageRoutes from './usage-routes'
import userRoutes from './user-routes'

const routes = Router()

routes.use('/equipment', equipmentRoutes)
routes.use('/maintenance', maintenanceRoutes)
routes.use('/usage', usageRoutes)
routes.use('/user', userRoutes)

export default routes

