import express from 'express';
import * as dotenv from 'dotenv';
import DbConnect from './config/DbConnect';
import routesUsuario from './routes/routesUsuario'
import routesProduto from './routes/routesProduto'
import routesAuth from './routes/routesAuth'
import { ErrorHandlerMiddleware } from './utils/middlewares/errorHandler';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Rotas de usuário
app.use(routesUsuario);

// Rotas de produtos
app.use(routesProduto);

// Rotas de Auth
app.use(routesAuth);

// Rota para tratar requisições para rotas não definidas
app.use((req, res) => {
  return res.status(404).json({ message: 'Rota não encontrada!' })
})

// Middleware de tratamento de erros
app.use(ErrorHandlerMiddleware.handle);

async function startServer() {
  try {
    await DbConnect.conectar();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();