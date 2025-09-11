import express from 'express';
import ControllerUsuario from '../controller/controllerUsuario';

const router = express.Router();
const controller = new ControllerUsuario();

router
    // Rota para cadastrar um novo usuário
    .post('/usuarios', async (req, res) => {
        try {
            const usuario = await controller.cadastrar(req.body);
            res.status(201).json(usuario);
        } catch (erro) {
            console.error('[Endpoint] Erro ao cadastrar usuário:', erro);
            res.status(500).json({ error: erro.message });
        }
    })
    // Rota para listar todos os usuários
    .get('/usuarios', async (req, res) => {
        try {
            const usuarios = await controller.listar();
            res.status(200).json(usuarios);
        } catch (erro) {
            console.error('[Endpoint] Erro ao listar usuários:', erro);
            res.status(500).json({ error: erro.message });
        }
    })
    .get('/usuarios/:id', async (req, res) => {
        try {
            const usuario = await controller.buscarPorId(req.params.id)
            res.status(200).json(usuario)
        } catch (erro) {
            console.error('[Endpoint] Erro ao buscar usuario por id:', erro)
            res.status(500).json({error: erro.message})
        }
    })
    .patch('/usuarios/:id', async (req, res) => {
        try {
            const usuarioAtualziado = await controller.atualizar(req.params.id, req.body)
            res.status(200).json(usuarioAtualziado);
        } catch (erro) {
            console.error('[Endpoint] Erro ao atualizar usuario por id:', erro)
            res.status(500).json({error: erro.message})
        }
    })
    .delete('/usuarios/:id', async (req, res) => {
        try {
            await controller.deletar(req.params.id)
            res.status(200).json({message: `Usuario ${req.params.id} deletado com sucesso!`})
        } catch (erro) {
            console.error('[Endpoint] Erro ao buscar usuario por id:', erro)
            res.status(500).json({error: erro.message})
        }
    })

export default router;