/**
 * @file Processor.js
 * Basic processor template.
 */
"use strict"


const
  fs = require('fs'),
  bodyParser = require('body-parser')


class Processor {


  /* ----- Construction ----- */


  /**
   * Constructs a new Processor.
   * @param {object} endpoint Endpoint this processor belongs to.
   */
  constructor(endpoint){
    this.endpoint = endpoint
  }


  /* ----- Routing ----- */


  /**
   * Maps middleware and handlers to routes.
   * @param  {string} path        path of the current endpoint.
   * @return {object}             middleware mapping keyed by method:
   *
   * {
   *   '': {
   *     'method': []
   *   },
   *   [path]: {
   *     'method': [ middleWare, ...],
   *     ...
   *   }
   *   'path/to/bind/to': {
   *     'method': [ middleWare, ...],
   *     ...
   *   }
   * }
   * Method may be any number of [get|post|put|patch|delete] to bind to
   * processors. Eg. 'post|put' will bind to both post and put methods.
   * Processor methods named for http methods will automatically be bound to
   * [path] if it has a method declaration, after any middleware. Eg:
   * {
   *   [path]: {
   *     get: [...],
   *     post: [...],
   *     'get|post': [...]
   *   }
   * }
   * Will map reqs to:
   * getModify(req, res, next){ ... }
   * postModify(req, res, next){ ... }
   */
  routes(path){ return {} }


  /**
   * Attach handlers to routers according to the processor map.
   * @param {string}  path    Path to attach to.
   * @param {object}  router  Router to attach to.
   */
  attach(path, router){

    var
      routeMap = this.routes(path),
      routes = Object.keys(routeMap)

    routes.forEach(
      (route) => {

        var bound = {}

        for (let method in routeMap[route]){

          method.split('|').forEach(

            (subMethod) => {

              routeMap[route][method].forEach(
                (middleware) => router[subMethod](route, middleware)
              )

              if (route == path && this[subMethod] && !bound[subMethod]){
                bound[subMethod] = true
                router[subMethod](route,
                  (req, res, next) => {
                    var response = this[subMethod](req, res, next)
                    if (response !== false) {
                      res.data = response
                      next()
                    }
                  }
                )
              }
            }
          )
        }
      }
    )
  }

  attachMethod(){

  }
}


// ----- Shared Middleware -----


Processor.PARSE_BODY  = bodyParser.json()
Processor.PARSE_QUERY = bodyParser.urlencoded({ extended: false })
Processor.LOG_REQUEST = (req, res, next) => {
  utility.log('Processing '+ req.method + ': ' + req.url)
  next()
}


// ----- Response Types -----


Processor.INVALID_REQUEST = {
  errors: [{title: "Invalid request"}],
  status: 400,
  expose: true
}
Processor.SUCCESS = {
  status: 200,
  expose: true
}
Processor.FORBIDDEN = {
  errors: [{title: "Forbidden to unauthorised users"}],
  status: 403,
  expose: true
}


module.exports = Processor