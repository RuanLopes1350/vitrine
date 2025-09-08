import express from 'express';
import ControllerUsuario from '../controller/controllerUsuario';

const router = express.Router();
const controller = new ControllerUsuario();

router
    .post('/usuarios', async (req, res) => {
        const usuario = await controller.cadastrar(req.body);
        res.status(201).json(usuario);
    })
    .get('/usuarios', async (req, res) => {
        const usuarios = await controller.listar();
        res.status(200).json(usuarios);
    })

export default router;