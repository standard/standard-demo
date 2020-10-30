const test = require('tape')

const standardizer = require('../standardizer')

test('standardizer version', function (t) {
  standardizer.version(function (err, versions) {
    t.error(err, 'no error')
    t.equal(typeof versions, 'string', 'versions is a string')
    t.end()
  })
})

test('standardizer lint', function (t) {
  standardizer.lint("console.log('woot');\n", function (err, result) {
    t.error(err, 'no error')
    t.equals(result.length, 1, 'one lint problem found in result')
    t.end()
  })
})

test('standardizer fix', function (t) {
  standardizer.fix("console.log('woot');\n", function (err, result) {
    t.error(err, 'no error')
    t.equals(result, "console.log('woot')\n", 'formatted text')
    t.end()
  })
})
