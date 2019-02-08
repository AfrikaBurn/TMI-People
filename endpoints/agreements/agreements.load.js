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

            req.target = req.target || {}

            req.target.agreements = this.endpoint.store.read(
              req.user,
              req.query,
              {
                process: false,
                fields: ['id', 'owner']
              }
            ).data

            next()
          }
        ]
      }
    }
  }
}


module.exports = AgreementLoader