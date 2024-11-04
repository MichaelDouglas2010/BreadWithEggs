import { Router } from 'express';

import EquipmentsController from '../controllers/equipments-controller';
import { body, param } from 'express-validator/lib/middlewares/validation-chain-builders';

const equipmentRoutes = Router();

// Validação para a criação e atualização de equipamentos
const equipmentValidation = [
  body('description').isString().notEmpty().withMessage('Descrição é obrigatória'),
  body('marca').isString().notEmpty().withMessage('Marca é obrigatória'),
  body('dataEntrada').isISO8601().toDate().withMessage('Data de entrada deve ser uma data válida'),
  body('status').isString().isIn(['ativo', 'inativo', 'emprestado']).withMessage('Status deve ser ativo, inativo ou emprestado'),
];

// Validação para parâmetros de ID
const idValidation = [
  param('id').isMongoId().withMessage('ID deve ser um ObjectId válido'),
];

// Rota para obter todos os equipamentos
equipmentRoutes.get('/', EquipmentsController.getEquipment);

// Rota para obter um equipamento específico por ID
equipmentRoutes.get('/:id', idValidation, EquipmentsController.getEquipmentById);

// Rota para criar um novo equipamento
equipmentRoutes.post('/', equipmentValidation, EquipmentsController.createEquipment);

// Rota para atualizar um equipamento existente
equipmentRoutes.put('/:id', [...idValidation, ...equipmentValidation], EquipmentsController.updateEquipment);

// Rota para remover um equipamento
equipmentRoutes.delete('/:id', idValidation, EquipmentsController.removeEquipment);

export default equipmentRoutes;
