import express from 'express';
import ControllerProduto from '../controller/controllerProduto.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const controller = new ControllerProduto();

router
    .post('/produtos', authMiddleware, async (req, res) => {
        const response = await controller.cadastrar(req.body);
        return response.send(res);
    })
    // .get('/produtos', async (req, res) => {
    //     const response = await controller.listar();
    //     return response.send(res);
    // })
    .get('/produtos/:id', async (req, res) => {
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
    .patch('/produtos/:id', authMiddleware, async (req, res) => {
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

        const response = await controller.editar(req.params.id, req.body);
        return response.send(res);
    })
    .delete('/produtos/:id', authMiddleware, async (req, res) => {
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

        const response = await controller.deletar(req.params.id);
        return response.send(res);
    })

export default router;