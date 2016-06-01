
var entries = require('./collections/entries')
var connexes = require('./connexes/connexes')
var auth = require('./auth')

var descriptor = {
    connexes,
    collections: [],
    auth,
}

descriptor.collections.push(entries)

module.exports = descriptor
