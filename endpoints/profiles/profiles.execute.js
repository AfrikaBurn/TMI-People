/**
 * @file agreement.execute.js
 * Contains profile executor.
 */
"use strict"


class ProfileExecutor extends core.processors.JsonApiStoreProcessor {

  /**
   * Create a new profile type endpoint.
   * @inheritDoc
   */
  post(req, res){
    var persisted = super.post(req, res)

    persisted.data.forEach(
      (endpointDefinition) => this.endpoint.createEndpoint(endpointDefinition)
    )

    return persisted
  }

}


module.exports = ProfileExecutor