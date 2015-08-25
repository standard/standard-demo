var eslint = require('./eslint/lib/eslint.js')
var config = require('eslint-config-standard')
var ace = require('brace')
require('brace/mode/javascript')
require('brace/theme/monokai')

// remap custom rules
config.rules['object-curly-even-spacing'] = config.rules['standard/object-curly-even-spacing']
config.rules['array-bracket-even-spacing'] = config.rules['standard/array-bracket-even-spacing']
config.rules['computed-property-even-spacing'] = config.rules['standard/computed-property-even-spacing']
delete config.rules['standard/object-curly-even-spacing']
delete config.rules['standard/array-bracket-even-spacing']
delete config.rules['standard/computed-property-even-spacing']

var editor = ace.edit('javascript-editor')
editor.getSession().setMode('ace/mode/javascript')
editor.setTheme('ace/theme/monokai')
editor.session.setUseWorker(false)
editor.setValue('var foo = ["" ]')

var h = require('virtual-dom/h')
var main = require('main-loop')
var loop = main({ n: 0 }, render, require('virtual-dom'))
document.querySelector('#messages').appendChild(loop.target)

function render (state) {
  if (!state.messages) return h('div')

  var renderedMessages = state.messages.map(function (m) {
    var formattedMessage = m.line + ':' + m.column + ' - ' + m.message + ' (' + m.ruleId + ')'
    return h('div', {className: 'message'}, formattedMessage)
  })

  return h('div', renderedMessages)
}

editor.getSession().on('change', doStuff)

function doStuff () {
  var messages = eslint.verify(editor.getValue(), config)

  var annotations = []
  messages.forEach(function (message) {
    console.log(message)
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
