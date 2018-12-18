/**
 * @file endpoints.position.js
 * Loads requesting user agreed positions.
 */
"use strict"


class RootPosition extends core.processors.Processor {

  /**
   * @inheritDoc
   */
  routes(path){
    return {
      '': {
        'all': [
          (req, res, next) => {
            this.process(req, res)
            next()
          }
        ]
      }
    }
  }


  /* ----- Method responders ----- */


  /**
   * Loads requesting user positions.
   * TODO: Move to agreement loader
   * @inheritDoc
   */
  process(req, res) {
    bootstrap.endpoints['/agreements'].agreedPositions(
      [req.user],
      ['administrator', 'moderator', 'member', 'guest']
    )
  }
}


module.exports = RootPosition