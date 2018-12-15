/**
 * @file Store.js
 * Basic Data Store.
 */
"use strict"


const
  Ajv = require('ajv'),
  passwordHash = require('password-hash')


class Store {


  /* ----- Construction ----- */


  /**
   * Creates a new data store.
   * @param  {object} config endpoint configuration.
   */
  constructor(name, config, schema){
    this.name = name
    this.config = config
    this.schema = schema
  }


  // ----- Store Setup -----


  /**
   * Performs installation tasks.
   */
  install(){}


  // ----- Store Cleanup -----


  /**
   * Closes the data store.
   * @return {boolean}  True if close is successfull, false if not.
   */
  close(){
    return true;
  }


  // ----- Storage -----


  /**
   * Create entities.
   * @param  {object} user User creating the entities.
   * @param  {array} entities Array of data entities to create.
   * @return {array} Data     Array of entities that were created successfully.
   */
  create(user, entities){

    this.validate(entities)

    // Commit entities here

    this.process(entities, 'committed')

    return utility.response(Store.CREATED, entities)
  }

  /**
   * Read entities matching the provided criteria.
   * @param  {object} user User reading the entities.
   * @param  {object} criteria Partial entity to match.
   * @param  {object} options Options to apply:
   *                  fields: an optional array of field names to fetch.
   *                  process: boolean whether to apply schema processing.
   *                  schemas: optional
   * @return {array} Array of matching entities.
   */
  read(user, criteria, options = {}){

    var
      fields = options.fields || false,
      process = options.process != undefined ? options.process : true

    // Read entities here
    var entities = criteria

    if (process) this.process(entities, 'retrieved')

    return utility.response(Store.SUCCESS, entities)
  }

  /**
   * Update entities matching the provided criteria with the properties from
   * partial.
   * @param  {object} user User updating the entities.
   * @param  {object} criteria  Partial entity to match.
   * @param  {object} partial   Partial entity to apply update from.
   * @return {array}            Array of updated entities
   */
  update(user, criteria){

    //TODO: partially validate
    this.validate(entities)

    // Make changes here

    this.process(entities, 'retrieved')

    return utility.response(Store.SUCCESS, entities)
  }

  /**
   * Delete all entities matching the provided criteria.
   * @param  {object} user User deleting the entities.
   * @param  {object} criteria Partial entity to match.
   * @return {array}           Array of deleted entities
   */
  delete(user, criteria){

    // Delete here
    var entities = criteria

    this.process(entities, 'deleted')

    return utility.response(Store.SUCCESS, entities)
  }


  // ----- Validation -----


  /**
   * Validate an array of entities against the store schema.
   * @param {array} entities
   */
  validate(entities){

    if (!Array.isArray(entities)) throw utility.error(
      Store.INVALID,
      ["Array expected"]
    )

    var errors = []

    this.process(entities, 'raw')

    entities.forEach(
      (entity, index) => {
        if (
          !Store.VALIDATOR.validate(
            this.name,
            entity
          )
        ) errors[index] = Store.normaliseErrors(Store.VALIDATOR.errors)

      }
    )

    if (errors.length) throw utility.error(Store.INVALID, errors)
    else this.process(entities, 'validated')
  }


  // ----- Text Processing -----


  /**
   * Processes entities at a particular stage during req processing.
   * @param {array} entities
   */
  process(entities, stage){

    var processEntity = (entity, schema, stage) => {
      if (schema.processors){

        for (let property in schema.properties){
          processEntity(entity[property], schema.properties[property], stage)
        }

        var processors = schema.processors[stage]
        if (processors && Object.keys(processors).length){
          for (let property in processors){

            var processor = Store.PROCESSORS[processors[property]]

            if (processor){
              if (entity[property])
                entity[property] = processor(entity[property])
            } else {
              throw Object.assign(
                Store.PROCESSOR_NOT_FOUND,
                {processorName: processors[property]}
              )
            }
          }
        }
      }

      return entity
    }

    for (let i in entities){
      entities[i] = processEntity(entities[i], this.schema, stage)
    }
  }


  // ----- Compatibility -----


  /**
   * Returns a passport compatible session store version of this store.
   * @return {object}
   */
  toSessionStore(){
    utility.log(
      '\x1b[33mWARNING: Using memory based store for session storage!\n' +
      '\x1b[33mIt will fail with multiple connections!\n' +
      '\x1b[33mUse another store for production.\x1b[0m',
      {indent: 4, verbose: false, once: true}
    );
    return undefined;
  }
}


// ----- Statuses -----


Store.SUCCESS = {status: 'Success', status: 200, expose: true}
Store.CREATED = {status: 'Entities created', status: 201, expose: true}
Store.INVALID = {error: 'Failed validation', status: 422, expose: true}
Store.PROCESSOR_NOT_FOUND = {error: 'Schema field processor not found!', status: 500}
Store.NOT_FOUND = {status: 'Entity not found', status: 404, expose: true}


// ----- Shared Validation -----


Store.VALIDATOR = new Ajv({ allErrors: true, jsonPointers: true })


// ----- Validation error messages -----


require('ajv-errors')(Store.VALIDATOR);

/**
* Normalise error messages returned by the validator.
 * @param {array} errors
 */
Store.normaliseErrors = (errors) => {
  return [{}].concat(errors).reduce(

    (cache, next) => {

      var
        field = next.dataPath.length
          ? next.dataPath.replace(/^\./, '')
          : next.params.missingProperty,
        error = {
          violation: next.keyword,
          message: next.message
        }

      cache[field] !== undefined
        ? cache[field].push(error)
        : cache[field] = [error]

      return cache
    }
  )
}


// ----- Static text processors -----


Store.HASHER = passwordHash

Store.PROCESSORS = {}
Store.PROCESSORS.HASH = (value) => {
  return Store.HASHER.generate(
    value,
    {
      algorithm: 'sha512',
      saltLength: 16
    }
  )
}
Store.PROCESSORS.BLANK = (value) => { return '*' }
Store.PROCESSORS.LOWERCASE = (value) => { return value.toLowerCase() }


module.exports = Store