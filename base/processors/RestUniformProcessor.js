/**
 * @file agreement.position.js
 * Simple position processor.
 */
"use strict"


const
  UniformProcessor = require('./UniformProcessor')


class RestUniformProcessor extends UniformProcessor {


  /* ----- Request Routing ----- */


  /**
   * Adds middleware to load user and target user positionality.
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