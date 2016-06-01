
var BlogEntries = require('./collections/BlogEntries')
var connexes = require('./connexes/connexes')

var descriptor = {
    connexes,
    collections: [],
}

descriptor.collections.push(BlogEntries)

module.exports = descriptor
