/**
 * @file UserInstaller.js
 * User endpoint installer.
 */
"use strict"


class UserInstaller extends core.installers.Installer{

  /**
   * @inheritDoc
   */
  toInstall(){
    return this.endpoint.store.read(
      {id: -1},
      [{id: 0}]
      ).data.length == 0
    }

  /**
   * @inheritDoc
   */
  install(){
    ['Anonymous', 'Administrator'].forEach(
      (label, index) => {
        try{
          if (this.endpoint.store.read({}, {id: index}).data.length == 0){

            utility.log(
              '\x1b[37mCreating \x1b[0m' + label + '\x1b[37m user.\x1b[0m',
              {indent: 4}
            )

            this.endpoint.store.create(
              {id: 1},
              [UserInstaller.SYSTEM_ACCOUNTS[index]]
            )
          }
        } catch(e) {
          utility.log(e)
          return false
        }
      }
    )
    return true
  }
}


/* ----- Log Messages ----- */


UserInstaller.CREATING =



/* ----- System Accounts ----- */


UserInstaller.SYSTEM_ACCOUNTS = [
  {
    'username': 'Anonymous',
    'password': 'none',
    'status': 'active',
    'exposure': 'private',
    'email': 'no-reply@system.com'
  },
  {
    'username': 'Administrator',
    'password': 'Administrator',
    'status': 'active',
    'exposure': 'private',
    'email': 'no-reply@system.com'
  }
]


module.exports  = UserInstaller