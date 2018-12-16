/**
 * @file GroupInstaller.js
 * User endpoint installer.
 */
"use strict"


class GroupInstaller extends core.installers.Installer{

  /**
   * @inheritDoc
   */
  toInstall(){
    return this.endpoint.store.read(
      {id: -1},
      [{id: 0}, {id: 1}]
    ).data.length != 2
  }

  /**
   * @inheritDoc
   */
  install(){

    var installed = true;

    ['Administrator', 'Community'].forEach(
      (label, index) => {
        try{
          if (this.endpoint.store.read({}, {id: index}).data.length == 0){

            utility.log(
              '\x1b[37mCreating \x1b[0m' +
              label +
              '\x1b[37m group.\x1b[0m',
              {indent: 4}
            )

            this.endpoint.store.create(
              {id: -1},
              [GroupInstaller.SYSTEM_COLLECTIVES[index]]
            )
          }
        } catch(e) {
          utility.log(e)
          installed = false
        }
      }
    )

    return installed
  }
}


/* ----- System Groups ----- */


GroupInstaller.SYSTEM_COLLECTIVES = [
  {
    name: 'System',
    description: 'System operators of this tribe.',
    status: 'active',
    owner: {
      entityType: 'user',
      id: -1
    }
  },
  {
    name: 'Participants',
    description: 'Tribe participation group.',
    status: 'active',
    owner: {
      id: -1
    },
    delegate:{
      moderation: {id: 0},
      administration: {id: 0}
    }
  }
]


module.exports = GroupInstaller