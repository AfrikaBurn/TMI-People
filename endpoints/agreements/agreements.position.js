/**
 * @file agreement.position.js
 * Resource positioning processor.
 */
"use strict"


class AgreementPosition extends core.processors.JsonApiUniformProcessor {

  /**
   * Establish user/agreement positionality.
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
          owner: agreement.owner.type === 'user'
            ? agreement.owner.id === user.id
            : user.positions.administrator.indexOf(agreement.owner.id) >= 0
        }

        user.position.owner &= user.position.on[index].owner
      }
    )

    user.position.owner = Boolean(user.position.owner)
  }
}


module.exports = AgreementPosition