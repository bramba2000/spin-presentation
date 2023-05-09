import { defineShikiSetup } from '@slidev/types'
import shiki from "shiki"
import { readFileSync } from 'fs'

const myLanguageGrammar = JSON.parse(readFileSync('./promela.tmLanguage.json', 'utf-8'))

export default defineShikiSetup(() => {
  return {
    theme: {
      dark: 'min-dark',
      light: 'nord',
    },
    langs: [{
      id: 'promela',
      scopeName: 'source.promela',
      grammar: myLanguageGrammar,
      aliases: ['promela', 'spin'],
      path: 'promela.tmLanguage.json',
    }
    ],
  }
})