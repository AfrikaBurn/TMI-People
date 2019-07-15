/**
 * @file posts.access.js
 * Post type access processor.
 */
"use strict"


const
  AccessProcessor = core.processors.AccessProcessor


class PostAccess extends core.processors.JsonApiAccessProcessor {

  /**
   * @inheritDoc
   */
  get(req, res){
    req.user.is.administrator ||
    (req.user.is.anonymous && req.body.length <= 1)
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY()
  }

  /**
   * @inheritDoc
   */
  post(req, res){
    req.user.is.administrator
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