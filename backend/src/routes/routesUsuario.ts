import express from 'express';
import ControllerUsuario from '../controller/controllerUsuario';

const router = express.Router();
const controller = new ControllerUsuario();

router
    .post('/usuarios', controller.cadastrar.bind(controller))
    .get('/usuarios', controller.listar.bind(controller))
    .get('/usuarios/:id', controller.buscarPorId.bind(controller))
    .patch('/usuarios/:id', controller.atualizar.bind(controller))
    .delete('/usuarios/:id', controller.deletar.bind(controller));

export default router;