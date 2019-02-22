/**
 * @file UniformProcessor.js
 * Simple uniform processor.
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
      [path]:{
        'get|post|put|patch|delete': [
          (req, res, next) => { this.process(req, res); next() }
        ],
      }
    }
  }


  /* ----- Processing ----- */


  /**
   * Computes user ownership of target resources.
   * @inheritDoc
   */
  process(req, res){}
}


module.exports = UniformProcessor