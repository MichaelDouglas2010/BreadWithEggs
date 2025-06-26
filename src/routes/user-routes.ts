import { Router } from 'express'
import UserController from '../controllers/user-controller'

const userRoutes = Router()

userRoutes.get('/login/:em', UserController.getUserByEmail)
userRoutes.get('/', UserController.getUser)
userRoutes.get('/:id', UserController.getUserById)
userRoutes.post('/', UserController.createUser)
userRoutes.put('/:id', UserController.updateUser)
userRoutes.delete('/:id', UserController.removeUser)
userRoutes.post('/request-password-reset', UserController.requestPasswordReset);
userRoutes.post('/reset-password', UserController.resetPassword);
userRoutes.post('/login', UserController.loginUser);


export default userRoutes