/**
 * @file groups.load.js
 * Target group loading.
 */
"use strict"


class GroupLoader extends core.processors.Processor {

  /**
   * @inheritDoc
   */
  routes(path){
    return {
      [path]: {
        'get|put|patch|delete': [
          core.processors.Processor.PARSE_QUERY,
          (req, res, next) => {
            req.target = req.target || {}
            req.target.groups = this.endpoint.loadTargetGroups(req.user, req.query)
            next()
          }
        ]
      }
    }
  }
}


module.exports = GroupLoader