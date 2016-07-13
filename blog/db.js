var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
var async = require('async')
var colors = require('colors')
var faker = require('faker')
var _ = require('lodash')
var Schema = mongoose.Schema

var UserSchema = new Schema({
    username: { type: String, maxlength: 30, required: true, unique: true },
    password: { type: String, maxlength: 128, required: true },
    first_name: { type: String, maxlength: 30 },
    last_name: { type: String, maxlength: 30 },
    email: { type: String, maxlength: 100 },
    is_staff: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    date_joined: { type: Date, default: Date.now, required: false },
    token: { type: String, maxlength: 40, required: false }
})
// UserSchema.pre('save', function(next) {
//     /* Set token with is_staff/is_active */
//     if (this.is_staff && this.is_active && !this.token) {
//         // FIXME: create valid token
//         this.token = faker.internet.password()
//     } else {
//         this.token = ''
//     }
//     next();
// });
UserSchema.plugin(mongoosePaginate);
var User = mongoose.model('User', UserSchema)
var opts = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
}

var SectionSchema = new Schema({
    name: { type: String, maxlength: 100, required: true, unique: true },
    slug: { type: String, maxlength: 100 },
    position: { type: Number }
})
SectionSchema.pre('save', function(next) {
    /* Slug should be set with the frontend/admin. */
    // FIXME: save slug if not given
    next()
})
SectionSchema.plugin(mongoosePaginate);
var Section = mongoose.model('Section', SectionSchema)

var CategorySchema = new Schema({
    section: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    name: { type: String, maxlength: 100, required: true },
    slug: { type: String, maxlength: 100 },
    position: { type: Number }
})
CategorySchema.pre('save', function(next) {
    /* Slug should be set with the frontend/admin. */
    // FIXME: save slug if not given
    next()
});
CategorySchema.plugin(mongoosePaginate);
var Category = mongoose.model('Category', CategorySchema)

var TagSchema = new Schema({
    name: { type: String, maxlength: 200, required: true, unique: true },
    slug: { type: String, maxlength: 100 }
})
TagSchema.pre('save', function(next) {
    /* Slug is being set when saving the object. */
    // FIXME: save slug
    next();
});
TagSchema.plugin(mongoosePaginate);
var Tag = mongoose.model('Tag', TagSchema)

var EntrySchema = new Schema({
    title: { type: String, maxlength: 200, required: true },
    status: { type: String, enum: ['Draft', 'Online'], default: 'Draft', required: true },
    date: { type: Date, required: true },
    sticky: { type: Boolean, default: false },
    section: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', null: true, default: null },
    tags: [ {type : Schema.Types.ObjectId, ref: 'Tag'} ],
    image: { type: String, maxlength: 200 },
    summary: { type: String, maxlength: 500 },
    body: { type: String, maxlength: 5000 },
    owner: { type: Schema.Types.ObjectId },
    locked: { type: Boolean, default: false },
    createdate: { type: Date },
    updatedate: { type: Date }
})
EntrySchema.pre('save', function(next) {
    this.updatedate = Date.now();
    if (!this.createdate) {
        this.createdate = Date.now();
    }
    next()
});
EntrySchema.plugin(mongoosePaginate);
var Entry = mongoose.model('Entry', EntrySchema)

var EntryLinkSchema = new Schema({
    entry: { type: Schema.Types.ObjectId, required: true },
    url: { type: String, maxlength: 200, required: true },
    title: { type: String, maxlength: 200, required: true },
    description: { type: String, maxlength: 200 },
    position: { type: Number }
})
EntryLinkSchema.plugin(mongoosePaginate);
var EntryLink = mongoose.model('EntryLink', EntryLinkSchema)


module.exports = {
    models: {
        User,
        Section,
        Category,
        Tag,
        Entry,
        EntryLink
    },
    url: 'mongodb://localhost/blogapp',
}
