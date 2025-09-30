import express from 'express';
import ControllerProduto from '../controller/controllerProduto.js';
import authMiddleware, { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

const router = express.Router();
const controller = new ControllerProduto();

router
    .post('/validate', authMiddleware, async (req, res) => {
        // Endpoint apenas para validar os dados sem salvar
        const userId = (req as AuthenticatedRequest).user_id;
        try {
            const response = await controller.validar(req.body, userId);
            return response.send(res);
        } catch (error) {
            return res.status(500).json({
                erro: true,
                code: 500,
                mensagem: 'Erro interno no servidor',
                data: null,
                erros: []
            });
        }
    })
    .post('/', authMiddleware, async (req, res) => {
        const userId = (req as AuthenticatedRequest).user_id;
        const response = await controller.cadastrar(req.body, userId);
        return response.send(res);
    })
    .get('/', async (req, res) => {
        const response = await controller.listar();
        return response.send(res);
    })
    .get('/:id', async (req, res) => {
        // Validar se o ID é um ObjectId válido
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                erro: true,
                code: 400,
                mensagem: 'ID inválido. Deve ser um ObjectId válido do MongoDB.',
                data: null,
                erros: []
            });
        }

        const response = await controller.buscarPorId(req.params.id);
        return response.send(res);
    })
    .patch('/:id', authMiddleware, async (req, res) => {
        // Validar se o ID é um ObjectId válido
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                erro: true,
                code: 400,
                mensagem: 'ID inválido. Deve ser um ObjectId válido do MongoDB.',
                data: null,
                erros: []
            });
        }

        // Validar se há dados para atualizar
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                erro: true,
                code: 400,
                mensagem: 'Nenhum dado fornecido para atualização',
                data: null,
                erros: []
            });
        }

        const userId = (req as AuthenticatedRequest).user_id;
        const response = await controller.editar(req.params.id, req.body, userId);
        return response.send(res);
    })
    .delete('/:id', authMiddleware, async (req, res) => {
        // Validar se o ID é um ObjectId válido
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                erro: true,
                code: 400,
                mensagem: 'ID inválido. Deve ser um ObjectId válido do MongoDB.',
                data: null,
                erros: []
            });
        }

        const userId = (req as AuthenticatedRequest).user_id;
        const response = await controller.deletar(req.params.id, userId);
        return response.send(res);
    })

export default router;