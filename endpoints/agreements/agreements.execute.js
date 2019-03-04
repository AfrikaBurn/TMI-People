/**
 * @file agreement.execute.js
 * Agrgeement executor.
 */
"use strict"


class AgreementExecutor extends core.processors.JsonApiStoreProcessor {

  /**
   * Create a new agreement type endpoint.
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


module.exports = AgreementExecutor