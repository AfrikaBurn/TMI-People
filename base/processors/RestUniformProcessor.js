/**
 * @file RestUniformProcessor.js
 * Simple uniform processor.
 */
"use strict"


const
  UniformProcessor = require('./UniformProcessor')


class RestUniformProcessor extends UniformProcessor {


  /* ----- Request Routing ----- */


  /**
   * Adds middleware to process all request methods in the same way.
   * @inheritDoc
   */
  routes(path){
    return {
      [path]:{
        'get|post|put|patch|delete': [
          (req, res, next) => { this.process(req, res); next() }
        ],
      }
    }
  }
}


module.exports = RestUniformProcessor