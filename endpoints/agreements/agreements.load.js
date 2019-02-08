/**
 * @file agreements.load.js
 * Agreement loading.
 */
"use strict"


class AgreementLoader extends core.processors.Processor{


  /* ----- Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return {
      '/': {
        'use': [
          (req, res, next) => {
            this.endpoint.loadAgreedPositions(
              [req.user],
              ['administrator', 'moderator', 'member', 'guest']
            )
            next()
          }
        ],
      },
      [path]: {
        'get|put|patch|delete': [
          core.processors.Processor.PARSE_QUERY,
          (req, res, next) => {
            this.endpoint.loadTargetAgreements(req, ['id', 'owner'])
            next()
          }
        ]
      }
    }
  }
}


module.exports = AgreementLoader