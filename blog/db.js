var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
var async = require('async')
var colors = require('colors')
var faker = require('faker')
var _ = require('lodash')
var Schema = mongoose.Schema

var UserSchema = new Schema({
    username: { type: String, maxlength: 30, required: true }, // unique
    password: { type: String, maxlength: 128, required: true },
    first_name: { type: String, maxlength: 30 },
    last_name: { type: String, maxlength: 30 },
    email: { type: String, maxlength: 100 },
    is_staff: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    date_joined: { type: Date, default: Date.now, required: false }
})
UserSchema.plugin(mongoosePaginate);
var User = mongoose.model('User', UserSchema)

var CategorySchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, maxlength: 200, required: true },
    slug: { type: String, maxlength: 100 },
    position: { type: Number }
})
CategorySchema.plugin(mongoosePaginate);
var Category = mongoose.model('Category', CategorySchema)

var TagSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, maxlength: 200, required: true },
    slug: { type: String, maxlength: 100 }
})
TagSchema.plugin(mongoosePaginate);
var Tag = mongoose.model('Tag', TagSchema)

var EntrySchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, maxlength: 200, required: true },
    date: { type: Date, default: Date.now, required: true },
    date_from: { type: Date },
    date_until: { type: Date },
    sticky: { type: Boolean, default: false },
    status: { type: String, enum: ['Draft', 'Online'], default: 'Draft' },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [ {type : mongoose.Schema.ObjectId, ref: 'Tag'} ],
    image: { type: String, maxlength: 200 },
    body: { type: String, maxlength: 3000 },
    createdate: { type: Date },
    updatedate: { type: Date }
})
EntrySchema.plugin(mongoosePaginate);
var Entry = mongoose.model('Entry', EntrySchema)

var EntryLinkSchema = new Schema({
    entry: { type: Schema.Types.ObjectId, required: true },
    url: { type: String, maxlength: 250, required: true },
    title: { type: String, maxlength: 250, required: true },
    description: { type: String, maxlength: 250 },
    position: { type: Number }
})
EntryLinkSchema.plugin(mongoosePaginate);
var EntryLink = mongoose.model('EntryLink', EntryLinkSchema)


// FIXTURES

var initModel = (modelName, objects, callback) => {
    process.stdout.write(`Initializing ${modelName} ... `)

    var tasks = objects.map(object => (function(callback) {
        object.save()
        .then(function () {
            callback(null)
        }, function (err) {
            callback(err)
        })
    }))

    async.parallel(tasks, function(err, result) {
        if (!err) {
            process.stdout.write('done.\n'.green)
        } else {
            process.stdout.write('failed.\n'.red)
            console.log(err);
        }
        callback(err, result)
    })
}
// users
var users = [
    new User({username: 'Patrick', password: 'crudl'}),
    new User({username: 'Axel', password: 'crudl'}),
    new User({username: 'Vaclav', password: 'crudl'})
]
// categories
var categories = []
users.map(function(u) {
    for(var i = 0; i < _.random(300, 500); i++) {
        var name = faker.address.city()
        var slug = faker.helpers.slugify(name)
        var category = new Category({
            user: u._id,
            name: name,
            slug: slug,
            position: i
        })
        categories.push(category)
    }
})
// tags
var tags = []
users.map(function(u) {
    for(var i = 0; i < _.random(100, 200); i++) {
        var tag = new Tag({
            user: u._id,
            name: faker.address.state()
        })
        tags.push(tag)
    }
})
// entries (incl tags/links)
var entries = []
var entrylinks = []
users.map(function(u) {
    for(var i = 0; i < _.random(10, 20); i++) {
        var entrytags = _.sampleSize(tags,  _.random(0, 3))
        var entry = new Entry({
            user: u._id,
            title: faker.name.findName(),
            date: faker.date.past(),
            sticky: faker.random.boolean(),
            status: _.sample(['Draft', 'Online']),
            category: _.sample(categories)._id,
            tags: _.map(entrytags, '_id'),
            body: faker.lorem.text()
        })
        entries.push(entry)
        // entrylinks
        for(var y = 0; y < _.random(0, 3); y++) {
            var entrylink = new EntryLink({
                entry: entry._id,
                url: faker.internet.url(),
                title: faker.address.streetName(),
                position: y
            })
            entrylinks.push(entrylink)
        }
    }
})

module.exports = {
    initdb: (connection, callback) => {
        async.series([
            (cb) => initModel('User', users, cb),
            (cb) => initModel('Category', categories, cb),
            (cb) => initModel('Tag', tags, cb),
            (cb) => initModel('Entry', entries, cb),
            (cb) => initModel('EntryLink', entrylinks, cb)
        ], callback)
    },
    dropdb: (connection, callback) => {
        process.stdout.write('Dropping db...');
        connection.db.dropDatabase(function() {
            process.stdout.write('done.\n'.green)
            callback()
        });
    },
    models: {
        User,
        Category,
        Tag,
        Entry,
        EntryLink
    },
    url: 'mongodb://localhost/blogapp',
}
