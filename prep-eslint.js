#!/usr/bin/env node
var path = require('path')
var sh = require('shelljs')

if (!sh.which('git')) {
  sh.echo('Sorry, this script requires git')
  sh.exit(1)
}

cloneOrPull('https://github.com/eslint/eslint', 'eslint')
cloneOrPull('https://github.com/xjamundx/eslint-plugin-standard', 'eslint-plugin-standard')

// This process is emulating parts of eslint's "browserify" makefile function
// https://github.com/eslint/eslint/blob/master/Makefile.js#L543

// remove load-rules.js
sh.rm('eslint/lib/load-rules.js')

sh.cp('-f', 'eslint-plugin-standard/rules/*.js', 'eslint/lib/rules')

// create a new load-rules.js!
generateRulesIndex('eslint/lib/')

// hard code 'espree' as the parser
sh.sed('-i', 'parser = require(config.parser)', "parser = require('espree')", 'eslint/lib/eslint.js')

function cloneOrPull (repo, dir) {
  if (sh.test('-d', dir)) {
    sh.pushd(dir)
    sh.exec('git pull')
    sh.popd()
  } else {
    sh.exec('git clone ' + repo + ' ' + dir)
  }
}

/**
 * Generates a static file that includes each rule by name rather than dynamically
 * looking up based on directory. This is used for the browser version of ESLint.
 * @param {string} basedir The directory in which to look for code.
 * @returns {void}
 */
function generateRulesIndex (basedir) {
  var output = 'module.exports = function() {\n'
  output += '  var rules = Object.create(null)\n'

  sh.find(basedir + 'rules/').filter(isJsFile).forEach(function (filename) {
    var basename = path.basename(filename, '.js')
    output += '    rules["' + basename + '"] = require("./rules/' + basename + '")\n'
  })

  output += '\n    return rules\n};'
  output.to(basedir + 'load-rules.js')
}

function isJsFile (file) {
  return file.match(/\.js$/)
}
