'use strict'
/* global appConfig */

module.exports = (function () {
  const jwt = require('jsonwebtoken')
  const verifyToken = (req, res, next) => {
    let authorizationHeader = req.headers.authorization

    if (!authorizationHeader) return res.status(401).send('Invalid authorization header')

    let jwtToken = authorizationHeader.split(' ')[1]
    if (!jwtToken) return res.status(401).send('Invalid JWT Token')

    let payload = null

    try {
      payload = jwt.verify(jwtToken, appConfig.environment.jwtSecret)
    } catch (ex) {
      return res.status(401).send(ex.message)
    }

    if (!payload) return res.status(401).send('Invalid JWT payload')

    req.user_id = payload.userId
    req.user_role = payload.user_role
    req.user_name = payload.name

    next()
  }

  var mod = {
    verifyToken: verifyToken
  }

  return mod
}())
