/**
 * @file agreement.access.js
 * Agreement access processor.
 */
"use strict"


const
  AccessProcessor = core.processors.AccessProcessor


class AgreementAccess extends core.processors.JsonApiAccessProcessor {

  /**
   * @inheritDoc
   */
  get(req, res){
    req.user.is.authenticated
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
  }

  /**
   * @inheritDoc
   */
  post(req, res){
    req.user.is.authenticated
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
  }

  /**
   * @inheritDoc
   */
  put(req, res){
    // TODO: Revisioning for existing
    req.user.is.owner || req.user.is.administrator
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
  }

  /**
   * @inheritDoc
   */
  patch(req, res){
    // TODO: Revisioning for existing
    req.user.is.owner || req.user.is.administrator
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
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


module.exports = AgreementAccess