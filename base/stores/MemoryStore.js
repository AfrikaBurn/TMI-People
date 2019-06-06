/**
 * @file MemoryStore.js
 * Memory Based Store.
 */

"use strict"


const
  Store = require('./Store')


class MemoryStore extends Store {


  /* ----- Construction ----- */


  /**
   * Creates a new memory based data store.
   * @inheritDoc
   */
  constructor(name, config, schema){
    super(name, config, schema)
    this.cache = []
  }


  // ----- Storage -----


  /**
   * @inheritDoc
   */
  create(user, entities, validated = false){

    if (!validated) this.validate(entities)

    entities.forEach(
      (entity) => {
        entity.id = this.cache.length
        this.cache.push(entity)
      }
    )
    entities = utility.clone(entities)

    return utility.response(Store.CREATED, entities)
  }

  /**
   * @inheritDoc
   */
  read(user, criteria, fields = false){

    var
      matches = utility.clone(
        this.cache.filter(
          (element) => {
            return MemoryStore.matches(element, criteria)
          }
        )
      )

      if (fields) matches.forEach(
        (element, index) => {
          matches[index] = fields.reduce(
            (filtered, field) => {
              return element[field] != undefined || !fields
                ? Object.assign(filtered, {[field]: element[field]})
                : filtered;
            },
            {}
          )
        }
    )

    return utility.response(Store.SUCCESS, matches)
  }

  /**
   * @inheritDoc
   */
  write(user, criteria, entities, validated = false){

    if (!validated) this.validate(entities)

    if (criteria) {
      this.read(user, criteria).data.forEach(
        (stored, index) => {
          Object.assign(this.cache[stored.id], entities[0], {id: stored.id})
          stored = utility.clone(this.cache[index])
        }
      )
    } else {
      entities.forEach(
        (entity) => {
          this.read(user, {id: entity.id}).data.forEach(
            (stored, index) => {
              Object.assign(this.cache[index], entity, {id: entity.id})
              stored = utility.clone(this.cache[index])
            }
          )
        }
      )
    }

    return utility.response(Store.SUCCESS, entities)
  }

  /**
   * @inheritDoc
   */
  update(user, criteria, entities, validated = false){

    var
      toUpdate = this.cache.filter(
        (element) => {
          return MemoryStore.matches(element, criteria)
        }
      )

    if (toUpdate.length == 0) throw Store.NOT_FOUND
    if (!validated) this.validatePartial(entities)

    toUpdate.forEach(
      (element) => this.schema.mutable
        ? this.schema.mutable.forEach(
            (propName) => {
              if (element[propName] != undefined)
                element[propName] = entities[0][propName]
            }
          )
        : Object.assign(element, entities[0], {id: element.id})
    )

    return utility.response(Store.SUCCESS, utility.clone(toUpdate))
  }

  /**
   * @inheritDoc
   */
  delete(user, criteria){

    var
      toDelete = this.read(user, criteria, false).data,
      deleted = []

    while(toDelete.length){

      var
        current = toDelete.pop(),
        index = this.cache.map((e) => {return e.id} ).indexOf(current.id)

        if (index != -1) {
        this.cache.splice(index, 1)
        deleted.push(current)
      }
    }

    return utility.response(Store.SUCCESS, deleted)
  }
}


// ----- Utility methods -----


/**
 * Does a match of an element to criteria.
 * @param  {object} element  [description]
 * @param  {object} criteria [description]
 * @return {boolean}         true if matching, false if not.
 */
MemoryStore.matches = (element, criteria) => {

  for(let property in criteria){
    if (typeof criteria[property] == 'object'){
      if (!MemoryStore.matches(element[property], criteria[property]))
        return false
    } else {
      if (element[property] != criteria[property]) return false
    }
  }

  return true
}


module.exports = MemoryStore