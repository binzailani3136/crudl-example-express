
var entries = require('./collections/entries')
var connexes = require('./connexes/connexes')

var descriptor = {
    connexes,
    collections: [],
}

descriptor.collections.push(entries)

module.exports = descriptor
