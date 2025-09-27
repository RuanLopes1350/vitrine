import express from 'express';
import * as dotenv from 'dotenv';
import DbConnect from './config/DbConnect';
import routesUsuario from './routes/routesUsuario'
import routesProduto from './routes/routesProduto'
import routesAuth from './routes/routesAuth'
import { ErrorHandlerMiddleware } from './utils/middlewares/errorHandler';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// Log simples das requisições
app.use((req, res, next) => {
  console.log('--- Nova Requisição ---');
  console.log(`- Origem: ${req.ip} \n- User-Agent: ${req.headers['user-agent']} \n${req.hostname ? `- Hostname: ${req.hostname}` : ''}`);
  console.log(`Requisição para: ${req.method} ${req.path}`);

  next();
});


app.use(express.json());
app.use(cors({
  origin: true, // Aceita qualquer origem (só para teste!)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
// app.use(cors({ 
//   origin: process.env.FRONTEND_URL, // Permitir apenas o frontend
//   credentials: true, // Permitir cookies/credentials
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }))

app.get('/', (req, res) => {
  console.log('Requisição para rota raiz');
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
    console.log('Configurações do CORS:');
    console.log(`- Origem: ${process.env.FRONTEND_URL}`);
    console.log(`- Credenciais: ${true}`);
    console.log(`- Métodos: ${['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']}`);
    console.log(`- Headers Permitidos: ${['Content-Type', 'Authorization']}`);
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