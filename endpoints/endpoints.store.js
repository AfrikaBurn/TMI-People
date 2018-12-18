/**
 * @file endpoints.store.js
 * Store to be used for session storage.
 */
"use strict"


class SessionStore extends core.stores.MemoryStore {}


module.exports  = SessionStore