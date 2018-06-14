'use strict'

const express = require('express')
const router = express.Router()
const fs = require('fs')

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

router.get(
  '/:packageId/download',
  sessionMw.verifyToken,
  async function __downloadPackage (req, res, next) {
    try {
      let pkg = await packageCtx.getPackageInfo(req.params.packageId)
      let tarballPath = packageCtx.createPackageURL(pkg)
      console.log(`Tarball path: ${tarballPath}`)

      fs.readFile(tarballPath, (err, data) => {
        if (err) throw err
        res.contentType('application/octet-stream')
        res.send(data)
      })
    } catch (err) {
      next(err)
    }
  }
)

router.delete(
  '/:packageId',
  sessionMw.verifyToken,
  async function __deletePackage (req, res, next) {
    try {
      res.json(await packageCtx.deletePackage(req.params.packageId))
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
