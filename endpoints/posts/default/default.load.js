/**
 * @file posts.load.js
 * Loads target post types.
 */
"use strict"


class PostLoader extends core.processors.JsonApiProcessor{

  /**
   * @inheritDoc
   */
  get(req, res){
    this.loadTargetPosts(req)
  }

  /**
   * @inheritDoc
   */
  post(req, res){
    req.target = req.target || {}
    req.target.posts = req.body
  }

  /**
   * @inheritDoc
   */
  put(req, res){
    this.loadTargetPosts(req)
  }

  /**
   * @inheritDoc
   */
  patch(req, res){
    this.loadTargetPosts(req)
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    this.loadTargetPosts(req)
  }


  /* ----- Utility ----- */


  /**
   * Load request target post IDs and owners.
   * @param {object} req Express request object
   */
  loadTargetPosts(req){

    req.target = req.target || {}

    req.target.posts = this.endpoint.store.read(
      req.user,
      req.query,
      ['id', 'owner', 'author']
    ).data
  }
}


module.exports = PostLoader