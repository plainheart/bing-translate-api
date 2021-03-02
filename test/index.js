const { translate } = require('../src/index')

function printRes(res) {
  return console.log(res.text, '----->', res.translation, 'fromLang', res.language.from)
}

// default: auto-detect(zh-Hans) -> en
translate('你好').then(printRes)

// auto-detect(English) to zh-Hans
translate('Hello', null, 'zh-Hans').then(printRes)

// auto-detect(Korean) to zh-Hant
translate('안녕하십니까', null, 'zh-Hant').then(printRes)
