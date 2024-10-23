// routes/itemRoutes.ts
import { Router } from 'express';
import equipmentRoutes from './equipments-routes';
import maintenanceRoutes from './maintenance-routes';

const routes = Router();

routes.use('/equipment', equipmentRoutes)
routes.use('/maintenance', maintenanceRoutes)

export default routes

