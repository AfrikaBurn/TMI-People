/**
 * @file default.position.js
 * Default post positionality processor.
 */
"use strict"


const
  Processor = core.processors.Processor


class PostPosition extends core.processors.JsonApiUniformProcessor {


  /**
   * Establish user/post positionality.
   * @inheritDoc
   */
  process(req, res){

    var
      user = req.user

    req.target.groups = bootstrap.endpoints['/groups'].loadTargetGroups(
      user,
      {id: req.target.posts.reduce((ids, post) => ids.concat(post.owner), [])}
    )

    user.position = {
      author: true,
      administrator: true,
      moderator: true,
      member: true,
      guest: true,
      viewer: true,
      on: []
    }

    req.target.posts.forEach(
      (post, index) => {

        var
          author = post.author.type === 'user'
            ? post.author.id === user.id
            : (
              user.positions.moderator.indexOf(post.group) >= 0 ||
              user.positions.administrator.indexOf(post.group) >= 0
            ),
          administrator = user.positions.administrator.indexOf(post.group) >= 0,
          moderator = user.positions.moderator.indexOf(post.group) >= 0,
          member = user.positions.member.indexOf(post.group) >= 0,
          guest = user.positions.guest.indexOf(post.group) >= 0

        user.position.on[index] = {
          author: author,
          administrator: administrator,
          moderator: moderator,
          member: member,
          guest: guest,
          viewer: author || administrator || moderator || member || guest ||
            !member && req.target.groups[index].exposure.visibility == 'public' ||
            guest && (
              req.target.groups[index].exposure.visibility == 'public' ||
              req.target.groups[index].exposure.visibility == 'partial'
            )
        }

        user.position.author &= user.position.on[index].author
        user.position.administrator &= user.position.on[index].administrator
        user.position.moderator &= user.position.on[index].moderator
        user.position.member &= user.position.on[index].member
        user.position.guest &= user.position.on[index].guest
        user.position.viewer &= user.position.on[index].viewer
      }
    )

    user.position.author = Boolean(user.position.author)
    user.position.administrator = Boolean(user.position.administrator)
    user.position.moderator = Boolean(user.position.moderator)
    user.position.member = Boolean(user.position.member)
    user.position.guest = Boolean(user.position.guest)
    user.position.viewer = Boolean(user.position.viewer)
  }
}


module.exports = PostPosition