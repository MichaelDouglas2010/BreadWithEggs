// server.ts
import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Importar rotas
import router from './routes/index';

const app: Application = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Conectar ao MongoDB local
mongoose.connect('mongodb://localhost:27017/mydatabase')
  .then(() => {
  console.log('Conectado ao MongoDB');
})
.catch((err: Error) => {
  console.error('Erro ao conectar ao MongoDB', err);
});

// Usar as rotas de itens
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('API está funcionando');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
