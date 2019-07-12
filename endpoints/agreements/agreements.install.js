/**
 * @file agreements.installer.js
 * Agreement endpoint installer.
 */
"use strict"


class AgreementInstaller extends core.installers.Installer{

  /**
   * @inheritDoc
   */
  toInstall(){
    return this.endpoint.store.read(
      {id: -1},
      [
        {name: "Administrator"},
        {name: "Moderator"},
        {name: "Member"},
        {name: "Guest"}
      ]
    ).data.length != 4
  }

  /**
   * @inheritDoc
   */
  install(){

    var installed = true;

    core.stores.Store.VALIDATOR.addSchema(
      require('./base.agreement.schema.json'),
      'agreement-base'
    );

    ['Administrator', 'Moderator', 'Member', 'Guest'].forEach(

      (name) => {

        utility.log(
          '\x1b[37mCreating \x1b[0m' + name + '\x1b[37m agreement type.\x1b[0m',
          {indent: 2}
        )

        var machineName = name.toLowerCase()

        this.endpoint.processors.execute.post(
          {
            user: { id: -1, is: { administrator: true }},
            body: {
              data:[
                {
                  owner: {type: 'group', id: 0},
                  name: name,
                  schema: require(
                    './install/' + machineName + '.agreement.schema.json'
                  )
                }
              ]
            }
          }
        )

        utility.log(
          '\x1b[37mCreating \x1b[0m' + name + '\x1b[37m agreement.\x1b[0m',
          {indent: 2}
        )

        this.endpoint.endpoints[machineName].processors.execute.post(
          {
            user: { id: -1, is: { administrator: true }},
            body: {
              data: [
                {
                  promisor: {type: 'user', id: 1},
                  promisee: {type: 'group', id: 0},
                }
              ]
            }
          }
        )
      }
    )

    return installed
  }
}


module.exports = AgreementInstaller