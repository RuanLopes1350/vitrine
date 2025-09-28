// backend/api/index.ts

import express from 'express';
import * as dotenv from 'dotenv';
import DbConnect from '../config/DbConnect.js';
import routesUsuario from '../routes/routesUsuario.js';
import routesProduto from '../routes/routesProduto.js';
import routesAuth from '../routes/routesAuth.js';
import { ErrorHandlerMiddleware } from '../utils/middlewares/errorHandler.js';
import cors from 'cors';

dotenv.config();

const app = express();

// Conectar ao banco de dados
DbConnect.conectar();

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Rotas
app.use(routesUsuario);
app.use(routesProduto);
app.use(routesAuth);

// Middleware de tratamento de erros
app.use(ErrorHandlerMiddleware.handle);

// Exporta o app para a Vercel
export default app;