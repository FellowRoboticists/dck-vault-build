'use strict'

module.exports = (function () {
  var mod = {
    dbPath: process.env.DB_PATH ? process.env.DB_PATH : '/var/lib/vault-deploy',
    debuggingMode: process.env.DEBUGGING_MODE ? process.env.DEBUGGING_MODE : 'off',
    jwtSecret: process.env.JWT_SECRET || 'abc123',
    jwtTimeout: 60 * 60
  }

  return mod
}())
