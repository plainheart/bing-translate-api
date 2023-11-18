const fs = require('node:fs')
const path = require('node:path')
const config = require('../src/config')

// generate README from template
let readmeTpl = fs.readFileSync(path.resolve(__dirname, './README.tpl.md'), 'utf-8')
Object.entries(config).forEach(([key, value]) => {
  readmeTpl = readmeTpl.replace(`{{${key}}}`, value)
})

fs.writeFileSync(
  path.resolve(__dirname, '../README.md'),
  '<!-- AUTO-GENERATED. SEE scripts/README.tpl.md FOR ORIGINAL TEMPLATE -->\n\n'
    + readmeTpl,
  { charset: 'utf-8' }
)

console.log('✔️ Generated README.md from template')
