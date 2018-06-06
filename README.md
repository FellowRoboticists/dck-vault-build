# dck-vault-build

A Docker-based build environment for a web-based API
server environment.

## Overview

This project packages up an ExpressJs-based API server that
is used to check out and build a tar-ball of an application
ready to be deployed. It is assumed that the application to
be packaged is an ExpressJs/Angular application.

The idea is that we don't need to pollute a system with all the
requirements to build an application of this type. We create a
Docker image that has everything it needs to run the API server
and build the target application.
