/**
 * @file UserAccess.js
 * User access processor.
 */
"use strict"


const
  Processor = require('./Processor'),
  RestProcessor = require('./RestProcessor')


class AccessProcessor extends RestProcessor {

  /**
   * @inheritDoc
   */
  get(req, res){
    AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  post(req, res){
    AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  put(req, res){
    AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  patch(req, res){
    AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    AccessProcessor.GRANT(req)
  }
}


/* ----- Access controllers ----- */


AccessProcessor.GRANT = (req) => {
  if (req.header('Content-Type') == 'application/json;access') {
    throw Processor.SUCCESS
  }
}

AccessProcessor.DENY = (message = false) => {
  if (message)
    throw Object.assign({}, Processor.FORBIDDEN, {errors: [{title: message}]})
  else throw Processor.FORBIDDEN
}


module.exports = AccessProcessor