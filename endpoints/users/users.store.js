/**
 * @file UsersStore.js
 * User Store.
 */
"use strict"


const
  PasswordHash = require('password-hash'),
  hashSettings = {
    algorithm: 'sha512',
    saltLength: 16
  }


class UserStore extends core.stores.MemoryStore {

  /**
   * Create a new user.
   * @inheritDoc
   */
  create(user, newUsers, validated = false){

    newUsers.forEach(
      (newUser) => {
        newUser.email = newUser.email.toLowerCase()
        newUser.password = PasswordHash.generate(newUser.password, hashSettings)
      }
    )

    var createdUsers = super.create(user, newUsers, validated)

    createdUsers.data.forEach(
      (newUser) => newUser.password = '*'
    )

    return createdUsers
  }

  /**
   * @inheritDoc
   */
  read(user, criteria, fields = false){

    var readUsers = super.read(user, criteria, fields)

    readUsers.data.forEach(
      (readUser) => readUser.password = '*'
    )

    return readUsers
  }

  /**
   * @inheritDoc
   */
  write(user, criteria, writeUsers, validated = false){

    if (!validated) this.validate(writeUsers)

    writeUsers.forEach(
      (writeUser) => {
        writeUser.password == '*'
          ? delete writeUser.password
          : writeUser.password = PasswordHash.generate(
            writeUser.password,
            hashSettings
          )
      }
    )

    writeUsers = super.write(user, criteria, writeUsers, true)
    writeUsers.data.map(
      (user) => user.password = '*'
    )

    return writeUsers
  }

  /**
   * @inheritDoc
   */
  update(user, criteria, updateUsers, validated = false){

    if (!validated) this.validatePartial(updateUsers)

    updateUsers.forEach(
      (updateUser) => {
        updateUser.password = '*'
          ? delete updateUser.password
          : updateUser.password = PasswordHash.generate(
            newUser.password,
            hashSettings
          )
      }
    )

    updateUsers = super.update(user, criteria, updateUsers, true)
    updateUsers.data.map(
      (user) => user.password = '*'
    )

    return updateUsers
  }

  /**
   * Authenticates a username and password combination.
   * @param {String} username Uniquely identifying username to check.
   * @param {String} password Password associated with the username to check.
   * @param {Function} done   Callback function upon competion.
   */
  authenticate(username, password, done){

    var verified = false

    super.read({id: 0}, {username: username}, ['password', 'id']).data.forEach(
      (user) => {
        if (PasswordHash.verify(password, user.password)){
          verified = super.read({id: user.id}, {id: user.id}).data.shift()
        }
      }
    )

    return verified
      ? done(null, Object.assign({}, verified, {password: '*'}))
      : done(
        {
          error: [{title: "Invalid credentials"}],
          status: 401,
          expose: true
        },
        false
      )
  }
}


module.exports  = UserStore