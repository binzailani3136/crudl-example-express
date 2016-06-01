var mongoose = require('mongoose')
var db = require('../db')

/// Connect to mongodb and init the db
mongoose.connect(db.url)

mongoose.connection.on('error', function () {
    console.log('Failed to connect to the db.')
    process.exit(-1)
})

mongoose.connection.once('open', function () {
    db.initdb(mongoose.connection, function () {
        process.exit();
    })
})
