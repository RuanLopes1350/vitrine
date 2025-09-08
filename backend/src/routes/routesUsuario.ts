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
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    })
    // Rota para listar todos os usuários
    .get('/usuarios', async (req, res) => {
        try {
            const usuarios = await controller.listar();
            res.status(200).json(usuarios);
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    })

export default router;