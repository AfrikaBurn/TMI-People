/**
 * @file agreement.access.js
 * Agreement access processor.
 */
"use strict"


const
  Processor = core.processors.Processor,
  AccessProcessor = core.processors.AccessProcessor


class DefaultAgreementAccess extends core.processors.JsonApiAccessProcessor {

  /**
   * @inheritDoc
   */
  get(req, res){
    req.user.position.member ||
    req.user.position.promisor ||
    req.user.position.promisee
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
  }

  /**
   * @inheritDoc
   */
  post(req, res){
    req.user.position.promisee ||
    req.user.position.administrator ||
    req.user.position.moderator
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
  }

  /**
   * @inheritDoc
   */
  put(req, res){
    AccessProcessor.DENY()
  }

  /**
   * @inheritDoc
   */
  patch(req, res){

    var invalid = Object.assign({}, Processor.INVALID_REQUEST, {errors: []})

    req.updates.agreements.forEach(
      (update, index) => {

        req.user.position.promisor && update.status &&
        (
          update.status.from == 'proposed' && update.status.to == 'accepted' ||
          update.status.from == 'accepted' && update.status.to == 'terminated'
        )

        req.user.position.promisee && update.status &&
        (
          update.status.from == 'proposed' && update.status.to == 'withdrawn' ||
          update.status.from == 'accepted' && update.status.to == 'terminated'
        )

      }
    )

    req.updates.agreement.updates = ['status']
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    // TODO: Revisioning for existing
    req.user.is.owner || req.user.is.administrator
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
  }
}


module.exports = DefaultAgreementAccess