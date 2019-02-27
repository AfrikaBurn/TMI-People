/**
 * @file default.load.js
 * Default agreement loading.
 */
"use strict"


class DefaultLoader extends core.processors.JsonApiProcessor{

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
    this.diff(req)
  }

  /**
   * @inheritDoc
   */
  patch(req, res){
    this.loadTargetAgreements(req)
    this.diff(req)
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    this.loadTargetAgreements(req)
  }

  /**
   *
   * @param {object} req
   */
  loadTargetAgreements(req){

    req.target = req.target || {}

    req.target.agreements = this.endpoint.store.read(
      req.user,
      req.query,
      { process: false }
    ).data
  }

  /**
   * Computes what updates entail
   * @param {object} req
   */
  diff(req){

    req.updates = req.updates || {
      agreement: {},
      agreements: [],
    }

    req.target.agreements.forEach(
      (agreement, i) => {
        req.updates.agreements[i] = core.stores.Store.DIFF(
          agreement,
          req.body.data[i],
          ['mutable']
        )
      }
    )
  }
}


module.exports = DefaultLoader