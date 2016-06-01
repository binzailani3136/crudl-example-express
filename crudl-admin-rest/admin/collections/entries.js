//-------------------------------------------------------------------
var collection = {
    path: 'entries',
    title: 'Blog Entries',
    actions: {
        list: function (req, connexes) { return connexes.entries.read(req)},
    },
}

//-------------------------------------------------------------------
collection.fields = [
    {
        name: 'title',
        label: 'Title',
    },
    {
        name: 'date',
        label: 'Date',
    },
]

//-------------------------------------------------------------------
collection.resource = {
    path: 'entries/:_id/',
    title: 'Blog Entry',
    actions: {
        get: function (req, connexes) { return connexes.entry.read(req) },
        delete: function (req, connexes) { return connexes.entry.delete(req) },
        save: function (req, connexes) { return connexes.entry.update(req) },
    },
}

//-------------------------------------------------------------------
collection.resource.fields = [
    {
        name: 'title',
        label: 'Title',
        field: 'String',
    }
]

//-------------------------------------------------------------------
collection.resource.add = {
    path: 'entries/new',
    title: 'New Blog Entry',
    fields: collection.resource.fields,
    actions: {
        add: function (req, connexes) { return connexes.entries.create(req) },
    },
},

module.exports = collection
