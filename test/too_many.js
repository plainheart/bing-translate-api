const { translate } = require('../src/index')

function printRes(res) {
  console.log(res.text, '----->', res.translation, 'fromLang', res.language.from)
  console.log()
}

function onErr(e, notExit) {
  console.error(e)
  notExit || process.exit(1)
}

// too many requests
const promises = []
for (const index of Array(500).keys()) {
  promises.push(
    translate((Math.random() + 1).toString(36).substring(7), null, 'en', false, false, undefined, undefined, true)
  )
}
Promise.all(promises)
.then((items) => {
  items.forEach(printRes)
})
.catch(onErr)
