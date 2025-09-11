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
    })
    .get('/produtos/:id', async (req, res) => {
        try {
            const produto = await controller.buscarPorId(req.params.id);
            res.status(200).json(produto);
        } catch (erro) {
            res.status(500).json({ error: erro.message });
        }
    })
    .patch('/produtos/:id', async (req, res) => {
        try {
            const produto = await controller.editar(req.params.id, req.body);
            res.status(200).json(produto);
        } catch (erro) {
            res.status(500).json({ error: erro.message });
        }
    })
    .delete('/produtos/:id', async (req, res) => {
        try {
            const produtos = await controller.deletar(req.params.id);
            res.status(200).json(produtos);
        } catch (erro) {
            res.status(500).json({ error: erro.message })
        }
    })

export default router;