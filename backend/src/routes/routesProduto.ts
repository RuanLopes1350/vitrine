import express from 'express';
import ControllerProduto from '../controller/controllerProduto';

const router = express.Router();
const controller = new ControllerProduto();

router
    .post('/produtos', async (req, res) => {
        try {
            const produto = await controller.cadastrar(req.body);
            res.status(201).json(produto);
        } catch (erro) {
            res.status(500).json({ error: erro.message });
        }
    })
    .get('/produtos', async (req, res) => {
        try {
            const produtos = await controller.listar();
            res.status(200).json(produtos);
        } catch (erro) {
            res.status(500).json({ error: erro.message });
        }
    });

export default router;