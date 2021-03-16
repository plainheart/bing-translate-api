const { translate } = require('../src/index')

function printRes(res) {
  console.log(res.text, '----->', res.translation, 'fromLang', res.language.from)
  console.log()
}

function printCorrectRes(res) {
  console.log(res.text, '----->', res.correctedText)
  console.log()
}

// default: auto-detect(zh-Hans) -> en
translate('你好').then(printRes)

// auto-detect(English) to zh-Hans
translate('Hello', null, 'zh-Hans').then(printRes)

// auto-detect(Korean) to zh-Hant
translate('안녕하십니까', null, 'zh-Hant').then(printRes)

// correct `gradent`` to `gradient`
translate('gradent', null, 'en', true).then(printCorrectRes)

// correct short text to `this text is very long`
translate('this text is very lang', null, 'en', true)
.then(printCorrectRes)

// correct short text -> return `undefined` for the language is not supported
translate('Bore da', null, 'en', true)
.then(printCorrectRes)

// correct long text -> return `undefined` for exceeding max length
translate('this text is very long this text is very long this text is very long this text is very long this text is very long this text is very long ', null, 'en', true)
.then(printCorrectRes)
