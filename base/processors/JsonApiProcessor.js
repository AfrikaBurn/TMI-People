/**
 * @file JsonApiProcessor.js
 * Processor for RESTful JSONAPI methods.
 */
"use strict"


const
  Processor = require('./Processor'),
  RestProcessor = require('./RestProcessor')


class JsonApiProcessor extends RestProcessor {

  /**
   * @inheritDoc
   */
  routes(path){
    return Object.assign(
      super.routes(path),
      {
        [path + '/:id']: {

          'get': [
            Processor.PARSE_QUERY,
            JsonApiProcessor.PARSE_ID,

            (req, res, next) => {
              res.data = this.get(req, res)
              next()
            }
          ],

          'put':[
            Processor.PARSE_QUERY,
            Processor.PARSE_BODY,
            JsonApiProcessor.PARSE_ID,

            (req, res, next) => {
              res.data = this.put(req, res)
              next()
            }
          ],

          'patch':[
            Processor.PARSE_QUERY,
            Processor.PARSE_BODY,
            JsonApiProcessor.PARSE_ID,

            (req, res, next) => {
              res.data = this.patch(req, res)
              next()
            }
          ],

          'delete': [
            Processor.PARSE_QUERY,
            JsonApiProcessor.PARSE_ID,

            (req, res, next) => {
              res.data = this.delete(req, res)
              next()
            }
          ]
        }
      }
    )
  }
}


// ----- param to query Middleware -----


JsonApiProcessor.PARSE_ID = (req, res, next) => {
  req.query.id = req.params.id
  next()
}


module.exports = JsonApiProcessor