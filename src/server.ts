import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const port = 3000;

// String de conexão direta com o MongoDB
const uri = 'mongodb+srv://Dysdale:eunaosei123@pao-com-ovo.kiubl.mongodb.net/?retryWrites=true&w=majority&appName=pao-com';

// Instanciando o cliente MongoDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Função para conectar diretamente ao banco de dados
export async function connectToDatabase() {
  try {
    await client.connect(); // Conectando ao MongoDB
    console.log('✅ Conectado ao MongoDB!');
    return client.db('pao_com_ovo'); // Retorna o banco de dados
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    throw error;
  }
}

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Pão com Ovo',
      version: '1.0.0',
      description: 'Documentação da API Pão com Ovo',
    },
    servers: [
      {
       url: `http://localhost:${port}`,
       // url: `http://192.168.18.5:${port}`, // Substitua pelo seu IP real
      },
    ],
  },
  apis: ['./routes/*.ts'], // Caminho para os arquivos de rota
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Use apenas o bodyParser
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(routes);

// Iniciar o servidor após verificar a conexão com o MongoDB
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${port}`);
      console.log(`📄 Swagger disponível em http://localhost:${port}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('❌ Falha ao iniciar o servidor devido a erro na conexão com o MongoDB:', error);
    process.exit(1); // Encerra o processo com código de erro
  });
