import { Router } from 'express'
import AboutController from '../controllers/about-controller'

const aboutRoutes = Router()

aboutRoutes.get('/', AboutController.getAbout)

export default aboutRoutes