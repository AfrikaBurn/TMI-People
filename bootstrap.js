/**
 * @file core.js
 * Core bootstrapping code.
 */
"use strict"


const
  express = require('express'),
  pathUtil = require('path')


class Bootstrap {


  /* ----- Construction ----- */


  /**
   * Bootstraps the endpoint.
   */
  constructor(){

    this.setupApp()

    utility.log(
      '\nSpinning up \x1b[1mMINI\x1b[0mmal \x1b[1mMI\x1b[0mcroservices for ' +
      '\x1b[34m' + this.config.name + '\n',
      {verbose: false}
    )

    utility.log('\x1b[1mLOADING\x1b[0m\n')
    this.setupWhitelist()
    this.setupRouters()
    this.setupEndpoints()

    if (this.root) {
      utility.log('\n\x1b[1mINSTALLING\x1b[0m\n')
      if (this.root.install()) this.start()
    }
  }


  // ----- Server Setup -----


  /**
   * Setup local variables, config, routers and processors.
   */
  setupApp(){

    global.bootstrap = this;

    this.app = express()
    this.config = require('./config.json')
    this.installRoot = pathUtil.normalize(__dirname)
    this.endpointRoot = this.installRoot + '/endpoints'

    this.routers = {}
    this.endpoints = {}
    this.root = false

    this.options = {
      verbose: process.argv.includes('-v')
    }

    process.chdir(this.installRoot)
    process.on('SIGINT', () => { process.exit() })
    process.on('SIGTERM', () => { process.exit() })
    process.on('exit', () => { this.stop() })
  }

  /**
   * Setup connection whitelist.
   */
  setupWhitelist(){

    this.config.whitelist = this.config.whitelist || []

    this.app.use(
      (req, res, next) => {
        if (this.config.whitelist.indexOf(req.headers.origin) != -1){
          res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
          res.setHeader('Access-Control-Allow-Credentials', true)
          res.setHeader('Access-Control-Allow-Methods', Bootstrap.METHODS)
          res.setHeader('Access-Control-Allow-Headers', Bootstrap.HEADERS)
        }
        next()
      }
    )
  }

  /**
   * Setup global routers.
   */
  setupRouters(){

    var
      phases = this.config.phases || ['load', 'access', 'execute']

    for (let phase of phases){
      this.routers[phase] = express.Router()
      this.app.use(this.routers[phase])
    }

    this.app.use(this.handleException)
    this.app.use(this.handleResponse)
    this.app.use(this.handleNotFound)
  }

  /**
   * Delegate to endpoints.
   */
  setupEndpoints(){

    this.root = false

    var Endpoint = null

    try{
      Endpoint = require(bootstrap.endpointRoot + '/endpoints.endpoint.js')
    } catch (e) {
      Endpoint = core.endpoints.Endpoint
    }

    try{
      this.root = new Endpoint('endpoints', this, '/', bootstrap.endpointRoot)
    } catch (e) {
      if (e.errors){
        e.errors.forEach(
          (error) => utility.log('\x1b[31m' + error)
        )
      } else utility.log('\x1b[31m' + e)
    }
  }


  // ----- Server control -----


  /**
   * Start the server.
   */
  start(){

    var
      port = this.config.port
        ? this.config.port
        : 3000,
      name = this.config.name
        ? this.config.name
        : 'MINIMI'

    this.app.listen(
      port,
      () => {
        console.log(
          '\n\nOccupying \x1b[1mhttp://127.0.0.1:' + port + '\n\n' +
          '\x1b[0m' +
          '\x1b[34m' + name + ' is ready.\x1b[0m\n\n'
        )
      }
    )
  }

  /**
   * Stop the server.
   */
  stop(){

    console.log('\x1b[31m Kill command received:\n');

    for (var name in this.endpoints){
      process.stdout.write('Retiring ' + name + ' endpoint... ');
      this.endpoints[name].stop()
      console.log('done.');
    }

    console.log(
      '\n\x1b[34m' + this.config.name + ' is done.\x1b[0m\n'
    )
  }


  /* ----- Response handling ----- */


  /**
   * Commit the data contained within the response object.
   * @param  {object}   req  Express request object
   * @param  {object}   res  Express response object
   * @param  {Function} next Next middleware
   */
  handleResponse(req, res, next){
    if (res.build){
      bootstrap.respond(req, res, res.build.status, res.build)
    } else next()
  }

