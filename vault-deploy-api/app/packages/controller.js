'use strict'

const express = require('express')
const router = express.Router()

const packageCtx = require('./context')
const sessionMw = require('../sessions/middleware')

router.get(
  '/',
  sessionMw.verifyToken,
  async function __getPackages (req, res, next) {
    try {
      res.json(await packageCtx.getPackages())
    } catch (err) {
      next(err)
    }
  }
)

router.post(
  '/',
  sessionMw.verifyToken,
  async function __createPackage (req, res, next) {
    try {
      res.json(await packageCtx.createPackage(req.user_id, req.body))
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
