var ace = require('brace')
var eslint = require('./eslint/lib/eslint.js')
var extend = require('xtend')
var h = require('virtual-dom/h')
var main = require('main-loop')
var reactCfg = require('eslint-config-standard-react')
var standardCfg = require('eslint-config-standard')
var standardFormat = require('standard-format')
var deps = require('./versions.json').dependencies
var eslintPackageJson = require('./eslint/package.json')

// capture just "standard" versions
var stdDeps = Object.keys(deps).filter(function (d) {
  return d !== 'standard' && d.indexOf('standard') > -1
})
.map(function (d) {
  return d + '@' + deps[d].version
})

// also include eslint version
stdDeps.unshift('eslint@' + eslintPackageJson.version)

require('brace/mode/javascript')
require('brace/theme/monokai')
var editor = ace.edit('javascript-editor')
editor.getSession().setMode('ace/mode/javascript')
editor.setTheme('ace/theme/monokai')
editor.session.setUseWorker(false)
editor.setValue([
  'var foo = "hello";',
  'console.log(foo);',
  ''
].join('\n'))
editor.getSession().on('change', doStuff)

var config = extend({}, standardCfg)
// add react rules
config.ecmaFeatures = extend(config.ecmaFeatures, reactCfg.ecmaFeatures)
config.rules = extend(config.rules, reactCfg.rules)

var loop = main({messages: []}, render, require('virtual-dom'))
document.querySelector('#messages').appendChild(loop.target)

document.querySelector('#versioninfo').innerText = stdDeps.join(' ')

function render (state) {
  return h('div', [renderFormatButton(), renderMessages(state)])
}

function renderFormatButton () {
  return h('button', {onclick: formatCode}, 'Format Code')
}

function formatCode () {
  editor.setValue(standardFormat.transform(editor.getValue()))
}

function renderMessages (state) {
  if (state.messages.length < 1) return h('div', {className: 'success message'}, 'JavaScript Standard Style')

  var renderedMessages = state.messages.map(function (m) {
    var formattedMessage = m.line + ':' + m.column + ' - ' + m.message + ' (' + m.ruleId + ')'
    return h('div', {className: 'message'}, formattedMessage)
  })
  return renderedMessages
}

function doStuff () {
  var messages = eslint.verify(editor.getValue(), config)

  var annotations = []
  messages.forEach(function (message) {
    annotations.push(
      {
        row: message.line - 1, // must be 0 based
        column: message.column - 1,  // must be 0 based
        text: message.message,  // text to show in tooltip
        type: 'error'
      }
    )
  })

  editor.session.setAnnotations(annotations)
  loop.update({messages: messages})
}

doStuff()
