/**
 * @file post.execute.js
 * Post executor.
 */
"use strict"


class PostExecutor extends core.processors.JsonApiStoreProcessor {

  post(req, res){
    var persisted = super.post(req, res)

    persisted.data.forEach(
      (endpointDefinition) => this.endpoint.createEndpoint(endpointDefinition)
    )

    return persisted
  }

}


module.exports = PostExecutor