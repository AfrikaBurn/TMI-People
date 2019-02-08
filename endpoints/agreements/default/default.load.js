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
            bootstrap.endpoints['/agreements'].loadTargetAgreements(
              req,
              ['id', 'owner', 'promisor', 'promisee']
            )
            next()
          }
        ]
      }
    }
  }
}


module.exports = DefaultLoader