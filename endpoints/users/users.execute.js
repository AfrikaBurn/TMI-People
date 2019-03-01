/**
 * @file UserExecutor.js
 * A basic processor template.
 */
"use strict"


const
  JsonApiStoreProcessor = core.processors.JsonApiStoreProcessor,
  Processor = core.processors.Processor,
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy


class UserExecutor extends JsonApiStoreProcessor {


  /* ----- Construction ----- */


  /**
   * Sets up user authentication.
   * @inheritDoc
   */
  constructor(endpoint){
    super(endpoint)

    passport.serializeUser(
      (user, done) => {
        done(null, user.id)
      }
    )

    passport.use(
      'login',
      new LocalStrategy(
        (username, password, done) => {
          return this.endpoint.store.authenticate(username, password, done)
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
          'post': [JsonApiStoreProcessor.PARSE_BODY, UserExecutor.LOGIN],
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


/* ----- Static Response types ----- */


UserExecutor.INVALID_CREDENTIALS = {
  error: [{title: "Invalid credentials"}],
  status: 401,
  expose: true
}


module.exports = UserExecutor