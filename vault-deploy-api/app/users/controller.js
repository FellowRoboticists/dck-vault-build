'use strict'

const express = require('express')
const router = express.Router()

const userCtx = require('./context')
const userMw = require('./middleware')
const sessionMw = require('../sessions/middleware')

/* GET users listing. */
router.get(
  '/',
  sessionMw.verifyToken,
  userMw.requiresAdminRole,
  async function __getUsers (req, res, next) {
    try {
      res.json(await userCtx.getUsers(req.query))
    } catch (err) {
      next(err)
    }
  }
)

router.post(
  '/',
  sessionMw.verifyToken,
  userMw.requiresAdminRole,
  async function __createUser (req, res, next) {
    try {
      res.json(await userCtx.createUser(req.body))
    } catch (err) {
      next(err)
    }
  }
)

router.put(
  '/register',
  async function __completeRegistration (req, res, next) {
    try {
      res.json(await userCtx.completeRegistration(req.body))
    } catch (err) {
      next(err)
    }
  }
)

router.put(
  '/:userId/enable',
  sessionMw.verifyToken,
  userMw.requiresAdminRole,
  async function __enableUser (req, res, next) {
    try {
      res.json(await userCtx.enableUser(req.params.userId, req.body))
    } catch (err) {
      next(err)
    }
  }
)

router.delete(
  '/:userId',
  sessionMw.verifyToken,
  userMw.requiresAdminRole,
  async function __deleteUser (req, res, next) {
    try {
      res.json(await userCtx.deleteUser(req.params.userId))
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
