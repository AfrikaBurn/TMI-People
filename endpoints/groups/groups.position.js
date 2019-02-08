/**
 * @file groups.position.js
 * A basic processor template.
 */
"use strict"


class GroupModifier extends core.processors.PositionProcessor {

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

        user.position.on[index] = {
          owner: user.id == group.owner.id,
          administrator: user.positions.administrator.filter(
            (groupId) =>
              group.deferred.administration.indexOf(groupId) != -1
          ).length > 0,
          moderator: user.positions.moderator.filter(
            (groupId) =>
              group.deferred.moderation.indexOf(groupId) != -1
          ).length > 0,
          member: user.positions.member.indexOf(group.id) != -1,
          guest: user.positions.guest.indexOf(group.id) != -1,
        }
        user.position.on[index].observer =
          user.position.on[index][group.exposure] ||
          user.is[[group.exposure]]

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