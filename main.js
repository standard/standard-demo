var ace = require('brace')
var eslint = require('./eslint/lib/eslint.js')
var standardCfg = require('eslint-config-standard')
var standardFormat = require('standard-format')
var reactCfg = require('eslint-config-standard-react')
var extend = require('xtend')
require('brace/mode/javascript')
require('brace/theme/monokai')

var config = extend({}, standardCfg)
// add react rules
config.ecmaFeatures = extend(config.ecmaFeatures, reactCfg.ecmaFeatures)
config.rules = extend(config.rules, reactCfg.rules)

var editor = ace.edit('javascript-editor')
editor.getSession().setMode('ace/mode/javascript')
editor.setTheme('ace/theme/monokai')
editor.session.setUseWorker(false)
editor.setValue([
  'var foo = "hello";',
  'console.log(foo);',
  ''
].join('\n'))

var h = require('virtual-dom/h')
var main = require('main-loop')
var loop = main({messages: []}, render, require('virtual-dom'))
document.querySelector('#messages').appendChild(loop.target)

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
  if (!state.messages) return h('div')

  var renderedMessages = state.messages.map(function (m) {
    var formattedMessage = m.line + ':' + m.column + ' - ' + m.message + ' (' + m.ruleId + ')'
    return h('div', {className: 'message'}, formattedMessage)
  })
  return renderedMessages
}

editor.getSession().on('change', doStuff)

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
