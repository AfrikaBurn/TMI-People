/**
 * @file posts.install.js
 * Post endpoint installer.
 */
"use strict"


class PostInstaller extends core.installers.Installer{

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
      require('./base.post.schema.json'),
      'post-base'
    );

    ['Article', 'Comment'].forEach(

      (name) => {

        utility.log(
          '\x1b[37mCreating \x1b[0m' +
          name +
          '\x1b[37m post.\x1b[0m',
          {indent: 2}
        )

        var machineName = name.toLowerCase()

        try{

          this.endpoint.processors.execute.post(
            {
              user: { id: -1, is: { administrator: true }},
              body: {
                data: [
                  {
                    owner: {type: 'group', id: 0},
                    name: name,
                    schema: require(
                      './install/' + machineName + '.post.schema.json'
                    )
                  }
                ]
              }
            }
          )

        } catch (e) {
          utility.log(e)
          installed = false
        }
      }
    )
    return installed
  }
}


module.exports = PostInstaller