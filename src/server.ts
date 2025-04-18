import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes'

const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb')

const app = express()
const port = 3000

const uri = "mongodb+srv://Dysdale:eunaosei123@pao-com-ovo.kiubl.mongodb.net/?retryWrites=true&w=majority&appName=pao-com"
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

export async function connectToDatabase() {
  try {
    await client.connect()
    return client.db("pao_com_ovo")
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error)
    throw error
  }
}

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(routes)


app.listen(port, () => {
  console.log(`Servidor Express rodando em http://localhost:${port}`)
})
