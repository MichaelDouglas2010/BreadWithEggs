import { Router } from 'express'
import equipmentRoutes from './equipments-routes'
import maintenanceRoutes from './maintenance-routes'
import usageRoutes from './usage-routes'
import userRoutes from './user-routes'
import aboutRoutes from './about-routes'

const routes = Router()

routes.use('/equipment', equipmentRoutes)
routes.use('/maintenance', maintenanceRoutes)
routes.use('/usage', usageRoutes)
routes.use('/user', userRoutes)

routes.use('/about', aboutRoutes)


export default routes

