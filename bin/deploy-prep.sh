#!/bin/bash

BRANCH=master
FE_BRANCH=$BRANCH
BE_BRANCH=$BRANCH
PKG_TIMESTAMP=$(date +%s)

# What are we doing here?
#
verbose_level=3
BASE_DIR=/var/lib/vault-deploy
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_DIR=${BASE_DIR}/repo-mirrors
SOURCE_DIR=${BASE_DIR}/sources
PACKAGE_DIR=${BASE_DIR}/packages

VAULT_BE_NAME=vault-be
VAULT_FE_NAME=vault-fe
BASE_GITHUB=git@github.com:uberspeck
VAULT_BE_REPO=${BASE_GITHUB}/${VAULT_BE_NAME}.git
VAULT_FE_REPO=${BASE_GITHUB}/${VAULT_FE_NAME}.git

. ${SCRIPT_DIR}/git-support.sh
# . /usr/local/bin/git-support.sh

usage() {
  cat <<EOF
Usage: deploy-prep.h [options]

  -b <branch>    The version of the application being deployed (default '${BRANCH}')
  -B <be-branch> The branch/tag for the back-end code (default '${BE_BRANCH}')
  -F <fe-branch> The branch/tag for the front-end code (default '${FE_BRANCH}')
  -p <pkg-dir>   The full path to the location of packages (default '${PACKAGE_DIR}')
  -r <repo-dir>  The full path to the repository directory (default '${REPO_DIR}')
  -s <src-dir>   The full path to the location of the sources (default '${SOURCE_DIR}')
  -T <timestamp> The timestamp to use for the package (default '${PKG_TIMESTAMP}')
  -h             Display this message
EOF
}

while getopts ":hB:b:F:p:r:s:T:" opt
do
  case ${opt} in
    b)
      BRANCH=${OPTARG}
      ;;
    B)
      BE_BRANCH=${OPTARG}
      ;;
    F)
      FE_BRANCH=${OPTARG}
      ;;
    p)
      PACKAGE_DIR=${OPTARG}
      ;;
    r)
      REPO_DIR=${OPTARG}
      ;;
    s)
      SOURCE_DIR=${OPTARG}
      ;;
    T)
      PKG_TIMESTAMP=${OPTARG}
      ;;
    h)
      usage
      exit 0
      ;;
    \?)
      usage
      exit 1
      ;;
  esac
done

shift $((OPTIND -1))

info "Repository directory: ${REPO_DIR}"
info "Source directory:     ${SOURCE_DIR}"

# Prepare the source for the version we want
prepareSource ${REPO_DIR} ${SOURCE_DIR} ${VAULT_BE_REPO} ${VAULT_BE_NAME} ${BE_BRANCH}
prepareSource ${REPO_DIR} ${SOURCE_DIR} ${VAULT_FE_REPO} ${VAULT_FE_NAME} ${FE_BRANCH}

# Now get the node_modules dealt with
(cd ${SOURCE_DIR}/${VAULT_BE_NAME} && \
  yarn --no-progess install --production)


(cd ${SOURCE_DIR}/${VAULT_FE_NAME} && \
  yarn --no-progess install && \
  rm -fr dist && \
  ng build --no-progress -prod)

# Now, copy the assets from the fe to the back-end
info "#### Gather up assets..."
cp -r ${SOURCE_DIR}/${VAULT_FE_NAME}/dist/* ${SOURCE_DIR}/${VAULT_BE_NAME}/assets/

# Make sure the package dir exists
mkdir -p ${PACKAGE_DIR}

# We want to make a tarball of the deployment with the name
# 'release-<branch>-<timestamp>.tar.bz2'
info "#### Building package..."
# TIMESTAMP=$(date +%Y%m%d%H%M%S)
BASENAME=release-${BRANCH}-${PKG_TIMESTAMP}
tar jcf ${PACKAGE_DIR}/${BASENAME}.tar.bz2 \
  -C ${SOURCE_DIR}/vault-be \
  --exclude .git \
  --exclude .gitignore \
  --exclude tape \
  .

info "#### Done."
