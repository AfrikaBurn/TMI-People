/**
 * @file agreements.load.js
 * Target agreement loading.
 */
"use strict"


class AgreementLoader extends core.processors.JsonApiProcessor{


  /* ----- Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return Object.assign(
      super.routes(path),
      {
        '/': {
          'use': [
            (req, res, next) => {
              this.endpoint.loadAgreedPositions(
                [req.user],
                ['administrator', 'moderator', 'member', 'guest']
              )
              next()
            }
          ],
        }
      }
    )
  }

  /**
   * @inheritDoc
   */
  get(req, res){
    this.loadTargetAgreements(req)
  }

  /**
   * @inheritDoc
   */
  post(req, res){
    req.target = req.target || {}
    req.target.agreements = req.body
  }

  /**
   * @inheritDoc
   */
  put(req, res){
    this.loadTargetAgreements(req)
  }

  /**
   * @inheritDoc
   */
  patch(req, res){
    this.loadTargetAgreements(req)
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    this.loadTargetAgreements(req)
  }

  /**
   * Loads agreements targetted by the request
   * @param {object} req
   */
  loadTargetAgreements(req, res, next) {

    req.target = req.target || {}

    req.target.agreements = Object.keys(req.query) ? this.endpoint.store.read(
      req.user,
      req.query,
      ['id', 'owner']
    ).data : []

  }
}


module.exports = AgreementLoader