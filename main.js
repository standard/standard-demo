var ace = require('brace')
var h = require('virtual-dom/h')
var main = require('main-loop')
var get = require('simple-get')

var querystring = require('querystring')
var standardizer = require('./standardizer')

var query = querystring.parse(window.location.search.slice(1))

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

var loop = main({ messages: [] }, render, require('virtual-dom'))
document.querySelector('#messages').appendChild(loop.target)

// display versions
standardizer.version(function (err, versions) {
  if (err) throw err
  document.querySelector('#versioninfo').innerText = versions
})

function render (state) {
  return h('div', [renderFixButton(), renderMessages(state)])
}

function renderFixButton () {
  return h('button', { onclick: fixCode }, 'Correct errors using --fix')
}

function fixCode () {
  standardizer.fix(editor.getValue(), function (err, text) {
    if (err) throw err
    editor.setValue(text)
  })
}

function renderMessages (state) {
  if (state.messages.length < 1) return h('div', { className: 'success message' }, 'JavaScript Standard Style')

  var renderedMessages = state.messages.map(function (m) {
    var formattedMessage = m.line + ':' + m.column + ' - ' + m.message + ' (' + m.ruleId + ')'
    return h('div', { className: 'message' }, formattedMessage)
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
          column: message.column - 1, // must be 0 based
          text: message.message, // text to show in tooltip
          type: 'error'
        }
      )
    })

    editor.session.setAnnotations(annotations)
    loop.update({ messages: messages })
  })
}

doStuff()

if (query.gist) {
  get.concat('https://api.github.com/gists/' + query.gist, function (err, res, data) {
    if (err) throw err

    var obj = JSON.parse(data.toString())

    // if no file passed, just use the first one
    var file = query.file || Object.keys(obj.files)[0]

    var content = obj.files[file].content

    editor.setValue(content)

    var gistMsg = 'Loaded ' + file + ' from gist <a href="' + obj.html_url + '">' + obj.html_url + '</a>'
    document.getElementById('msg').innerHTML = gistMsg
  })
}
