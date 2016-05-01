var test = require('tape')

var standardizer = require('../standardizer')

test('standardizer version', function (t) {
  standardizer.version(function (err, versions) {
    t.error(err, 'no error')

    t.equals(versions, 'version@1.0.0, standard@6.0.8, standard-format@2.1.1', 'correct version returned')

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

test('standardizer format', function (t) {
  standardizer.format("console.log('woot');\n", function (err, result) {
    t.error(err, 'no error')

    t.equals(result, "console.log(\'woot\')\n", 'formatted text')
    t.end()
  })
})
