/**
 * @file profiles.install.js
 * Profile endpoint installer.
 */
"use strict"


class ProfileInstaller extends core.installers.Installer{

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

    core.stores.Store.VALIDATOR.addSchema(
      require('./base.profile.schema.json'),
      'profile-base'
    );

    ['Contact', 'Demographics'].forEach(

      (name) => {

        utility.log(
          '\x1b[37mCreating \x1b[0m' +
          name +
          '\x1b[37m profile.\x1b[0m',
          {indent: 2}
        )

        var machineName = name.toLowerCase()

        try{

          this.endpoint.processors.execute.post(
            {
              user: { id: -1, is: { administrator: true }},
              body: [
                {
                  author: -1,
                  owner: 0,
                  name: name,
                  schema: require(
                    './install/' + machineName + '.profile.schema.json'
                  )
                }
              ]
            }
          )

        } catch (e) {
          var logMessage = name + e.error + '\n'
          e.errors.forEach(
            (error) => {
              for (var property in error) {
                error[property].forEach(
                  (fail) => logMessage += property + ' ' + fail.message + '\n'
                )
              }
            }
          )
          utility.log(logMessage)

          installed = false
        }
      }
    )

    return installed
  }
}


module.exports = ProfileInstaller