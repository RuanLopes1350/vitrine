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
            console.error('Erro ao cadastrar usuário:', erro);
            res.status(500).json({ error: erro.message });
        }
    })
    // Rota para listar todos os usuários
    .get('/usuarios', async (req, res) => {
        try {
            const usuarios = await controller.listar();
            res.status(200).json(usuarios);
        } catch (erro) {
            console.error('Erro ao listar usuários:', erro);
            res.status(500).json({ error: erro.message });
        }
    })

export default router;