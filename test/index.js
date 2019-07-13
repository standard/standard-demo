var test = require('tape')

var standardizer = require('../standardizer')

test('standardizer version', function (t) {
  standardizer.version(function (err, versions) {
    t.error(err, 'no error')
    t.equals(versions, 'standardizer@3.0.0, standard@13.0.2, eslint@6.0.1, eslint-config-standard@13.0.1, eslint-config-standard-jsx@7.0.0, eslint-plugin-import@2.18.0, eslint-plugin-node@9.1.0, eslint-plugin-promise@4.2.1, eslint-plugin-react@7.14.2, eslint-plugin-standard@4.0.0, standard-engine@11.0.1', 'correct version returned')
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
