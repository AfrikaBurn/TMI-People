/**
 * @file groups.endpoint.js
 * Group endpoint controller.
 */
"use strict"


class GroupEndpoint extends core.endpoints.Endpoint {

  /**
   * Load target groups IDs, ownership, deference and exposure.
   * @param  {object} req Express request object
   */
  loadTargetGroups(user, query){

    var groups = this.store.read(
      user,
      query,
      ['id', 'owner', 'defer', 'exposure']
    ).data

    groups.forEach(
      (group) => {
        group.deferred = {
          moderation: this.loadDeferanceChain(
            user,
            group,
            'moderation'
          ),
          administration: this.loadDeferanceChain(
            user,
            group,
            'administration'
          )
        }
      }
    )

    return groups
  }

  /**
   * Get the deferred administration or moderation chain of a group.
   * @param {object} user Requesting user.
   * @param {object} group Group to trace.
   * @param {string} type Deference type to trace [administrator|moderator].
   */
  loadDeferanceChain(user, group, type){

    var deferedTo = [group.id]

    if (group.defer && group.defer[type]) {
      deferedTo.concat(
        this.loadDeferanceChain(
          user,
          this.endpoint.store.read(
            user,
            {id: group.defer[type]},
            {
              process: false,
              fields: ['id', 'defer']
            }
          ).data[0],
          type
        )
      )
    }

    return deferedTo
  }
}


module.exports = GroupEndpoint