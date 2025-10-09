import express from 'express';
import ControladorAuth from '../controller/controllerAuth.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const roteador = express.Router();
const controlador = new ControladorAuth();

// Rotas de autenticação - versão simplificada
roteador
  .post('/login', controlador.login.bind(controlador))
  .post('/logout', authMiddleware, controlador.logout.bind(controlador))
  .post('/recover', controlador.recover.bind(controlador))

export default roteador;