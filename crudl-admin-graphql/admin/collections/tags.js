import { slugify } from '../utils'

//-------------------------------------------------------------------
var listView = {
    path: 'tags',
    title: 'Tags',
    actions: {
        list: function (req, connectors) { return connectors.tags.read(req) }
    }
}

listView.fields = [
    {
        name: 'originalId',
        label: 'ID',
    },
    {
        name: 'name',
        label: 'Name',
        main: true,
        sortable: true,
        sorted: 'ascending',
        sortpriority: '1',
    },
    {
        name: 'slug',
        label: 'Slug',
    },
    {
        name: 'counterEntries',
        label: 'No. Entries',
    },
]

//-------------------------------------------------------------------
var changeView = {
    path: 'tags/:id',
    title: 'Tag',
    actions: {
        get: function (req, connectors) { return connectors.tag(req.id).read(req) },
        delete: function (req, connectors) { return connectors.tag(req.id).delete(req) },
        save: function (req, connectors) { return connectors.tag(req.id).update(req) },
    },
}

changeView.fields = [
    {
        name: 'id',
        field: 'hidden',
    },
    {
        name: 'name',
        label: 'Name',
        field: 'String',
    },
    {
        name: 'slug',
        label: 'Slug',
        field: 'String',
        readOnly: true,
        onChange: {
            in: 'name',
            setInitialValue: (name) => slugify(name),
        },
        props: {
            helpText: `Slug is automatically generated when saving the Tag.`,
        }
    },
]

//-------------------------------------------------------------------
var addView = {
    path: 'tags/new',
    title: 'New Tag',
    fields: changeView.fields,
    actions: {
        add: function (req, connectors) { return connectors.tags.create(req) },
    },
}


module.exports = {
    listView,
    changeView,
    addView,
}
