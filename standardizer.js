var get = require('simple-get')
var url = 'https://standardizer.flet.io/'

var version = url + '/version'
var lint = url + '/lint'
var format = url + '/format'

var headers = {
  'Content-Type': 'application/json'
}

module.exports = {
  version: function (cb) {
    var opts = {
      method: 'GET',
      url: version
    }
    process(opts, function (err, versions) {
      if (err) return cb(err)

      var text = Object.keys(versions).reduce(function (p, c, i) {
        p += i > 0 ? ', ' : ''
        return p + c + '@' + versions[c]
      }, '')

      return cb(null, text)
    })
  },

  lint: function (text, cb) {
    if (!text) return cb(null, [])

    var opts = {
      method: 'POST',
      url: lint,
      body: {text: text},
      headers: headers
    }
    process(opts, function (err, resp) {
      if (err) return cb(err)
      return cb(null, resp.results[0].messages)
    })
  },

  format: function (text, cb) {
    if (!text) return cb(null, [])

    var opts = {
      method: 'POST',
      url: format,
      body: {text: text},
      headers: headers
    }
    process(opts, function (err, resp) {
      if (err) return cb(err)
      return cb(null, resp.text)
    })
  }
}

function process (opts, cb) {
  if (opts.body) opts.body = JSON.stringify(opts.body)

  get.concat(opts, function (err, res, data) {
    if (err) return cb(err)
    cb(null, JSON.parse(data.toString('utf8')))
  })
}
