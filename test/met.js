const { MET } = require('../src/index')

;(async () => {
  console.log()
  console.log('Testing MET mode...')

  const res = await MET.translate(['Hello World!', 'Hi, Java!'], null, 'Chinese (Literary)')
  console.log(JSON.stringify(res, null, 2))

  const res2 = await MET.translate(`<div class="notranslate">This will not be translated.</div><div>This will be translated.</div>`, null, 'zh-Hans', {
    translateOptions: {
      textType: 'html'
    }
  })
  console.log(JSON.stringify(res2, null, 2))
})()
