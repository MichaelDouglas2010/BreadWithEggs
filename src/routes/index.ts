// routes/itemRoutes.ts
import { Router } from 'express';
import equipmentRoutes from './equipments-routes';

const routes = Router();

routes.use('/equipment', equipmentRoutes)

export default routes

