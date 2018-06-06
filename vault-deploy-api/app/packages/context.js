'use strict'

module.exports = (function () {
  const { exec } = require('child_process')
  const db = require('../utility/db')

  const createPackage = async (userId, packageParams) => {
    console.log(`Package: ${JSON.stringify(packageParams)}`)
    await db.run(
      db.statements.insert_package,
      {
        $user_id: userId,
        $application_version: packageParams.application_version,
        $be_version: packageParams.be_version,
        $fe_version: packageParams.fe_version
      }
    )
    //
    // This should probably be changed to return information
    // about what will be done.
    let pkg = await db.get(db.statements.select_latest_package)

    // TODO: Somewhere in here, we need to invoke the
    // packaging script to build this package.
    exec(`/usr/local/bin/deploy_prep.sh -b ${pkg.application_version} -B ${pkg.be_version} -F ${pkg.fe_version} -T ${pkg.build_timestamp}`, async (err, stdout, stderr) => {
    // exec('sleep 60 && echo "I done it!!"', async (err, stdout, stderr) => {
      await db.run(
        db.statements.update_package_processing,
        {
          $error_message: err ? err.toString() : null,
          $stdout: stdout,
          $stderr: stderr,
          $id: pkg.rowid
        }
      )
    })

    return pkg
  }

  const getPackages = async () => {
    return db.all(db.statements.select_all_packages)
  }

  var mod = {
    createPackage: createPackage,
    getPackages: getPackages
  }

  return mod
}())
