// backend/api/index.ts

import express from 'express';
import * as dotenv from 'dotenv';
import DbConnect from '../config/DbConnect';
import routesUsuario from '../routes/routesUsuario';
import routesProduto from '../routes/routesProduto';
import routesAuth from '../routes/routesAuth';
import { ErrorHandlerMiddleware } from '../utils/middlewares/errorHandler';
import cors from 'cors';

dotenv.config();

const app = express();

// Conectar ao banco de dados
DbConnect.conectar();

app.use(express.json());
app.use(cors()); // Simplifique o CORS para o deploy inicial

// Rotas
app.use(routesUsuario);
app.use(routesProduto);
app.use(routesAuth);

// Middleware de tratamento de erros
app.use(ErrorHandlerMiddleware.handle);

// Exporta o app para a Vercel
export default app;