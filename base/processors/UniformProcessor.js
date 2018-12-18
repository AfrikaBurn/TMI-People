/**
 * @file UniformProcessor.js
 * Basic uniform processor for basic HTTP methods.
 */
"use strict"


const
  Processor = require('./Processor')


class UniformProcessor extends Processor {


  /* ----- Request Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){

    var responder = (req, res, next) => { this.process(req, res); next() }

    return {
      [path]: {
        'get': [responder],
        'post': [responder],
        'put': [responder],
        'delete': [responder],
      }
    }
  }


  /* ----- Responder ----- */


  /**
   * Default request processor.
   * @param  {object} req Express request object
   * @param  {object} res Express response object
   */
  process(req, res){}
}


module.exports = UniformProcessor