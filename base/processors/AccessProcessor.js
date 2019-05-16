/**
 * @file UserAccess.js
 * Simple access processor.
 */
"use strict"


const
  Processor = require('./Processor')


class AccessProcessor extends Processor {}


/* ----- Access controllers ----- */


AccessProcessor.GRANT = (req) => {
  if (req.header('Content-Type') == 'application/json;access') {
    throw utility.clone(Processor.SUCCESS)
  }
}

AccessProcessor.DENY = (message = false) => {
  if (message)
    throw Object.assign(
      {},
      Processor.FORBIDDEN,
      {
        errors: message instanceof Array
          ? message
          : [{title: message}]}
    )
  else throw Processor.FORBIDDEN
}


module.exports = AccessProcessor