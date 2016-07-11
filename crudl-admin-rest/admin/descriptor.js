
var users = require('./collections/users')
var sections = require('./collections/sections')
var categories = require('./collections/categories')
var tags = require('./collections/tags')
var entries = require('./collections/entries')
var connectors = require('./connectors/connectors')
var auth = require('./auth')

var descriptor = {
    connectors,
    collections: [],
    auth,
}

descriptor.collections.push(users)
descriptor.collections.push(sections)
descriptor.collections.push(categories)
descriptor.collections.push(tags)
descriptor.collections.push(entries)

export default descriptor
