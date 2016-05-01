var ace = require('brace')
var h = require('virtual-dom/h')
var main = require('main-loop')

var standardizer = require('./standardizer')

require('brace/mode/javascript')
require('brace/theme/monokai')
var editor = ace.edit('javascript-editor')
editor.$blockScrolling = Infinity

editor.getSession().setMode('ace/mode/javascript')
editor.setTheme('ace/theme/monokai')
editor.session.setUseWorker(false)
editor.setValue([
  'var foo = "hello";',
  'console.log(foo);',
  ''
].join('\n'))
editor.getSession().on('change', doStuff)

var loop = main({messages: []}, render, require('virtual-dom'))
document.querySelector('#messages').appendChild(loop.target)

// display versions
standardizer.version(function (err, versions) {
  if (err) throw err
  document.querySelector('#versioninfo').innerText = versions
})

function render (state) {
  return h('div', [renderFormatButton(), renderMessages(state)])
}

function renderFormatButton () {
  return h('button', {onclick: formatCode}, 'Format Code')
}

function formatCode () {
  standardizer.format(editor.getValue(), function (err, text) {
    if (err) throw err
    editor.setValue(text)
  })
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
  standardizer.lint(editor.getValue(), function (err, messages) {
    if (err) throw err

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
  })
}

doStuff()
