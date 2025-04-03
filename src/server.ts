import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';
import { Db, MongoClient, ServerApiVersion } from 'mongodb';

const app = express();
const port = 3000;

// Conexão com MongoDB
const uri = "mongodb+srv://teste:teste@pao-com-ovo.kiubl.mongodb.net/?retryWrites=true&w=majority&appName=pao-com-ovo";
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

let dbInstance: Db | null = null;

export async function connectToDatabase() {
  if (dbInstance) return dbInstance;
  
  try {
    await client.connect();
    dbInstance = client.db("pao_com_ovo");
    console.log("✅ Conectado ao MongoDB!");
    return dbInstance;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    throw error;
  }
}

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(routes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Iniciar servidor apenas após conectar ao MongoDB
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
    console.log(`📄 Swagger disponível em http://localhost:${port}/api-docs`);
  });
}).catch(error => {
  console.error('❌ Servidor não iniciado por erro no MongoDB:', error);
});
