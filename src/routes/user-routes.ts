import { Router } from 'express'
import UserController from '../controllers/user-controller'

const userRoutes = Router()

userRoutes.get('/', UserController.getUser)
userRoutes.get('/:id', UserController.getUserById)
userRoutes.get('/login/:em', UserController.getUserByEmail)
userRoutes.post('/', UserController.createUser)
userRoutes.put('/:id', UserController.updateUser)
userRoutes.delete('/:id', UserController.removeUser)

export default userRoutes