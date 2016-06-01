var express = require('express');
var paginate = require('express-paginate');
var db = require('../db');

var createRouter = function () {
    var router = express.Router();

    router.get('/', function(req, res) {
        res.json({
            message: 'crudl example with Node.js/Express',
        });
    });

    // Users
    router.route('/users')
    .get(function (req, res) {
        const query = {}
        let counter = 0
        db.models.User.count({}, function (err, count) { counter = count });
        db.models.User.paginate(query, {
            select: "username first_name last_name email is_staff is_active date_joined",
            page: req.query.page,
            limit: req.query.limit,
        }, function(err, result) {
            result["counter"] = counter
            res.json(result);
        })
    })

    router.route('/users/:id')
    .get(function (req, res) {
        console.log('Searching for ' + req.params.id);
        db.models.User.findById(req.params.id, "username first_name last_name email is_staff is_active date_joined", function(err, result) {
            res.json(result);
        })
    })
    .patch(function (req, res) {
        console.log(`Updating ${req.params.id}`);
        db.models.User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true }, function (err, result) {
            if (err) {
                res.status(400)
                if (err.name === "ValidationError") {
                    var errors = {}
                    var obj = Object.keys(err.errors).forEach((key) => {
                        errors[key] = err.errors[key].message
                    })
                    console.log(errors);
                    res.json(errors);
                } else {
                    res.json(err)
                }
            } else {
                res.json(result);
            }
        })
    })
    .delete(function (req, res) {
        console.log(`Deleting ${req.params.id}`);
        db.models.User.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                res.status(400)
                res.send(err)
            } else {
                res.json({message: 'User has been removed.'});
            }
        })
    })

    router.route('/users/add/')
    .post(function (req, res) {
        db.models.User.create(req.body, function (err, result) {
            if (err) {
                res.status(400)
                if (err.name === "ValidationError") {
                    var errors = {}
                    var obj = Object.keys(err.errors).forEach((key) => {
                        errors[key] = err.errors[key].message
                    })
                    console.log(errors);
                    res.json(errors);
                } else {
                    res.json(err)
                }
            } else {
                res.json(result);
            }
        })
    })

    // Categories
    router.route('/categories')
    .get(function (req, res) {
        const query = {}
        let counter = 0
        if (req.query.user) { query["user"] = { "$eq": req.query.user }}
        if (req.query.name) { query["name"] = { "$regex": req.query.name, "$options": "i" }}
        db.models.Category.count({}, function (err, count) { counter = count });
        db.models.Category.paginate(query, {
            select: "user name slug position",
            page: req.query.page,
            limit: req.query.limit,
        }, function(err, result) {
            result["counter"] = counter
            res.json(result);
        })
    })

    router.route('/categories/:id')
    .get(function (req, res) {
        console.log('Searching for ' + req.params.id);
        db.models.Category.findById(req.params.id, "user name slug position", function(err, result) {
            res.json(result)
        })
    })
    .patch(function (req, res) {
        console.log(`Updating ${req.params.id}`);
        db.models.Category.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true  }, function (err, result) {
            if (err) {
                res.status(400)
                if (err.name === "ValidationError") {
                    var errors = {}
                    var obj = Object.keys(err.errors).forEach((key) => {
                        errors[key] = err.errors[key].message
                    })
                    console.log(errors);
                    res.json(errors);
                } else {
                    res.json(err)
                }
            } else {
                res.json(result);
            }
        })
    })
    .delete(function (req, res) {
        console.log(`Deleting ${req.params.id}`);
        db.models.Category.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                res.status(400)
                res.send(err)
            } else {
                res.json({message: 'Category has been removed.'});
            }
        })
    })

    router.route('/categories/add/')
    .post(function (req, res) {
        db.models.Category.create(req.body, function (err, result) {
            if (err) {
                res.status(400)
                if (err.name === "ValidationError") {
                    var errors = {}
                    var obj = Object.keys(err.errors).forEach((key) => {
                        errors[key] = err.errors[key].message
                    })
                    console.log(errors);
                    res.json(errors);
                } else {
                    res.json(err)
                }
            } else {
                res.json(result);
            }
        })
    })


    // Tags
    router.route('/tags')
    .get(function (req, res) {
        const query = {}
        let counter = 0
        if (req.query.user) { query["user"] = { "$eq": req.query.user }}
        if (req.query.name) { query["name"] = { "$regex": req.query.name, "$options": "i" }}
        db.models.Tag.count({}, function (err, count) { counter = count });
        db.models.Tag.paginate(query, {
            select: "user name slug",
            page: req.query.page,
            limit: req.query.limit,
        }, function(err, result) {
            result["counter"] = counter
            res.json(result);
        })
    })

    router.route('/tags/:id')
    .get(function (req, res) {
        console.log('Searching for ' + req.params.id);
        db.models.Tag.findById(req.params.id, "user name slug", function(err, result) {
            res.json(result)
        })
    })
    .patch(function (req, res) {
        console.log(`Updating ${req.params.id}`);
        db.models.Tag.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true  }, function (err, result) {
            if (err) {
                res.status(400)
                if (err.name === "ValidationError") {
                    res.json(err.errors);
                } else {
                    res.json(err)
                }
            } else {
                res.json(result);
            }
        })
    })
    .delete(function (req, res) {
        console.log(`Deleting ${req.params.id}`);
        db.models.Tag.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                res.status(400)
                res.send(err)
            } else {
                res.json({message: 'Tag has been removed.'});
            }
        })
    })

    router.route('/tags/add/')
    .post(function (req, res) {
        db.models.Tag.create(req.body, function (err, result) {
            if (err) {
                res.status(400)
                if (err.name === "ValidationError") {
                    var errors = {}
                    var obj = Object.keys(err.errors).forEach((key) => {
                        errors[key] = err.errors[key].message
                    })
                    console.log(errors);
                    res.json(errors);
                } else {
                    res.json(err)
                }
            } else {
                res.json(result);
            }
        })
    })

    // Entries
    router.route('/entries')
    .get(function (req, res) {
        const query = {}
        let counter = 0
        if (req.query.user) { query["user"] = { "$eq": req.query.user }}
        if (req.query.title) { query["title"] = { "$regex": req.query.title, "$options": "i" }}
        if (req.query.date) { query["date"] = { "$eq": req.query.date }}
        if (req.query.sticky) { query["sticky"] = { "$eq": req.query.sticky }}
        if (req.query.status) { query["status"] = { "$eq": req.query.status }}
        if (req.query.category) { query["category"] = { "$eq": req.query.category }}
        if (req.query.tags) { query["tags"] = { "$in": [req.query.tags] }}
        db.models.Entry.count({}, function (err, count) { counter = count });
        db.models.Entry.paginate(query, {
            select: "user title date sticky status category tags body",
            page: req.query.page,
            limit: req.query.limit,
        }, function(err, result) {
            result["counter"] = counter
            res.json(result);
        })
    })

    router.route('/entries/:id')
    .get(function (req, res) {
        console.log('Searching for ' + req.params.id);
        db.models.Entry.findById(req.params.id, "user title date sticky status category tags body", function(err, result) {
            res.json(result);
        })
    })
    .patch(function (req, res) {
        console.log(`Updating ${req.params.id}`);
        db.models.Entry.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true  }, function (err, result) {
            if (err) {
                res.status(400)
                if (err.name === "ValidationError") {
                    var errors = {}
                    var obj = Object.keys(err.errors).forEach((key) => {
                        errors[key] = err.errors[key].message
                    })
                    console.log(errors);
                    res.json(errors);
                } else {
                    res.json(err)
                }
            } else {
                res.json(result);
            }
        })
    })
    .delete(function (req, res) {
        console.log(`Deleting ${req.params.id}`);
        db.models.Entry.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                res.status(400)
                res.send(err)
            } else {
                res.json({message: 'Entry has been removed.'});
            }
        })
    })

    router.route('/entries/add/')
    .post(function (req, res) {
        db.models.Entry.create(req.body, function (err, result) {
            if (err) {
                res.status(400)
                if (err.name === "ValidationError") {
                    var errors = {}
                    var obj = Object.keys(err.errors).forEach((key) => {
                        errors[key] = err.errors[key].message
                    })
                    console.log(errors);
                    res.json(errors);
                } else {
                    res.json(err)
                }
            } else {
                res.json(result);
            }
        })
    })

    // Entries > Links
    router.route('/entrylinks')
    .get(function (req, res) {
        const query = {}
        let counter = 0
        if (req.query.entry) { query["entry"] = { "$eq": req.query.entry }}
        if (req.query.title) { query["title"] = { "$regex": req.query.title, "$options": "i" }}
        db.models.EntryLink.count({}, function (err, count) { counter = count });
        db.models.EntryLink.paginate(query, {
            select: "entry url title description position",
            page: req.query.page,
            limit: req.query.limit,
        }, function(err, result) {
            result["counter"] = counter
            res.json(result);
        })
    })

    router.route('/entrylinks/:id')
    .get(function (req, res) {
        console.log('Searching for ' + req.params.id);
        db.models.EntryLink.findById(req.params.id, "entry url title description position", function(err, result) {
            res.json(result)
        })
    })
    .patch(function (req, res) {
        console.log(`Updating ${req.params.id}`);
        db.models.EntryLink.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true  }, function (err, result) {
            if (err) {
                res.status(400)
                if (err.name === "ValidationError") {
                    res.json(err.errors);
                } else {
                    res.json(err)
                }
            } else {
                res.json(result);
            }
        })
    })
    .delete(function (req, res) {
        console.log(`Deleting ${req.params.id}`);
        db.models.EntryLink.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                res.status(400)
                res.send(err)
            } else {
                res.json({message: 'Entrylink has been removed.'});
            }
        })
    })

    router.route('/entrylinks/add/')
    .post(function (req, res) {
        db.models.EntryLink.create(req.body, function (err, result) {
            if (err) {
                res.status(400)
                if (err.name === "ValidationError") {
                    var errors = {}
                    var obj = Object.keys(err.errors).forEach((key) => {
                        errors[key] = err.errors[key].message
                    })
                    console.log(errors);
                    res.json(errors);
                } else {
                    res.json(err)
                }
            } else {
                res.json(result);
            }
        })
    })


    return router;
}

module.exports = {
    router: createRouter,
};
