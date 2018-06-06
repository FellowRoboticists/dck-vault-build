'use strict'
/* global appConfig */

module.exports = (function () {
  const db = require('../utility/db')
  const {promisify} = require('util')
  const bcrypt = require('bcryptjs')
  const jwt = require('jsonwebtoken')
  const AppError = require('../errors/AppError')

  const bcryptCompare = promisify(bcrypt.compare)

  const login = async (loginParams) => {
    // See if we can find the user by email
    let user = await db.get(db.statements.select_user_by_email, loginParams.email)

    if (!user) throw new AppError(`No user found with email: ${loginParams.email}`, 401)

    if (!user.enabled) throw new AppError(`User ${loginParams.email} not enabled`, 401)

    let valid = await bcryptCompare(loginParams.password, user.password)

    if (!valid) throw new AppError(`Invalid credentials`, 401)

    let payload = {
      userId: user.id,
      user_role: user.user_role,
      name: user.name
    }

    return {
      token: jwt.sign(payload, appConfig.environment.jwtSecret, { expiresIn: appConfig.environment.jwtTimeout })
    }
  }

  var mod = {
    login: login
  }

  return mod
}())
