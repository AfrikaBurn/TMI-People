/**
 * @file groups.install.js
 * Group endpoint installer.
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
          utility.log(e, {indent: 4})
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
    author: -1,
    owner: {
      type: 'user',
      id: -1,
    },
    exposure: {
      visibility: 'private',
      accessibility: 'private',
    },
    status: 'active',
  },

  {
    name: 'Participants',
    description: 'Tribe participation group.',
    author: -1,
    owner: {
      type: 'user',
      id: 1,
    },
    exposure: {
      visibility: 'public',
      accessibility: 'public',
    },
    delegate:{
      moderation: 0,
      administration: 0
    },
    status: 'active'
  }

]


module.exports = GroupInstaller