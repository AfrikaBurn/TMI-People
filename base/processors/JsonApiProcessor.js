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

      [path + '/:id']: {

        'get': [
          Processor.PARSE_QUERY,
          JsonApiProcessor.PARSE_ID,

          (req, res, next) => {
            var response = this.get(req, res)
            if (response) res.build = response
            if (response !== false) next()
          }
        ],

        'put':[
          Processor.PARSE_QUERY,
          JsonApiProcessor.PARSE_BODY,
          JsonApiProcessor.PARSE_ID,
          JsonApiProcessor.FORMAT_REQUEST,

          (req, res, next) => {
            var response = this.put(req, res)
            if (response) res.build = response
            if (response !== false) next()
          }
        ],

        'patch':[
          Processor.PARSE_QUERY,
          JsonApiProcessor.PARSE_BODY,
          JsonApiProcessor.PARSE_ID,
          JsonApiProcessor.FORMAT_REQUEST,

          (req, res, next) => {
            var response = this.patch(req, res)
            if (response) res.build = response
            if (response !== false) next()
          }
        ],

        'delete': [
          Processor.PARSE_QUERY,
          JsonApiProcessor.PARSE_ID,

          (req, res, next) => {
            var response = this.delete(req, res)
            if (response) res.build = response
            if (response !== false) next()
          }
        ],
      },

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
        'use':[
          (req, res, next) => {
            JsonApiProcessor.FORMAT_RESPONSE(req, res, this.endpoint.name, next)
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
  if (res.build && res.build.data && res.build.data instanceof Array){
    res.build.data.forEach(
      (entity, index) => res.build.data[index] = {
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

    if (!req.body.data) req.body.data = req.body

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