/**
 * @file load.js
 * Group loading.
 */
"use strict"


const
  passport = require('passport'),
  expressSession = require('express-session'),
  Processor = core.processors.Processor


class GroupLoader extends Processor{


  /* ----- Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return {
      [path]: {
        'get': [Processor.PARSE_QUERY]
      }
    }
  }


  /* ----- Method responders ----- */


  /**
   * Load request target groups.
   * @inheritDoc
   */
  get(req, res){
    this.loadTargetGroups(req)
  }


  /* ----- Utility ----- */


  /**
   * Load target groups IDs, ownership, deference and exposure.
   * @param  {object} req Express request object
   */
  loadTargetGroups(req){

    req.target = req.target || {}

    req.target.groups = this.endpoint.store.read(
      req.user,
      req.query,
      {
        process: false,
        fields: ['id', 'owner', 'defer', 'exposure']
      }
    ).data

    req.target.groups.forEach(
      (group) => {
        group.deferred = {
          moderation: this.loadDeferanceChain(
            req.user,
            group,
            'moderation'
          ),
          administration: this.loadDeferanceChain(
            req.user,
            group,
            'administration'
          )
        }
      }
    )
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
            {id: group.defer[type].id},
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


module.exports = GroupLoader