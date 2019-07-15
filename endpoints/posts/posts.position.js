/**
 * @file posts.position.js
 * Post type positionality processor.
 */
"use strict"


const
  Processor = core.processors.Processor


class PostTypePosition extends core.processors.JsonApiUniformProcessor {


  /**
   * Establish user/post positionality.
   * @inheritDoc
   */
  process(req, res){

    var
      user = req.user

    user.position = {
      owner: true,
      on: []
    }

    req.target.posts.forEach(
      (post, index) => {
        user.position.on[index] = {
          owner: post.owner.type === 'user'
            ? post.owner.id === user.id
            : user.positions.administrator.indexOf(post.owner.id) >= 0
        }

        user.position.owner &= user.position.on[index].owner
      }
    )

    user.position.owner = Boolean(user.position.owner)
  }
}


module.exports = PostTypePosition