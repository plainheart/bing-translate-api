const fs = require('node:fs')
const path = require('node:path')
const { LANGS } = require('../src/lang')
const { LANGS: MET_LANGS } = require('../src/met/lang')

// update ts definition
const typingsTpl = fs.readFileSync(path.resolve(__dirname, './index.tpl.d.ts'), 'utf-8')
fs.writeFileSync(
  path.resolve(__dirname, '../index.d.ts'),
  '// AUTO-GENERATED. SEE scripts/index.tpl.d.ts FOR ORIGINAL TYPINGS\n\n' +
  typingsTpl.replace(
    '__LANG_MAP__',
    JSON.stringify(LANGS, null, 4)
      .replace('}', `${' '.repeat(2)}}`)
      .replace(/"/g, '\'')
  ).replace(
    '__LANG_MAP__',
    JSON.stringify(MET_LANGS, null, 6)
      .replace('}', `${' '.repeat(4)}}`)
      .replace(/"/g, '\'')
  ),
  { charset: 'utf-8' }
)

console.log('✔️ Generated dts from template')
