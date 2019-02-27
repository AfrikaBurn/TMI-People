/**
 * @file JsonApiProcessor.js
 * Processor for RESTful JSONAPI methods.
 */
"use strict"


const
  bodyParser = require('body-parser'),
  Processor = require('./Processor'),
  RestProcessor = require('./RestProcessor')


class JsonApiProcessor extends RestProcessor {

  /**
   * @inheritDoc
   */
  routes(path){
    return {

      [path]: {
        'post':   [
          JsonApiProcessor.PARSE_BODY,
          JsonApiProcessor.FORMAT_REQUEST
        ],
        'get|delete': [Processor.PARSE_QUERY],
        'put|patch':  [
          Processor.PARSE_QUERY,
          JsonApiProcessor.PARSE_BODY,
          JsonApiProcessor.FORMAT_REQUEST
        ],
        'get|post|put|patch|delete' :[
          (req, res, next) => {
            JsonApiProcessor.FORMAT_RESPONSE(req, res, this.endpoint.name, next)
          }
        ],
      },

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
          JsonApiProcessor.PARSE_BODY,
          JsonApiProcessor.PARSE_ID,
          JsonApiProcessor.FORMAT_REQUEST,

          (req, res, next) => {
            res.data = this.put(req, res)
            next()
          }
        ],

        'patch':[
          Processor.PARSE_QUERY,
          JsonApiProcessor.PARSE_BODY,
          JsonApiProcessor.PARSE_ID,
          JsonApiProcessor.FORMAT_REQUEST,

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
  }
}


// ----- Body parsing middleware -----


JsonApiProcessor.PARSE_BODY  = bodyParser.json(
  { type: ['application/json', 'application/vnd.api+json'] }
)


// ----- Query & Body formatting Middleware -----


JsonApiProcessor.PARSE_ID = (req, res, next) => {
  if (!isNaN(req.params.id)) req.query.id = Number(req.params.id)
  next()
}

JsonApiProcessor.FORMAT_RESPONSE = (req, res, name, next) => {
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

JsonApiProcessor.FORMAT_REQUEST = (req, res, next) => {
  if (req.body) {

    if (req.body.data && req.body.data.length == undefined) req.body.data = [req.body.data]

    if (req.body.data instanceof Array){
      req.body.data.forEach(
        (entity, index) => {
          if (entity.attributes) req.body.data[index] = Object.assign(
            {id: entity.id},
            entity.attributes
          )
        }
      )
    }
    next()
  }
}



module.exports = JsonApiProcessor