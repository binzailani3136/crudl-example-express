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
mongoose.connect(db.url)

mongoose.connection.on('error', function () {
    console.log('Failed to connect to the db.')
})

function authChecker(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['authorization'] || req.headers['x-access-token'];
    if (req.originalUrl == "/rest-api/login/" || req.originalUrl == "/favicon.ico") {
        next()
    } else {
        if (!token) return res.status(401).send({ success: false, message: 'No token provided.' })
        var split_token = token.split(' ');
        if (split_token[0].toLowerCase() != "token") return res.status(401).send({ success: false, message: 'Invalid token header.' })
        if (split_token.length == 1) return res.status(401).send({ success: false, message: 'Invalid token header. No credentials provided.' })
        if (split_token.length > 2) return res.status(401).send({ success: false, message: 'Invalid token header. Token string should not contain spaces.' })
        db.models.User.findOne({token: split_token[1]}).exec(function(err, user) {
            if (err || !user) return res.status(401).send({ success: false, message: 'Unauthorized.' })
            if (user) next()
        })
    }
}

mongoose.connection.once('open', function () {
    console.log('Connected to the db.')

    // configure app to use bodyParser()
    // this will let us get the data from a POST
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    // index
    app.get('/', function (request, response){
        response.redirect('/crudl-rest/');
    })
    // crudl core
    app.use('/crudl/crudl.js', express.static(__dirname + '/../static/crudl/crudl.js'))
    app.use('/crudl/', express.static(__dirname + '/../static/crudl/'))
    app.use('/crudl/crudl.js', express.static(__dirname + '/../static/crudl-core/crudl.min.js'))
    app.use('/crudl/', express.static(__dirname + '/../static/crudl-core/'))
    // crudl-rest
    app.use('/crudl-admin-rest/', express.static(__dirname + '/../crudl-admin-rest/static/crudl-admin-rest/'))
    app.get('/crudl-rest/*', function (request, response){
        response.sendFile(path.resolve(__dirname, '../crudl-admin-rest/templates/', 'index.html'))
    })
    // crudl-graphql
    app.use('/crudl-admin-graphql/', express.static(__dirname + '/../crudl-admin-graphql/static/crudl-admin-graphql/'))
    app.get('/crudl-graphql/*', function (request, response){
        response.sendFile(path.resolve(__dirname, '../crudl-admin-graphql/templates/', 'index.html'))
    })
    // rest
    app.use(paginate.middleware(20, 50));
    app.use(authChecker);
    app.use('/rest-api', api.router())
    // graphql
    app.use('/graphql-api', graphqlHTTP(req => ({
        schema,
        pretty: true
    })));

    // start server
    var port = process.env.PORT || 3000
    app.listen(port)
    console.log('Magic happens on port ' + port)
})
