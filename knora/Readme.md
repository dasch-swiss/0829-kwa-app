
# How to run the knora stack and import the data
## Prerequisites

* docker (on windows: Docker Desktop) with 6 GB Memory assigned
* a shell capable to run bash scripts (on windows: cmder)
* Note: Docker Desktop and cmder are in fact the only tested configuration for now...

## Steps

* clone the repository
* cd into this directory
* run `sh startup.sh`
* wait until the stack is up.
* on a new console, run `sh init-repository.sh`
* restart the stack (or just the knora-api container)
* run `sh load-data.sh`
* wait until it runs through (takes some time)

## To update the data
* follow the same steps as above. Always init the repository before importing a new version

## Known problems

* if graphdb stops with error 137, assign more memory to docker 