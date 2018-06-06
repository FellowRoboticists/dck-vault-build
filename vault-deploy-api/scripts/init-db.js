#!/usr/bin/env node
'use strict'

const program = require('commander')
const bcrypt = require('bcryptjs')
const {promisify} = require('util')
const bcryptHash = promisify(bcrypt.hash)

require('../bootstrap')

const db = require('../app/utility/db')

program
  .version('0.0.1')
  .option('-e, --email <email>', 'Specify the email address of the user')
  .option('-n, --name <name>', 'Specify the name of the user')
  .option('-p, --password <password>', 'Specify the password for the user')
  .option('-A, --admin', 'The user is an administrator')
  .option('-D, --deployer', 'The user is a deployer')
  .option('-R, --reporter', 'The user is a reporter')
  .option('-d, --disabled', 'Disable the user (default is enabled')
  .parse(process.argv)

// Validate where we're at
if (!program.email) {
  console.error('Must specify email')
  process.exit(1)
}
if (!program.name) {
  console.error('Must specify name')
  process.exit(1)
}
if (!program.password) {
  console.error('Must specify password')
  process.exit(1)
}
if (!(program.admin || program.deployer || program.reporter)) {
  console.error('Must specify a user role')
  process.exit(1)
}

db.prep()
  .then(() => console.log('DB Initialized'))
  .then(async () => {
    let hash = await bcryptHash(program.password, 10)
    let role
    if (program.admin) role = 'admin'
    else if (program.reporter) role = 'reporter'
    else if (program.deployer) role = 'deployer'
    await db.run(
      db.statements.insert_credentialed_user,
      {
        $email: program.email,
        $password: hash,
        $user_role: role,
        $name: program.name,
        $enabled: !program.disabled
      }
    )
    let users = await db.all(db.statements.select_users)
    console.log(`Users: ${JSON.stringify(users)}`)
  })
  .catch((err) => console.error(err))
