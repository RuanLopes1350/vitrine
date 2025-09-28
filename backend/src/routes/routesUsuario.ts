import express from 'express';
import ControllerUsuario from '../controller/controllerUsuario.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const controller = new ControllerUsuario();

router
    .post('/usuarios', controller.cadastrar.bind(controller))
    .get('/usuarios', authMiddleware, controller.listar.bind(controller))
    .get('/usuarios/:id', authMiddleware, controller.buscarPorId.bind(controller))
    .patch('/usuarios/:id', authMiddleware, controller.atualizar.bind(controller))
    .delete('/usuarios/:id', authMiddleware, controller.deletar.bind(controller));

export default router;