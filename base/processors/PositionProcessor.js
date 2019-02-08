/**
 * @file agreement.position.js
 * User access processor.
 */
"use strict"


const
  UniformProcessor = require('./UniformProcessor')


class PositionPosition extends UniformProcessor {


  /* ----- Request Routing ----- */


  /**
   * Adds middleware to load user and target user positionality.
   * @inheritDoc
   */
  routes(path){
    return {
      [path]:{
        'get|put|patch|delete': [
          (req, res, next) => { this.position(req, res); next() }
        ],
      }
    }
  }


  /* ----- Positionality calculation ----- */


  /**
   * Computes user ownership of target resources.
   * @inheritDoc
   */
  position(req, res){}
}


module.exports = PositionPosition