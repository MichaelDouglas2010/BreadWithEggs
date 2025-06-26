import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../server'
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export default class UserController {

  static async getUser(req: Request, res: Response) {
    try {
      const database = await connectToDatabase()
      const collection = database.collection('users')
      const users = await collection.find({}).toArray()
      res.status(200).json(users)
    } catch (error) {
      console.error('Erro ao buscar dados da coleção users:', error)
      res.status(500).json({ error: 'Erro ao buscar dados da coleção users' })
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const database = await connectToDatabase()
      const collection = database.collection('users')
      const user = await collection.findOne({ _id: new ObjectId(id) })
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ error: 'Usuário não encontrado' })
      }
    } catch (error) {
      console.error('Erro ao buscar dados da coleção users:', error)
      res.status(500).json({ error: 'Erro ao buscar dados da coleção users' })
    }
  }

  static async getUserByEmail(req: Request, res: Response) {
    try {
      const { em } = req.params
      const database = await connectToDatabase()
      const collection = database.collection('users')
      const user = await collection.findOne({ email: em })
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ error: 'Usuário não encontrado' })
      }
    } catch (error) {
      console.error('Erro ao buscar dados da coleção users:', error)
      res.status(500).json({ error: 'Erro ao buscar dados da coleção users' })
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, email, password, team } = req.body

      const updatedData = {
        name,
        email,
        password,
        team
      }

      const database = await connectToDatabase()
      const collection = database.collection('users')
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      )

      if (result.matchedCount > 0) {
        res.status(200).json({ message: 'Usuário atualizado com sucesso' })
      } else {
        res.status(404).json({ error: 'Usuário não encontrado' })
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      res.status(500).json({ error: 'Erro ao atualizar usuário' })
    }
  }

  static async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const database = await connectToDatabase();
      const usersCollection = database.collection('users');
      const user = await usersCollection.findOne({ email });

      // Se o utilizador não for encontrado, retorna um erro de não autorizado
      if (!user) {
        return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
      }

      // Compara a senha enviada com o hash armazenado no banco
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
      }

      // Login bem-sucedido. Retorna os dados do utilizador (sem a senha!)
      // Num app real, aqui você geraria um token JWT para o frontend.
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json({ message: 'Login bem-sucedido', user: userWithoutPassword });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro no servidor durante o login.' });
    }
  }

  static async removeUser(req: Request, res: Response) {
    try {
      const { id } = req.params

      const database = await connectToDatabase()
      const collection = database.collection('users')
      const result = await collection.deleteOne({ _id: new ObjectId(id) })

      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Usuário removido com sucesso' })
      } else {
        res.status(404).json({ error: 'Usuário não encontrado' })
      }
    } catch (error) {
      console.error('Erro ao remover usuário:', error)
      res.status(500).json({ error: 'Erro ao remover usuário' })
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { name, email, password, team } = req.body;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = {
        name,
        email,
        password: hashedPassword, // Armazena a senha com hash
        team,
        createdAt: new Date()
      };

      const database = await connectToDatabase();
      const collection = database.collection('users');
      const result = await collection.insertOne(newUser);

      res.status(201).json({ message: 'Utilizador criado com sucesso', userId: result.insertedId });
    } catch (error) {
      console.error('Erro ao criar novo utilizador:', error);
      res.status(500).json({ error: 'Erro ao criar novo utilizador' });
    }
  }

  static async requestPasswordReset(req: Request, res: Response) {
    try {
        const { email } = req.body;
        const database = await connectToDatabase();
        const usersCollection = database.collection('users');
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Nenhum utilizador encontrado com este e-mail.' });
        }

        // Gera um token seguro e aleatório
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 3600000); // Token expira em 1 hora

        const passwordResetTokensCollection = database.collection('passwordResetTokens');
        await passwordResetTokensCollection.insertOne({
            userId: user._id,
            token: resetToken,
            expiresAt: tokenExpiry
        });
        
        // --- SIMULAÇÃO DE ENVIO DE E-MAIL ---
        // Num aplicativo real, aqui você usaria o 'nodemailer' para enviar o e-mail.
        console.log('================================================');
        console.log('SIMULAÇÃO DE RECUPERAÇÃO DE SENHA');
        console.log(`Token gerado para ${email}:`);
        console.log(resetToken);
        console.log('Copie este token e cole no aplicativo.');
        console.log('================================================');

        res.status(200).json({ message: 'Se o e-mail existir, um link de redefinição foi enviado.' });

    } catch (error) {
        console.error('Erro ao solicitar redefinição de senha:', error);
        res.status(500).json({ error: 'Erro no servidor ao solicitar redefinição.' });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
        const { token, newPassword } = req.body;
        const database = await connectToDatabase();
        const tokensCollection = database.collection('passwordResetTokens');
        
        // Encontra o token e verifica se ele não expirou
        const resetTokenDoc = await tokensCollection.findOne({ 
            token: token, 
            expiresAt: { $gt: new Date() } 
        });

        if (!resetTokenDoc) {
            return res.status(400).json({ error: 'Token inválido ou expirado.' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const usersCollection = database.collection('users');
        await usersCollection.updateOne(
            { _id: resetTokenDoc.userId },
            { $set: { password: hashedPassword } }
        );

        // Apaga o token para que ele não possa ser reutilizado
        await tokensCollection.deleteOne({ _id: resetTokenDoc._id });

        res.status(200).json({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).json({ error: 'Erro no servidor ao redefinir a senha.' });
    }
  }
}