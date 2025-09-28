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
const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.use('/usuarios', routesUsuario);
apiRouter.use('/produtos', routesProduto);
apiRouter.use('/', routesAuth);

app.use((req, res) => {
  return res.status(404).json({ message: 'Rota não encontrada!' })
})

app.get('/', (req, res) => {
  console.log('Requisição para rota raiz');
  res.json({ message: 'Hello, World!' });
});

// Middleware de tratamento de erros
app.use(ErrorHandlerMiddleware.handle);

// Exporta o app para a Vercel
export default app;