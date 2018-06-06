'use strict'

const express = require('express')
const AppError = require('../errors/AppError')
const router = express.Router()

const sessionCtx = require('./context')
const sessionMw = require('./middleware')

router.post(
  '/',
  async function _login (req, res, next) {
    try {
      res.json(await sessionCtx.login(req.body))
    } catch (err) {
      if (err instanceof AppError) {
        res.status(err.status).send(err.message)
      } else {
        next(err)
      }
    }
  }
)

router.delete(
  '/',
  sessionMw.verifyToken,
  function _logout (req, res, next) {
    res.json({ message: 'Successfully logged out' })
  }
)

module.exports = router
