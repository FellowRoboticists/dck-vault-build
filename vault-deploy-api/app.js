'use strict'

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

require('./bootstrap')

const db = require('./app/utility/db')

const indexRouter = require('./routes/index')
const usersRouter = require('./app/users/controller')
const packagesRouter = require('./app/packages/controller')
const sessionsRouter = require('./app/sessions/controller')

db.prep()
  .then(() => console.log('DB Ready to go...'))
  .catch((err) => console.error(err))

const app = express()

app.use(logger('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/sessions', sessionsRouter)
app.use('/users', usersRouter)
app.use('/packages', packagesRouter)

module.exports = app
