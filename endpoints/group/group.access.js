/**
 * @file GroupAccess.js
 * Group access processor.
 */
"use strict"


const
  AccessProcessor = core.processors.AccessProcessor


class GroupAccess extends AccessProcessor {


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
      ? AccessProcessor.DENY(req)
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  put(req, res){
    req.user.is.owner || req.user.is.administrator
      ? AccessProcessor.DENY(req)
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  patch(req, res){
    req.user.is.owner || req.user.is.administrator
      ? AccessProcessor.DENY(req)
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    req.user.is.owner || req.user.is.administrator
      ? AccessProcessor.DENY(req)
      : AccessProcessor.GRANT(req)
  }
}


module.exports = GroupAccess