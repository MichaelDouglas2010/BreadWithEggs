import { readFileSync } from 'fs'
import { join } from 'path'

export default function aboutContent(): { [key: string]: string } {

    const caminhoReadme = join(__dirname, 'README.md')
    const conteudo = readFileSync(caminhoReadme, 'utf-8')
    const linhas = conteudo.replace(/\r/g, '').split('\n')

    const objetoLinhas: { [key: string]: string } = {}

    linhas.forEach((linha, index) => {
        objetoLinhas[index + 1] = linha
    })

    return objetoLinhas
}

