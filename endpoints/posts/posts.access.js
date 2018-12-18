/**
 * @file posts.access.js
 * Post access processor.
 */
"use strict"


const
  AccessProcessor = core.processors.AccessProcessor


class PostAccess extends AccessProcessor {

  /**
   * @inheritDoc
   */
  get(req, res){
    req.user.is.authenticated ||
    (req.user.is.anonymous && req.body.length <= 1)
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
    req.user.is.owner || user.is.administrator
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
  }

  /**
   * @inheritDoc
   */
  patch(req, res){
    // TODO: Revisioning for existing
    req.user.is.owner || user.is.administrator
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    // TODO: Revisioning for existing
    req.user.is.owner || user.is.administrator
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
  }
}


module.exports = PostAccess