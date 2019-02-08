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
    var routes = Object.assign(
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

    routes[path]['use'] = [
      (req, res, next) => {
        JsonApiProcessor.FORMAT(req, res, this.endpoint.name, next)
      }
    ]

    return routes
  }
}


// ----- param to query Middleware -----


JsonApiProcessor.PARSE_ID = (req, res, next) => {
  req.query.id = req.params.id
  next()
}

JsonApiProcessor.FORMAT = (req, res, name, next) => {
  if (res.data && res.data.data && res.data.data instanceof Array){
    res.data.data.forEach(
      (entity, index) => res.data.data[index] = {
        type: name.replace(/s$/, ''),
        id: entity.id,
        attributes: entity
      }
    )
  }
  next()
}


module.exports = JsonApiProcessor