import express from 'express';
import ControllerUsuario from '../controller/controllerUsuario.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const controller = new ControllerUsuario();

router
    .post('/', controller.cadastrar.bind(controller))
    .get('/', authMiddleware, controller.listar.bind(controller))
    .get('/:id', authMiddleware, controller.buscarPorId.bind(controller))
    .patch('/:id', authMiddleware, controller.atualizar.bind(controller))
    .delete('/:id', authMiddleware, controller.deletar.bind(controller));

export default router;