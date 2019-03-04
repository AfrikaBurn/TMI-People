/**
 * @file posts.load.js
 * Loads target posts.
 */
"use strict"


class PostLoader extends core.processors.Processor{


  /* ----- Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return {
      [path]: {
        'get|put|patch|delete': [
          core.processors.Processor.PARSE_QUERY,
          (req, res, next) => {
            this.loadTargetPosts(req)
            next()
          }
        ]
      }
    }
  }


  /* ----- Utility ----- */


  /**
   * Load request target post IDs and owners.
   * @param {object} req Express request object
   */
  loadTargetPosts(req){

    req.target = req.target || {}

    req.target.posts = this.endpoint.store.read(
      req.user,
      req.query,
      {
        process: false,
        fields: ['id', 'owner']
      }
    ).data
  }
}


module.exports = PostLoader