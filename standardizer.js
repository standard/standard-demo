const get = require('simple-get')
const url = 'https://standardizer.glitch.me'
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'

const version = url + '/version'
const lint = url + '/lint'
const fix = url + '/fix'

const headers = {
  'user-agent': userAgent
}

module.exports = {
  version: function (cb) {
    const opts = {
      method: 'GET',
      url: version
    }
    process(opts, function (err, versions) {
      if (err) return cb(err)

      const text = Object.keys(versions).reduce(function (p, c, i) {
        p += i > 0 ? ', ' : ''
        return p + c + '@' + versions[c]
      }, '')

      return cb(null, text)
    })
  },

  lint: function (text, cb) {
    if (!text) return cb(null, [])

    const opts = {
      method: 'POST',
      url: lint,
      body: { text: text },
      headers: headers
    }
    process(opts, function (err, resp) {
      if (err) return cb(err)
      return cb(null, resp.results[0].messages)
    })
  },

  fix: function (text, cb) {
    if (!text) return cb(null, [])

    const opts = {
      method: 'POST',
      url: fix,
      body: { text: text },
      headers: headers
    }
    process(opts, function (err, resp) {
      if (err) return cb(err)
      const fixedText = resp.results[0].output || text
      return cb(null, fixedText)
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
