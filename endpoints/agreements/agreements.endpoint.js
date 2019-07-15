/**
 * @file agreement.endpoint.js
 * Agreement endpoint controller.
 */
"use strict"


class AgreementEndpoint extends core.endpoints.MetaEndpoint {

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
                  type: 'user',
                  id: user.id,
                }
              }
            // Boil entities down to promisee ids only
            ).data.reduce(
              (promisees, agreement) => promisees.concat(agreement.promisee.id),
              []
            )
          }
        )
      }
    )
  }
}


module.exports = AgreementEndpoint