/**
 * @file EndpointPostProcessor.js
 * Attaches position metadata to responses.
 */
"use strict"


class EndpointPostProcessor extends core.processors.Processor {

  routes(path){
    return {
      '': {
        'use': [
          (req, res, next) => {
            if (req.user && req.user.position) {
              res.data.position = req.user.position
            }
            next()
          }
        ],
      }
    }
  }
}


module.exports = EndpointPostProcessor