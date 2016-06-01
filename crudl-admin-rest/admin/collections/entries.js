//-------------------------------------------------------------------
var listView = {
    path: 'entries',
    title: 'Blog Entries',
    actions: {
        list: function (req, cxs) { return cxs.entries.read(req)},
    },
}

listView.fields = [
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
var changeView = {
    path: 'entries/:_id/',
    title: 'Blog Entry',
    actions: {
        get: function (req, cxs) { return cxs.entry.read(req) },
        delete: function (req, cxs) { return cxs.entry.delete(req) },
        save: function (req, cxs) { return cxs.entry.update(req) },
    },
}

changeView.fields = [
    {
        name: 'title',
        label: 'Title',
        field: 'String',
    }
]

//-------------------------------------------------------------------
var addView = {
    path: 'entries/new',
    title: 'New Blog Entry',
    fields: changeView.fields,
    actions: {
        add: function (req, cxs) { return cxs.entries.create(req) },
    },
}

//-------------------------------------------------------------------
module.exports = {
    listView,
    addView,
    changeView,
}
