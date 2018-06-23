'use strict'

/* global appConfig */

module.exports = (function () {
  const path = require('path')
  const fs = require('fs-extra')
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
    // exec(`/usr/local/bin/deploy-prep.sh -b ${pkg.application_version} -B ${pkg.be_version} -F ${pkg.fe_version} -T ${pkg.build_timestamp}`, async (err, stdout, stderr) => {
    exec('sleep 60 && echo "I done it!!"', async (err, stdout, stderr) => {
      try {
        console.log('starting to update DB...')

        let processed = (err) ? 2 : 1

        await db.run(
          db.statements.update_package_processing,
          {
            $processed: processed,
            $error_message: err ? err.toString() : null,
            $stdout: stdout,
            $stderr: stderr,
            $id: pkg.id
          }
        )
        console.log('done updating DB.')
      } catch (err) {
        console.error(`Error updating packages: ${err}`)
      }
    })

    return pkg
  }

  const getPackages = async (queryParams) => {
    let result
    if (queryParams.applicationVersion) {
      result = db.all(
        db.statements.select_package_by_version,
        {
          $version: queryParams.applicationVersion
        }
      )
    } else {
      result = db.all(db.statements.select_all_packages)
    }

    return result
  }

  const getPackageInfo = async (packageId) => {
    return db.get(
      db.statements.select_package_by_id,
      {
        $package_id: packageId
      }
    )
  }

  const createPackageURL = (pkg) => {
    let tarball = `release-${pkg.application_version}-${pkg.build_timestamp}.tar.bz2`
    return path.join(appConfig.environment.dbPath, 'packages', tarball)
  }

  const deletePackage = async (packageId) => {
    let pkg = await db.get(
      db.statements.select_package_by_id,
      {
        $package_id: packageId
      }
    )
    if (pkg) {
      await db.run(
        db.statements.delete_package_by_id,
        {
          $package_id: packageId
        }
      )

      // Delete the tarball if it exists
      let tarballPath = createPackageURL(pkg)

      if (await fs.pathExists(tarballPath)) {
        await fs.remove(tarballPath)
      }
    }

    return pkg
  }

  var mod = {
    createPackage: createPackage,
    createPackageURL: createPackageURL,
    deletePackage: deletePackage,
    getPackageInfo: getPackageInfo,
    getPackages: getPackages
  }

  return mod
}())
