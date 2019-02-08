/**
 * @file default.position.js
 * Default agreement instance position processor.
 */
"use strict"


const
  Processor = core.processors.Processor


class AgreementPosition extends core.processors.PositionProcessor {


  /**
   * Establishes user/agreement instance positionality.
   * @inheritDoc
   */
  position(req, res){

    var
      user = req.user

    user.position = {
      owner: true,
      on: []
    }

    req.target.agreements.forEach(
      (agreement, index) => {
        user.position.on[index] = {
          promisor:
            agreement.promisor.type === 'user' &&
            agreement.promisor.id == user.id,
          promisee:
            agreement.promisee.type === 'user' &&
            agreement.promisee.id == user.id,
          moderator:
            agreement.promisee.type === 'group' &&
            user.positions.moderator.indexOf(agreement.promisee.id) >= 0,
          administrator:
            agreement.promisee.type === 'group' &&
            user.positions.administrator.indexOf(agreement.promisee.id) >= 0
        }

        user.position.promisor &= user.position.on[index].promisor
        user.position.promisee &= user.position.on[index].promisee
        user.position.moderator &= user.position.on[index].moderator
        user.position.administrator &= user.position.on[index].administrator
      }
    )

    user.position.promisor = Boolean(user.position.promisor)
    user.position.promisee = Boolean(user.position.promisee)
    user.position.moderator = Boolean(user.position.moderator)
    user.position.administrator = Boolean(user.position.administrator)
}
}


module.exports = AgreementPosition