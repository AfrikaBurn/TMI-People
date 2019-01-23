# TMI People


People is the backbone of TMI and manages users, collectives, profiles,
agreements and posts. It enforces positionality and access to only allow a user
to interact with the information they own or curate in ways the owners of said
information have consented to.

TMI People is implemented using a monolyth-microservices hybrid model and
it exposes endpoints for managing Agreement types, Agreements, Collectives,
Post types, Posts, Profile types, Profiles and Users through the
[People API](./API.md).


## Entity relationships

![People Entity Relationships](https://github.com/AfrikaBurn/TMI/raw/master/docs/People-Entity-Relationships.svg?sanitize=true)


## Entity Classes

![People Class Diagram](https://github.com/AfrikaBurn/TMI/raw/master/docs/People-Entity-Classes.svg?sanitize=true)


## Prerequisites

* [Nodejs](https://nodejs.org) runtime is required to install and run TMI
  People.


## Recommended

* [Visual Studio](https://visualstudio.microsoft.com) recommended for
  development & debugging.
* [Postman](https://www.getpostman.com) recommended for testing API endpoints.


## Installing people


Within a terminal:
```
git clone git@github.com:AfrikaBurn/TMI-People.git people
cd people
npm install
```


## Running people

Within a terminal in the checked out folder:
```
node bootstap.js
```
OR within the parent folder:
```
node people
```

You should see startup output ending in:

```
Spinning up MINImal MIcroservices for TMI People

    WARNING: Memory stashes intended for testing only!
    They evaporate once the server stops!
    WARNING: Using memory based stash for session storage!
    It will fail with multiple connections!
    Use another stash for production.


Occupying http://127.0.0.1:3000

TMI People is ready.
```

This means the people services are running and awaiting requests.
Warnings will be present in the startup output until database integration has
been completed.

**For now TMI People runs in memory alone.**

For more detailed output, run people with the verbose switch:

```
node people -v
```


## Testing people

Fire up postman and import the
[test collection](https://github.com/AfrikaBurn/tmi-people/blob/master/testing.postman_collection.json) at:
```
people/testing.postman_collection.json
```

You may start up the test runner in postman and execute the whole TMI collection
, or fire them seperately as examples of requests to direct at the people
services. Note that the tests are not idempotent and some will fail on
subsequent test runs.

**It is best to restart people before running the whole suite again**.


## Stopping people

In the terminal where people is running simply press CTRL-C to terminate the
process.

The output should be:
```
^C Kill command received:

Retiring / endpoint... done.
Retiring /agreement endpoint... done.
Retiring /collective endpoint... done.
Retiring /post endpoint... done.
Retiring /profile endpoint... done.
Retiring /user endpoint... done.
Retiring /agreement/administrator endpoint... done.
Retiring /agreement/moderator endpoint... done.
Retiring /agreement/member endpoint... done.
Retiring /agreement/guest endpoint... done.
Retiring /post/article endpoint... done.
Retiring /post/comment endpoint... done.

TMI People is done.
```
