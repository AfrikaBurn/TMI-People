/**
 * @file AgreementEndpoint.js
 * Agreement endpoint controller.
 */
"use strict"


class AgreementEndpoint extends core.endpoints.MetaEndpoint {


  /* ----- Agreed positions of Users ----- */


  /**
   * Retrieves user positions based on agreements.
   * @param {array} users     Users to retrieve agreed positions for.
   * @param {array} positions Positions to retrieve.
   */
  agreedPositions(users, positions){
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