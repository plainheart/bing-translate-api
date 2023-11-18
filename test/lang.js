const { lang } = require('../src/index')

console.log('en supported:', lang.isSupported('en'))
console.log('en1 supported:', lang.isSupported('en1'))
console.log('Korean language code:', lang.getLangCode('Korean'))
