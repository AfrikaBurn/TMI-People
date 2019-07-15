/**
 * @file posts.load.js
 * Loads target post types.
 */
"use strict"


class PostLoader extends core.processors.UniformProcessor{

  /**
   * Load request target post IDs and owners.
   * @param {object} req Express request object
   */
  process(req){

    req.target = req.target || {}

    req.target.posts = this.endpoint.store.read(
      req.user,
      req.query,
      ['id', 'owner']
    ).data
  }
}


module.exports = PostLoader