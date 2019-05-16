/**
 * @file JsonApiUniformProcessor.js
 * JSON API uniform processor.
 */
"use strict"


const
  Processor = require('./Processor'),
  RestUniformProcessor = require('./RestUniformProcessor'),
  JsonApiProcessor = require('./JsonApiProcessor')


class JsonApiUniformProcessor extends RestUniformProcessor {


  /* ----- Request Routing ----- */


  /**
   * Adds JSONAPI endpoints.
   * @inheritDoc
   */
  routes(path){
    var routes = Object.assign(
      super.routes(path),
      {
        [path + '/:id']: {

          'get|delete': [
            Processor.PARSE_QUERY,
            JsonApiProcessor.PARSE_ID,

            (req, res, next) => {
              res.build = this.process(req, res)
              next()
            }
          ],

          'put|patch':[
            Processor.PARSE_QUERY,
            JsonApiProcessor.PARSE_BODY,
            JsonApiProcessor.PARSE_ID,

            (req, res, next) => {
              res.build = this.process(req, res)
              next()
            }
          ]
        }
      }
    )

    return routes
  }


  /* ----- Positionality calculation ----- */


  /**
   * Computes user ownership of target resources.
   * @inheritDoc
   */
  process(req, res){}
}


module.exports = JsonApiUniformProcessor