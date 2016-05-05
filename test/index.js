var test = require('tape')

var standardizer = require('../standardizer')

test('standardizer version', function (t) {
  standardizer.version(function (err, versions) {
    t.error(err, 'no error')

    t.equals(versions, 'standardizer@1.1.1, standard-format@2.1.1, standard@7.0.1, eslint@2.9.0, eslint-config-standard@5.3.1, eslint-config-standard-jsx@1.2.0, eslint-plugin-promise@1.1.0, eslint-plugin-react@5.0.1, eslint-plugin-standard@1.3.2, standard-engine@4.0.1', 'correct version returned')

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
