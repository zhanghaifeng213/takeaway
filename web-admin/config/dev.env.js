'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

const TARGET = process.env.npm_lifecycle_event

let devConfig = {
  NODE_ENV: '"development"',
  // API_ROOT: '"http://47.104.160.105:3030"',
  // SOCKETIO: '"http://47.104.160.105:3030"'
  API_ROOT: '"http://127.0.0.1:3030"',
  SOCKETIO: '"http://127.0.0.1:3030"'
}

// development: 线上API(默认) | 本地API
if (TARGET === 'dev:local') {
  devConfig = {
    NODE_ENV: '"development"',
    API_ROOT: '"http://127.0.0.1:3030"',
    SOCKETIO: '"http://127.0.0.1:3030"'
  }
}

module.exports = merge(prodEnv, devConfig)
