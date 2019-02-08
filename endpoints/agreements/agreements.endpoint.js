/**
 * @file agreement.endpoint.js
 * Agreement endpoint controller.
 */
"use strict"


class AgreementEndpoint extends core.endpoints.MetaEndpoint {


/**
   * Load request target agreement IDs and owners.
   * @param {object} req Express request object
   * @param {array} fields Array of field names to load
   */
  loadTargetAgreements(req, fields){

    req.target = req.target || {}

    req.target.agreements = this.store.read(
      req.user,
      req.query,
      {
        process: false,
        fields: fields
      }
    ).data
  }

  /**
   * Retrieves users positions based on agreements.
   * @param {array} users     Users to retrieve agreed positions for.
   * @param {array} positions Positions to retrieve.
   */
  loadAgreedPositions(users, positions){
    users.forEach(
      (user) => {

        user.positions = {};

        positions.forEach(
          (position) => {
            // Read position agreements where user is promisor
            user.positions[position] = this.endpoints[position].store.read(
              user,
              {
                promisor: {
                  entityType: 'user',
                  id: user.id,
                }
              }
            // Boil entities down to group ids only
            ).data.reduce(
              (groups, agreement) => groups.concat(agreement.promisee.id),
              []
            )
          }
        )
      }
    )
  }
}


module.exports = AgreementEndpoint