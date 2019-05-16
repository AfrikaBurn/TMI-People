/**
 * @file UserAccess.js
 * JSONAPI access processor.
 */
"use strict"


const
  Processor = require('./Processor'),
  RestAccessProcessor = require('./RestAccessProcessor'),
  JsonApiProcessor = require('./JsonApiProcessor')


class JsonApiAccessProcessor extends RestAccessProcessor {

  /**
   * @inheritDoc
   */
  routes(path){
    var routes = Object.assign(
      super.routes(path),
      {
        [path + '/:id']: {

          'get': [
            Processor.PARSE_QUERY,
            JsonApiProcessor.PARSE_ID,

            (req, res, next) => {
              res.build = this.get(req, res)
              next()
            }
          ],

          'put':[
            Processor.PARSE_QUERY,
            Processor.PARSE_BODY,
            JsonApiProcessor.PARSE_ID,

            (req, res, next) => {
              res.build = this.put(req, res)
              next()
            }
          ],

          'patch':[
            Processor.PARSE_QUERY,
            Processor.PARSE_BODY,
            JsonApiProcessor.PARSE_ID,

            (req, res, next) => {
              res.build = this.patch(req, res)
              next()
            }
          ],

          'delete': [
            Processor.PARSE_QUERY,
            JsonApiProcessor.PARSE_ID,

            (req, res, next) => {
              res.build = this.delete(req, res)
              next()
            }
          ]
        }
      }
    )

    return routes
  }
}


module.exports = JsonApiAccessProcessor