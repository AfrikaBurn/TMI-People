/**
 * @file users.access.js
 * User access processor.
 */
"use strict"


const
  AccessProcessor = core.processors.AccessProcessor


class UserAccess extends core.processors.JsonApiAccessProcessor {

  /* ----- Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return Object.assign(
      super.routes(path),
      {
        [path + '/login']: {
          'post': [
            (req, res, next) => {
              req.user.is.anonymous
                ? AccessProcessor.GRANT(req)
                : AccessProcessor.DENY('Forbidden to authorised users')
              next()
            }
          ],
          'get' : [
            (req, res, next) => {
              req.user.is.authenticated
                ? AccessProcessor.GRANT(req)
                : AccessProcessor.DENY()
              next()
            }
          ]
        }
      },

      {
        [path + '/logout']: {
          'get': [
            (req, res, next) => {
              req.user.is.authenticated
                ? AccessProcessor.GRANT(req)
                : AccessProcessor.DENY()
              next()
            }
          ]
        }
      }
    )
  }


  /* ----- Method responders ----- */


  /**
   * @inheritDoc
   */
  get(req, res){
    req.header('Content-Type') != 'application/json;schema' &&
    req.user.is.anonymous
      ? AccessProcessor.DENY()
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  post(req, res){
    (req.user.is.anonymous && req.body.length == 1) ||
    (req.user.is.authenticated && req.user.is.administrator)
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
  }

  /**
   * @inheritDoc
   */
  put(req, res){
    req.user.is.anonymous ||
    !(req.user.is.owner || req.user.is.administrator)
      ? AccessProcessor.DENY()
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  patch(req, res){
    req.user.is.anonymous ||
    !(req.user.is.owner || req.user.is.administrator)
      ? AccessProcessor.DENY()
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    req.user.is.anonymous ||
    !(req.user.is.owner || req.user.is.administrator)
      ? AccessProcessor.DENY()
      : AccessProcessor.GRANT(req)
  }
}


module.exports = UserAccess