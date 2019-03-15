'use strict'

module.exports = (function () {
  const requiresAdminRole = (req, res, next) => {
    if (!req.user_role) return res.status(401).send('No user role')

    if (req.user_role !== 'admin') return res.status(401).send('Must be admin')

    next()
  }

  const requiresDeployerRole = (req, res, next) => {
    if (!req.user_role) return res.status(401).send('No user role')

    if (req.user_role === 'reporter') return res.status(401).send('Must be admin')

    next()
  }

  var mod = {
    requiresAdminRole: requiresAdminRole,
    requiresDeployerRole: requiresDeployerRole
  }

  return mod
}())
