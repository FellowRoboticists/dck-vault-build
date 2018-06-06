'use strict'
/* global appConfig */

module.exports = (function () {
  const db = require('../utility/db')
  const jwt = require('jsonwebtoken')
  const bcrypt = require('bcryptjs')
  const {promisify} = require('util')

  const bcryptHash = promisify(bcrypt.hash)

  const completeRegistration = async (registrationParams) => {
    // Validate the token...
    // This will raise an exception if token isn't valid
    let payload = jwt.verify(registrationParams.token, appConfig.environment.jwtSecret)

    // Now, get the user associated with the token...
    let user = await db.get(db.statements.select_user_by_email, payload.email)
    if (!user) throw new Error(`Unable to find user with email: ${payload.email}`)

    if (user.registerd) throw new Error('User already registered')

    if (registrationParams.token !== user.token) throw new Error(`User token doesn't match registration token`)

    // Encrypt the password
    let hash = await bcryptHash(registrationParams.password, 10)

    // Now update the user registration
    await db.run(
      db.statements.update_user_registration, {
        $id: user.id,
        $password: hash
      }
    )

    // Return the updated user...
    return db.get(db.statements.select_user_by_id, user.id)
  }

  const createUser = async (userParams) => {
    let payload = {
      email: userParams.email
    }

    let token = jwt.sign(payload, appConfig.environment.jwtSecret, { expiresIn: appConfig.environment.jwtTimeout })

    await db.run(
      db.statements.insert_user,
      userParams.email,
      userParams.user_role,
      userParams.name,
      false, // enabled
      false, // registered
      token
    )

    return db.get(db.statements.select_latest_user)
  }

  const deleteUser = async (userId) => {
    await db.run(db.statements.delete_user, userId)

    return { message: `User ${userId} successfully deleted` }
  }

  const enableUser = async (userId, userParams) => {
    if (typeof userParams.enabled === 'undefined') throw new Error(`Must specified enabled parameter`)

    await db.run(
      db.statements.update_user_enabled,
      {
        $id: userId,
        $enabled: userParams.enabled
      }
    )

    return db.get(db.statements.select_user_by_id, userId)
  }

  const getUsers = () => {
    return db.all(db.statements.select_users)
  }

  var mod = {
    completeRegistration: completeRegistration,
    createUser: createUser,
    deleteUser: deleteUser,
    enableUser: enableUser,
    getUsers: getUsers
  }

  return mod
}())
