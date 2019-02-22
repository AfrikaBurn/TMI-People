/**
 * @file GroupAccess.js
 * Group access processor.
 */
"use strict"


const
  AccessProcessor = core.processors.AccessProcessor


class GroupAccess extends core.processors.JsonApiAccessProcessor {


  // ----- Request Routing -----


  /**
   * @inheritDoc
   */
  get(req, res){
    AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  post(req, res){
    req.user.is.anonymous
      ? AccessProcessor.DENY()
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  put(req, res){
    req.user.is.owner || req.user.is.administrator
      ? AccessProcessor.DENY()
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  patch(req, res){
    req.user.is.owner || req.user.is.administrator
      ? AccessProcessor.DENY()
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    req.user.is.owner || req.user.is.administrator
      ? AccessProcessor.DENY()
      : AccessProcessor.GRANT(req)
  }
}


module.exports = GroupAccess