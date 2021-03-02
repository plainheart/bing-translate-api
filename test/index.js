const { translate } = require('../src/index')

// default: auto-detect(zh-Hans) -> en
translate('你好')
  .then(res => console.log('你好 ----->', res[0].translations[0].text))

// auto-detect(English) to zh-Hans
translate('Hello', null, 'zh-Hans')
  .then(res => console.log('Hello ----->', res[0].translations[0].text))

// auto-detect(Korean) to zh-Hant
translate('안녕하십니까', null, 'zh-Hant')
  .then(res => console.log('안녕하십니까 ----->', res[0].translations[0].text))
