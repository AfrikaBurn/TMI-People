/**
 * @file EndpointProcessor.js
 * A processor for dynamic endpoints.
 */
"use strict"


const
  RestStoreProcessor = require('./RestStoreProcessor')


class EndpointProcessor extends RestStoreProcessor {


  /* ----- Method responders ----- */


  /** Creates a new subendpoint as per provided endpoint definition within the
   * request body.
   * @inheritDoc
   */
  post(req, res) {

    req.body.forEach(
      (endpointDefinition) => this.endpoint.createEndpoint(endpointDefinition)
    )

    return super.post(req, res)
  }
}


module.exports = EndpointProcessor