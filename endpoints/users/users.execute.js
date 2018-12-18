/**
 * @file UserExecutor.js
 * A basic processor template.
 */
"use strict"


const
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Processor = core.processors.Processor


class UserExecutor extends core.processors.JsonApiStoreProcessor {


  /* ----- Construction ----- */


  /**
   * Sets up user deserialisation.
   * @inheritDoc
   */
  constructor(endpoint){
    super(endpoint)

    passport.serializeUser(
      (user, done) => { UserExecutor.serializeUser(user, done) }
    )

    passport.use(
      'login',
      new LocalStrategy(
        (username, password, done) => {
          return this.authenticate(username, password, done)
        }
      )
    )
  }


  /* ----- Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return Object.assign(
      super.routes(path),
      {
        [path + '/login']: {
          'post': [Processor.PARSE_BODY, UserExecutor.LOGIN],
          'get': [UserExecutor.CURRENT]
        }
      },

      {
        [path + '/logout']: {
          'get': [UserExecutor.LOGOUT]
        }
      }
    )
  }


  /* ----- Method responders ----- */


  /**
   * Creates a user and logs in as that user.
   * @inheritDoc
   */
  post(req, res) {

    var
      result = super.post(req, res),
      user = result.status === 201
        ? result.data[0]
        : false

    if (req.user.is.anonymous && user){
      req.logIn(
        user,
        function(error) {
          if (error) throw error
          else throw result
        }
      )
    } else throw result

    return false
  }


  /* ----- Authentication ----- */


  /**
   * Authenticates a username and password combination.
   * @param {String} username Uniquely identifying username to check.
   * @param {String} password Password associated with the username to check.
   * @param {Function} done   Callback function upon competion.
   */
  authenticate(username, password, done){

    var
      user = this.endpoint.store.read(
        {},
        {username: username },
        {process: false}
      ).data.shift()

    switch(true){
      case !user:
        return done(UserExecutor.INVALID_ACCOUNT, false)
      case core.stores.Store.HASHER.verify(password, user.password):
        this.endpoint.store.process([user], 'committed')
        return done(null, user)
      default:
      return done(UserExecutor.INVALID_CREDENTIALS, false)
    }
  }
}


// ----- Static Middleware -----


/**
 * Passport login implementation.
 * @param  {object}   req  Express request object
 * @param  {object}   res  Express response object
 * @param  {Function} next Next middleware
 */
UserExecutor.LOGIN = (req, res, next) => {
  passport.authenticate('login',

    function(error, user, info) {

      if (error) throw error
      if (!user) throw UserExecutor.INVALID_CREDENTIALS

      req.logIn(user,

        function(error) {

          if (error) throw error

          req.data = bootstrap.respond(
            req, res, 200,
            Object.assign(
              utility.clone(Processor.SUCCESS),
              { data: user }
            )
          )
        }
      )
    }

  )(req, res, next)
}

/**
 * Passport logout implementation.
 * @param  {object}   req  Express request object
 * @param  {object}   res  Express response object
 * @param  {Function} next Next middleware
 */
UserExecutor.LOGOUT = (req, res, next) => {
  if (req.session){
    req.session.destroy(
      () => {
        req.logout()
        res.clearCookie('tmi.mobi.session', {path: "/"})
        res.data = utility.response(Processor.SUCCESS)
        next()
      }
    )
  }
}

/**
 * Returns the currently logged in user.
 * @param  {object}   req  Express request object
 * @param  {object}   res  Express response object
 * @param  {Function} next Next middleware
 */
UserExecutor.CURRENT = (req, res, next) => {
  res.data = utility.response(Processor.SUCCESS, req.user)
  next()
}

/**
 * Serializes a user into the session.
 * @param {Obect} user    User to serialise.
 * @param {Function} done Callback function upon completion.
 */
UserExecutor.serializeUser = (user, done) => {
  done(null, user.id)
}


/* ----- Static Response types ----- */


UserExecutor.INVALID_ACCOUNT = {
  errors: [{title: "Invalid account"}],
  status: 401,
  expose: true
}
UserExecutor.INVALID_CREDENTIALS = {
  error: [{title: "Invalid credentials"}],
  status: 401,
  expose: true
}
UserExecutor.CURRENT_CREDENTIALS = {
  error: [{title: "Invalid credentials"}],
  status: 401,
  expose: true
}


module.exports = UserExecutor