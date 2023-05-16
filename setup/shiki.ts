import { defineShikiSetup } from '@slidev/types'
import shiki, {Lang, ILanguageRegistration} from "shiki"
import { readFileSync } from 'fs'

export default defineShikiSetup(async () => {
  const promelaGrammar = JSON.parse(readFileSync('./promela.tmLanguage.json', 'utf-8'))
  const shellGrammar = JSON.parse(readFileSync('./shellscript.tmLanguage.json', 'utf-8'))
  const promelaLanguage: ILanguageRegistration = {
    id: 'promela',
    scopeName: 'source.promela',
    grammar: promelaGrammar,
    aliases: ['promela', 'spin'],
    path: './promela.tmLanguage.json'
  }
  const shellLanguage: ILanguageRegistration = {
    id: 'shellscript',
    scopeName: 'source.shell',
    grammar: shellGrammar,
    aliases: ['shellscript', 'shell', 'bash', 'sh'],
    path: './shellscript.tmLanguage.json'
  }
  return {
    theme: {
      dark: 'min-dark',
      light: 'nord',
    },
    langs: [
      promelaLanguage,
      shellLanguage
    ],
  }
})