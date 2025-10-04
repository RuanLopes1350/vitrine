import express from 'express';
import ControllerProduto from '../controller/controllerProduto.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const controller = new ControllerProduto();

router
    .post('/validate', authMiddleware, controller.validar.bind(controller))
    .post('/', authMiddleware, controller.cadastrar.bind(controller))
    .get('/', controller.listar.bind(controller))
    .get('/:id', controller.buscarPorId.bind(controller))
    .get('/usuario/:id', controller.buscarTodosProdutosUsuario.bind(controller))
    .patch('/:id', authMiddleware, controller.editar.bind(controller))
    .delete('/:id', authMiddleware, controller.deletar.bind(controller))
    
export default router;