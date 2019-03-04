/**
 * @file agreement.access.js
 * Agreement access processor.
 */
"use strict"


const
  AccessProcessor = core.processors.AccessProcessor


class DefaultAgreementAccess extends core.processors.JsonApiAccessProcessor {

  /**
   * @inheritDoc
   */
  get(req, res){
    req.user.position.member ||
    req.user.position.promisee ||
    req.user.position.promisor
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
  }

  /**
   * @inheritDoc
   */
  post(req, res){
    req.user.position.promisee ||
    req.user.position.moderator ||
    req.user.position.administrator
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
  }

  /**
   * @inheritDoc
   */
  put(req, res){
    req.user.is.administrator
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
  }

  /**
   * @inheritDoc
   */
  patch(req, res){

    if (req.user.is.anonymous) AccessProcessor.DENY()

    var errors = []

    req.updates.agreements.forEach(
      (update, index) => {

        var valid =
          (
            req.user.position.promisor ||
            req.user.position.administrator ||
            req.user.position.moderator
          ) && update.status && (
            update.status.from == 'proposed' && update.status.to == 'accepted' ||
            update.status.from == 'accepted' && update.status.to == 'terminated'
          )

          ||

          (req.user.position.promisee ||
            req.user.position.administrator ||
            req.user.position.moderator
          ) && update.status && (
            update.status.from == 'proposed' && update.status.to == 'withdrawn' ||
            update.status.from == 'accepted' && update.status.to == 'terminated'
          )

        var immutable = this.endpoint.definition.mutable ? Object.keys(update).filter(
          (fieldName) => this.endpoint.definition.mutable.indexOf(fieldName) < 0
        ) : Object.keys(update)

        switch (true){
          case immutable.length > 0:
            errors[index] = {title: 'Immutable field change'};
          break;
          case !valid:
            errors[index] = {title: 'Invalid state change'};
          break;
        }
      }
    )

    errors.length
      ? AccessProcessor.DENY(errors)
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    req.user.is.administrator
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
  }
}


module.exports = DefaultAgreementAccess