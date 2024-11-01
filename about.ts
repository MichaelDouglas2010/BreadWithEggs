import { readFileSync } from 'fs'
import { join } from 'path'

interface IAbout {
    id: number
    line: string
}

export default function aboutContent(): IAbout[] { 
    const caminhoReadme = join(__dirname, 'README.md')
    const conteudo = readFileSync(caminhoReadme, 'utf-8')
    const linhas = conteudo.replace(/\r/g, '').split('\n')

    const objetoLinhas: IAbout[] = linhas.map((linha, index) => ({
        id: index + 1,  
        line: linha     
    }))

    return objetoLinhas
}
