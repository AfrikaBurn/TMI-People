/**
 * @file ProfileInstaller.js
 * Profile endpoint installer.
 */
"use strict"


class ProfileInstaller extends core.installers.Installer{

  /**
   * @inheritDoc
   */
  toInstall(){
    return true
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

    return installed
  }
}


module.exports = ProfileInstaller