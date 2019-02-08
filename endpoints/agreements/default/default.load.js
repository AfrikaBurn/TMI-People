/**
 * @file default.load.js
 * Default agreement loading.
 */
"use strict"


class DefaultLoader extends core.processors.RestProcessor{


  /* ----- Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return {
      [path]: {
        'get|post|put|patch|delete': [
          core.processors.Processor.PARSE_QUERY,
          (req, res, next) => {

            req.target = req.target || {}

            req.target.agreements = this.endpoint.store.read(
              req.user,
              req.query,
              {
                process: false,
                fields: ['id', 'owner', 'promisor', 'promisee']
              }
            ).data

            next()
          }
        ]
      }
    }
  }
}


module.exports = DefaultLoader