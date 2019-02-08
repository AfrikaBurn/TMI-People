/**
 * @file posts.position.js
 * Post positionality processor.
 */
"use strict"


const
  Processor = core.processors.Processor


class PostPosition extends core.processors.PositionProcessor {


/**
   * Establish user/post positionality.
   * @inheritDoc
   */
  position(req, res){

    var
      user = req.user

    user.position = {
      owner: true,
      on: []
    }

    req.target.post.forEach(
      (agreement, index) => {
        user.position.on[index] = {
          owner: agreement.owner.type === 'user'
            ? agreement.owner.id === user.id
            : user.positions.administrator.indexOf(agreement.owner.id) >= 0
        }

        user.position.owner &= user.position.on[index].owner
      }
    )

    user.position.owner = Boolean(user.position.owner)
  }
}


module.exports = PostPosition