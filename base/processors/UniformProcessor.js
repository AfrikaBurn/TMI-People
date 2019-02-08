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
    return {
      [path]: {
        'get|post|put|patch|delete': [
          (req, res, next) => { this.process(req, res); next() }
        ],
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