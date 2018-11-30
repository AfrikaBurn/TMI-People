/**
 * @file RestProcessor.js
 * Basic RESTful processor for basic HTTP methods.
 */
"use strict"


const
  Processor = require('./Processor')


class RestProcessor extends Processor {


  /* ----- Request Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return {
      [path]: {
        'all':    [],
        'get':    [Processor.PARSE_QUERY],
        'post':   [Processor.PARSE_BODY],
        'put':    [Processor.PARSE_QUERY, Processor.PARSE_BODY],
        'delete': [Processor.PARSE_QUERY],
        'patch':  [Processor.PARSE_QUERY, Processor.PARSE_BODY]
      }
    }
  }


  /* ----- Method responders ----- */


  /**
   * Process all requests.
   * @param  {object} req Express request object
   * @param  {object} res Express response object
   */
  all(req, res) {}

  /**
   * Process a GET request.
   * @param  {object} req Express request object
   * @param  {object} res Express response object
   */
  get(req, res) {}

  /**
   * Process a POST request.
   * @param  {object} req Express request object
   * @param  {object} res Express response object
   */
  post(req, res) {}

  /**
   * Process a PUT request.
   * @param  {object} req Express request object
   * @param  {object} res Express response object
   */
  put(req, res) {}

  /**
   * Process a PATCH request.
   * @param  {object} req Express request object
   * @param  {object} res Express response object
   */
  patch(req, res) {}

  /**
   * Process a DELETE request.
   * @param  {object} req Express request object
   * @param  {object} res Express response object
   */
  delete(req, res) {}
}


module.exports = RestProcessor