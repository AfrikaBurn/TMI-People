/**
 * @file agreement.execute.js
 * A basic processor template.
 */
"use strict"


class AgreementExecutor extends core.processors.JsonApiStoreProcessor {

  post(req, res){
    var persisted = super.post(req, res)

    persisted.data.forEach(
      (endpointDefinition) => this.endpoint.createEndpoint(endpointDefinition)
    )

    return persisted
  }

}


module.exports = AgreementExecutor