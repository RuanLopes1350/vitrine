import express from 'express';
import * as dotenv from 'dotenv';
import routesUsuario from './routes/routesUsuario'

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({message: 'Hello, World!'});
});

app.use(routesUsuario)

app.use((req, res) => {
  return res.status(404).json({message: 'Rota não encontrada!'})
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});