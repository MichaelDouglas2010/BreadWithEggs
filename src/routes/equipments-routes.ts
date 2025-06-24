import { Router } from 'express';
import cors from 'cors';
import EquipmentsController from '../controllers/equipments-controller';
import { body, param } from 'express-validator/lib/middlewares/validation-chain-builders';

const equipmentRoutes = Router();

// Validações já existentes para os campos de equipamento
const equipmentValidation = [
  body('description').isString().notEmpty().withMessage('Descrição é obrigatória'),
  body('marca').isString().notEmpty().withMessage('Marca é obrigatória'),
  body('dataEntrada').isISO8601().toDate().withMessage('Data de entrada deve ser uma data válida'),
  body('status').isString().isIn(['ativo', 'inativo', 'emprestado']).withMessage('Status deve ser ativo, inativo ou emprestado'),
];

const statusValidation = [
  body('status')
    .isString()
    .isIn(['ativo', 'inativo', 'emprestado'])
    .withMessage('Status deve ser ativo, inativo ou emprestado'),
];

const idValidation = [
  param('id').isMongoId().withMessage('ID deve ser um ObjectId válido'),
];

equipmentRoutes.get('/', EquipmentsController.getEquipment);
equipmentRoutes.get('/:id', idValidation, EquipmentsController.getEquipmentById);
equipmentRoutes.post('/', equipmentValidation, EquipmentsController.createEquipment);
equipmentRoutes.put('/:id', [...idValidation, ...equipmentValidation], EquipmentsController.updateEquipment);
equipmentRoutes.delete('/:id', idValidation, EquipmentsController.removeEquipment);

equipmentRoutes.patch('/:id/status', [...idValidation, ...statusValidation], EquipmentsController.updateStatus);

export default equipmentRoutes;
