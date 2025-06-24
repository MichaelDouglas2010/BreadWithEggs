import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion, Db } from 'mongodb'; 
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import mainRoutes from './routes'; 

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('A variável de ambiente MONGODB_URI não foi definida no arquivo .env');
}

const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbInstance: Db;

// Função para conectar ao banco de dados, exportada para ser usada nos controllers
export const connectToDatabase = async (): Promise<Db> => {
  if (dbInstance) {
    return dbInstance;
  }
  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB!');
    dbInstance = client.db('pao_com_ovo'); // Nome do seu banco de dados
    return dbInstance;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    throw error;
  }
};


// Função principal para iniciar o servidor
const startServer = async () => {
  // Garante que a conexão com o banco de dados seja estabelecida primeiro
  await connectToDatabase();

  const app: Express = express();
  const PORT = process.env.PORT || 3000;

  // --- Middlewares ---
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // --- Documentação da API (Swagger) ---
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Pão com Ovo',
        version: '1.0.0',
        description: 'Documentação da API para o sistema de gerenciamento de equipamentos.',
      },
      servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ['./src/routes/*.ts'], // Verifique se o caminho para suas rotas está correto
  };
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


  // --- Rotas Principais ---
  app.use('/', mainRoutes);


  // --- Inicia o Servidor ---
  app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    console.log(`📄 Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
  });
};

// Executa a função principal e trata possíveis erros na inicialização
startServer().catch(error => {
  console.error('❌ Falha ao iniciar o servidor:', error);
  process.exit(1);
});
