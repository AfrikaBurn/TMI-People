/**
 * @file UserAccess.js
 * RESTful access processor.
 */
"use strict"


const
  RestProcessor = require('./RestProcessor'),
  AccessProcessor = require('./AccessProcessor')


class RestAccessProcessor extends RestProcessor {

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


module.exports = RestAccessProcessor