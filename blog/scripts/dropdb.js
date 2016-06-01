var mongoose = require('mongoose')
var db = require('../db')

mongoose.connect(db.url)

mongoose.connection.on('error', function () {
    console.log('Failed to connect to the db.')
    process.exit(-1)
})

mongoose.connection.once('open', function () {
    db.dropdb(mongoose.connection, function() {
        process.exit()
    })
})
