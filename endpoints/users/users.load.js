/**
 * @file users.load.js
 * Loads target users.
 */
"use strict"


class UserLoader extends core.processors.JsonApiUniformProcessor{


  /* ----- Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return Object.assign(
      super.routes(path),
      {
        [path + '/login']: {
          'get|post' : [
            (req, res, next) => {
              req.target = req.target || {}
              req.target.users = [req.user]
              next()
            }
          ]
        },

        [path + '/logout']: {
          'get|post' : [
            (req, res, next) => {
              req.target = req.target || {}
              req.target.users = [req.user]
              next()
            }
         ]
        }
      }
    )
  }


  /* ----- Utility ----- */


  process(req, res){
    this.loadTargetUsers(req)
  }


  /**
   * Load request target user IDs.
   * @param {object} req Express request object
   */
  loadTargetUsers(req){

    req.target = req.target || {}

    req.target.users = this.endpoint.store.read(
      req.user,
      req.query,
      ['id']
    ).data
  }
}


module.exports  = UserLoader