  /**
   * Handle exceptions. Exceptions may be errors or immediate responses.
   * @param  {object}   exception Exception that has occured
   * @param  {object}   req       Express request object
   * @param  {object}   res       Express response object
   * @param  {Function} next      Next middleware
   */
  handleException(exception, req, res, next){

    if (exception instanceof Error){
      exception.stack
        ? console.log('\x1b[33m%s\x1b[0m' + exception.stack)
        : utility.log(exception)
    }

    if (exception.expose){
      bootstrap.respond(
        req,
        res,
        exception.status || 500,
        Object.assign({}, exception)
      )
    } else {
      bootstrap.respond(req, res, 500, 'Internal Server Error')
    }
  }

  /**
   * Handle not found.
   * @param  {object} req  Express request object
   * @param  {object} res  Express response object
   */
  handleNotFound(req, res){
    bootstrap.respond(req, res, 404, Bootstrap.NOT_FOUND)
  }

  /**
   * Send response to client.
   * @param {object} Express Request object
   * @param {object} Express Response object
   * @param {int} status Http status code
   * @param {object} data Response
   */
  respond(req, res, status, data = {}){

    var errors = [
      data.error,
      (data.errors && data.errors.length ? data.errors[0].title : undefined),
      ''
    ].filter(error => error != undefined).shift()

    utility.log(

      {
          1: '\x1b[37m',
          2: '\x1b[32m',
          3: '\x1b[31m',
          4: '\x1b[33m',
          5: '\x1b[31m'
      }[status.toString().charAt(0)] +

      req.method + ' ' +
      req.url + ' ' +
      status + ' ' +
      errors + '\x1b[0m',
      {verbose: status == 200, time: true}
    )

    delete data.status
    delete data.expose

    typeof data != 'string'
      ? res.status(status).json(data)
      : res.status(status).end(data)
  }
}


/* ----- Global Core Classes ----- */


global.core = {

  processors: {

    Processor: require('./base/processors/Processor'),
    AccessProcessor: require('./base/processors/AccessProcessor'),
    UniformProcessor: require('./base/processors/UniformProcessor'),

    RestProcessor: require('./base/processors/RestProcessor'),
    RestStoreProcessor: require('./base/processors/RestStoreProcessor'),
    RestAccessProcessor: require('./base/processors/RestAccessProcessor'),
    RestUniformProcessor: require('./base/processors/RestUniformProcessor'),

    JsonApiProcessor: require('./base/processors/JsonApiProcessor'),
    JsonApiStoreProcessor: require('./base/processors/JsonApiStoreProcessor'),
    JsonApiUniformProcessor: require('./base/processors/JsonApiUniformProcessor'),
    JsonApiAccessProcessor: require('./base/processors/JsonApiAccessProcessor')
  },

  stores: {
    Store: require('./base/stores/Store'),
    MemoryStore: require('./base/stores/MemoryStore')
  },

  endpoints: {
    Endpoint: require('./base/endpoints/Endpoint'),
    MetaEndpoint: require('./base/endpoints/MetaEndpoint')
  },

  installers: {
    Installer: require('./base/installers/Installer.js')
  }
}


/* ----- Global Utility ----- */


