var test = require('tape')

var standardizer = require('../standardizer')

test('standardizer version', function (t) {
  standardizer.version(function (err, versions) {
    t.error(err, 'no error')

    t.equals(versions, 'standardizer@1.2.0, standard-format@2.2.3, standard@8.0.0, eslint@3.4.0, eslint-config-standard@6.0.0-beta.3, eslint-config-standard-jsx@3.0.0, eslint-plugin-promise@2.0.1, eslint-plugin-react@6.2.0, eslint-plugin-standard@2.0.0, standard-engine@5.1.0', 'correct version returned')

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
