import { defineShikiSetup } from '@slidev/types'
import shiki from "shiki"
import { readFileSync } from 'fs'

const myLanguageGrammar = JSON.parse(readFileSync('./promela.tmLanguage.json', 'utf-8'))
const myLanguage = {
  id: 'promela',
  scopeName: 'source.promela',
  grammar: myLanguageGrammar,
  aliases: ['promela', 'spin'],
  path: 'promela.tmLanguage.json',
}


export default defineShikiSetup(async () => {
  const highlighter = await shiki.getHighlighter({})
  highlighter.loadLanguage(myLanguage)
  return {
    theme: {
      dark: 'min-dark',
      light: 'nord',
    },
    highlighter: highlighter
  }
})