global.utility = {

  /**
   * Clones an entity.
   * @param {object}  Entity to clone.
   */
  clone: (entity) => {
    return JSON.parse(JSON.stringify(entity))
  },

  /**
   * Returns a structured status object.
   * @param {object} status Response status
   * @param {array} entities Associated entities
   */
  response: (status, entities = []) => {
    return Object.assign({}, status, {data: entities})
  },

  /**
   * Returns a structured error response object.
   * @param {object} status Response status
   * @param {array} errors Associated errors
   */
  error: (status, errors = []) => {
    return Object.assign({}, status, {errors: errors})
  },

  /**
   * Logs a message at a specified indent,
   * @param {string} message  Message to log
   * @param {object} options  Logging options: [
   *  indent: Indent to apply
   * ]
   */
  log: (message, options = false) => {

    options = options ? options : {verbose: true}
    options.verbose = !(options.verbose === false)

    if (options.once && !bootstrap.options.verbose) {
      this.cache = this.cache ? this.cache : []
      if (this.cache.includes(message)) return
      this.cache.push(message)
    }

    var
      time = options.time
        ? '\x1b[0m' + new Date(Date.now()).toLocaleString() + ' '
        : '',
      padding = options.indent ? ' '.repeat(options.indent) : '',
      logMessage = message

    switch (true){
      case typeof message == 'string':
        logMessage = message.replace(/\n/g, '\n' + padding)
        break
      case message.message && message.stack:
        logMessage =
          message.message.replace(/\n/g, '\n' + padding) + '\n' + padding +
          message.stack.replace(/\n/g, '\n' + padding)
        break
      case message.error != undefined:
        logMessage = message.error.replace(/\n/g, '\n' + padding) + '\n'
        break
    }

    if (bootstrap.options.verbose && options.verbose || !options.verbose){
      console.log(time + padding + logMessage)
    }
  }
}


// ----- Response Types -----


Bootstrap.NOT_FOUND = {
  errors: [{title: "Not found"}],
  code: 404,
  expose: true
}


Bootstrap.HEADERS = 'Accept, Accept-CH, Accept-Charset, Accept-Datetime, Accept-Encoding, Accept-Ext, Accept-Features, Accept-Language, Accept-Params, Accept-Ranges, Access-Control-Allow-Credentials, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Max-Age, Access-Control-Request-Headers, Access-Control-Request-Method, Age, Allow, Alternates, Authentication-Info, Authorization, C-Ext, C-Man, C-Opt, C-PEP, C-PEP-Info, CONNECT, Cache-Control, Compliance, Connection, Content-Base, Content-Disposition, Content-Encoding, Content-ID, Content-Language, Content-Length, Content-Location, Content-MD5, Content-Range, Content-Script-Type, Content-Security-Policy, Content-Style-Type, Content-Transfer-Encoding, Content-Type, Content-Version, Cookie, Cost, DAV, DELETE, DNT, DPR, Date, Default-Style, Delta-Base, Depth, Derived-From, Destination, Differential-ID, Digest, ETag, Expect, Expires, Ext, From, GET, GetProfile, HEAD, HTTP-date, Host, IM, If, If-Match, If-Modified-Since, If-None-Match, If-Range, If-Unmodified-Since, Keep-Alive, Label, Last-Event-ID, Last-Modified, Link, Location, Lock-Token, MIME-Version, Man, Max-Forwards, Media-Range, Message-ID, Meter, Negotiate, Non-Compliance, OPTION, OPTIONS, OWS, Opt, Optional, Ordering-Type, Origin, Overwrite, P3P, PEP, PICS-Label, POST, PUT, Pep-Info, Permanent, Position, Pragma, ProfileObject, Protocol, Protocol-Query, Protocol-Request, Proxy-Authenticate, Proxy-Authentication-Info, Proxy-Authorization, Proxy-Features, Proxy-Instruction, Public, RWS, Range, Referer, Refresh, Resolution-Hint, Resolver-Location, Retry-After, Safe, Sec-Websocket-Extensions, Sec-Websocket-Key, Sec-Websocket-Origin, Sec-Websocket-Protocol, Sec-Websocket-Version, Security-Scheme, Server, Set-Cookie, Set-Cookie2, SetProfile, SoapAction, Status, Status-URI, Strict-Transport-Security, SubOK, Subst, Surrogate-Capability, Surrogate-Control, TCN, TE, TRACE, Timeout, Title, Trailer, Transfer-Encoding, UA-Color, UA-Media, UA-Pixels, UA-Resolution, UA-Windowpixels, URI, Upgrade, User-Agent, Variant-Vary, Vary, Version, Via, Viewport-Width, WWW-Authenticate, Want-Digest, Warning, Width, X-Content-Duration, X-Content-Security-Policy, X-Content-Type-Options, X-CustomHeader, X-DNSPrefetch-Control, X-Forwarded-For, X-Forwarded-Port, X-Forwarded-Proto, X-Frame-Options, X-Modified, X-OTHER, X-PING, X-PINGOTHER, X-Powered-By, X-Requested-With';
Bootstrap.METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'

module.exports = new Bootstrap()