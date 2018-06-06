'use strict'

module.exports = class AppError extends Error {
  constructor (message, status) {
    super(message)

    // Saving the class name in property
    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)

    this.status = status || 500
  }
}
