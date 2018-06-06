'use strict'
/* global appConfig */

module.exports = (function () {
  const {promisify} = require('util')
  const sqlite3 = require('sqlite3')
  const fs = require('fs')
  const path = require('path')

  const dbFile = path.join(appConfig.environment.dbPath, 'vault-deploy-api-db')

  // The DB connection
  const db = {
    connection: new sqlite3.Database(dbFile)
  }

  const conn = () => {
    return db.connection
  }

  const dbConn = conn()
  const dbConnExec = promisify(dbConn.exec).bind(dbConn)
  const dbConnRun = promisify(dbConn.run).bind(dbConn)
  const dbConnAll = promisify(dbConn.all).bind(dbConn)
  const dbConnGet = promisify(dbConn.get).bind(dbConn)
  const fsReadFile = promisify(fs.readFile)

  let statements = {}

  const all = (sql, ...args) => {
    return dbConnAll(sql, ...args)
  }

  const exec = (sqlScript) => {
    return dbConnExec(sqlScript)
  }

  const get = (sql, ...args) => {
    return dbConnGet(sql, ...args)
  }

  const prep = async () => {
    // Read the configuration file
    let schemaConfig = JSON.parse(await fsReadFile('db/configuration.json'))

    // First, load in the schema files
    for (let schemaFile of schemaConfig.schema) {
      await dbConnExec((await fsReadFile(path.join('db/schema', schemaFile))).toString())
    }

    // Now, load the statements we're going to use
    for (let stmt of schemaConfig.statements) {
      statements[stmt] = (await fsReadFile(path.join('db/statements', `${stmt}.sql`))).toString()
    }
  }

  const run = (sql, ...args) => {
    return dbConnRun(sql, ...args)
  }

  var mod = {
    all: all,
    exec: exec,
    get: get,
    prep: prep,
    run: run,
    statements: statements
  }

  return mod
}())
