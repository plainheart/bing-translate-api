const { translate } = require('../src/index')

function printRes(res) {
  console.log(res.text, '----->', res.translation, 'fromLang', res.language.from)
  console.log()
}

function printCorrectRes(res) {
  console.log(res.text, '----->', res.correctedText)
  console.log()
}

function onErr(e, notExit) {
  console.error(e)
  notExit || process.exit(1)
}

// default: auto-detect(zh-Hans) -> en
translate('你好')
.then(printRes)
.catch(onErr)

// auto-detect(English) to zh-Hans
translate('Hello', null, 'zh-Hans')
.then(printRes)
.catch(onErr)

// auto-detect(Korean) to zh-Hant
translate('안녕하십니까', null, 'zh-Hant')
.then(printRes)
.catch(onErr)

// correct `gradent`` to `gradient`
translate('gradent', null, 'en', true)
.then(printCorrectRes)
.catch(onErr)

// correct short text to `this text is very long`
translate('this text is very lang', null, 'en', true)
.then(printCorrectRes)
.catch(onErr)

// correct short text -> return `undefined` for the language is not supported
translate('Bore da', null, 'en', true)
.then(printCorrectRes)
.catch(onErr)

// correct long text -> return `undefined` for exceeding max length
translate('this text is very long this text is very long this text is very long this text is very long this text is very long this text is very long ', null, 'en', true)
.then(printCorrectRes)
.catch(onErr)

// max text len -> return `undefined` for exceeding max length
translate((() => {
  let text = ''
  while (text.length < 1001) {
    text += ~~(Math.random() * 10) + ''
  }
  return text
})(), null, 'en')
.then(printRes)
.catch(e => onErr(e, true))
