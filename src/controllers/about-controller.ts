import { Request, Response } from 'express'
import aboutContent from "../../about";

export default class AboutController {
    static async getAbout(req: Request, res: Response){
        //about = README
        try{
            const about = aboutContent()
            res.status(200).json(about)
        }
        catch(error) {
            console.error('Erro ao buscar dados de About:', error)
            res.status(500).json({ error: 'Erro ao buscar dados de About' })
          }
    }

}
