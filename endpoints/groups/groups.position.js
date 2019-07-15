/**
 * @file groups.position.js
 * Groups position processor.
 */
"use strict"


class GroupModifier extends core.processors.JsonApiUniformProcessor {

  /**
   * Establish user/group positionality.
   * @inheritDoc
   */
  position(req, res){

    var
      user = req.user

    user.position = {
      owner: true,
      moderator: true,
      administrator: true,
      on: []
    }

    req.target.groups.forEach(

      (group, index) => {

        var
          author = user.id == group.owner.id,
          owner = user.id == group.owner.id,
          administrator = user.positions.administrator.filter(
            (groupId) => group.deferred.administration.indexOf(groupId) >= 0
          ).length > 0 || user.positions.administrator.indexOf(group.id) >= 0,
          moderator = user.positions.moderator.filter(
            (groupId) =>
              group.deferred.moderation.indexOf(groupId) >= 0
          ).length > 0 ||user.positions.moderator.indexOf(group.id) >= 0,
          member = user.positions.member.indexOf(group.id) >= 0,
          guest = user.positions.guest.indexOf(group.id) >= 0

        user.position.on[index] = {
          author: author,
          owner: owner,
          administrator: administrator,
          moderator: moderator,
          member: member,
          guest: guest,
          viewer: author || owner || administrator || moderator || member ||
            !member && req.target.groups[index].exposure.visibility == 'public' ||
            guest && (
              group.exposure.visibility == 'public' ||
              group.exposure.visibility == 'partial'
            )
        }

        user.position.owner &= user.position.on[index].owner
        user.position.administrator &= user.position.on[index].administrator
        user.position.moderator &= user.position.on[index].moderator
        user.position.member &= user.position.on[index].member
        user.position.guest &= user.position.on[index].guest
      }
    )

    user.position.owner = Boolean(user.position.owner)
    user.position.moderator = Boolean(user.position.moderator)
    user.position.administrator = Boolean(user.position.administrator)
  }
}


module.exports = GroupModifier