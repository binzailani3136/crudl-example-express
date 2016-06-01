var express = require('express')
var paginate = require('express-paginate')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var graphqlHTTP = require('express-graphql')
var db = require('./db')
var path = require('path')
var api = require('./rest/api')
import schema from './graphql/schema.js'

var app = express()
// var router = express.Router()
mongoose.connect(db.url)

mongoose.connection.on('error', function () {
    console.log('Failed to connect to the db.')
})

mongoose.connection.once('open', function () {
    console.log('Connected to the db.')

    // configure app to use bodyParser()
    // this will let us get the data from a POST
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    // rest
    app.use(paginate.middleware(10, 50));
    app.use('/rest-api', api.router())
    // graphql
    app.use('/graphql-api', graphqlHTTP(req => ({
        schema,
        pretty: true
    })));
    // crudl-rest
    app.use('/crudl/', express.static(__dirname + '/../static/crudl/'))
    app.use('/crudl-admin-rest/', express.static(__dirname + '/../crudl-admin-rest/static/crudl-admin-rest/'))
    app.get('/crudl-rest/*', function (request, response){
        response.sendFile(path.resolve(__dirname, '../crudl-admin-rest/templates/', 'index.html'))
    })
    // crudl-graphql

    // start server
    var port = process.env.PORT || 3000
    app.listen(port)
    console.log('Magic happens on port ' + port)
})
