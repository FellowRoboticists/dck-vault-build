'use strict'

const express = require('express')
const router = express.Router()

const userCtx = require('./context')

/* GET users listing. */
router.get(
  '/',
  async function __getUsers (req, res, next) {
    try {
      res.json(await userCtx.getUsers())
    } catch (err) {
      next(err)
    }
  }
)

router.post(
  '/',
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
  async function __deleteUser (req, res, next) {
    try {
      res.json(await userCtx.deleteUser(req.params.userId))
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
