import { join, slugify } from '../utils'

//-------------------------------------------------------------------
var listView = {
    path: 'categories',
    title: 'Categories',
    actions: {
        list: function (req, connectors) { return connectors.categories.read(req) }
    }
}

listView.fields = [
    {
        name: 'originalId',
        label: 'ID',
    },
    {
        name: 'section',
        key: 'section.name',  // see actions for listView
        label: 'Section',
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

listView.filters = {
    fields: [
        {
            name: 'section',
            label: 'Section',
            field: 'Select',
            actions: {
                asyncProps: (req, connectors) => connectors.sections_options.read(req)
            },
            initialValue: '',
        },
        {
            name: 'name_Icontains',  // Graphene required syntax
            label: 'Name Contains',
            field: 'String',
        },
    ]
}

//-------------------------------------------------------------------
var changeView = {
    path: 'categories/:id',
    title: 'Category',
    actions: {
        get: function (req, connectors) { return connectors.category(req.id).read(req) },
        delete: function (req, connectors) { return connectors.category(req.id).delete(req) },
        save: function (req, connectors) { return connectors.category(req.id).update(req) },
    },
}

changeView.fields = [
    {
        name: 'id',
        field: 'hidden',
    },
    {
        name: 'section',
        key: 'section.id',
        label: 'Section',
        field: 'Select',
        required: true,
        actions: {
            asyncProps: (req, connectors) => connectors.sections_options.read(req)
        }
    },
    {
        name: 'name',
        label: 'Name',
        field: 'String',
        required: true,
    },
    {
        name: 'slug',
        label: 'Slug',
        field: 'String',
        onChange: {
            in: 'name',
            setInitialValue: (name) => slugify(name),
        },
        props: {
            helpText: `If left blank, the slug will be automatically generated.
            More about slugs <a href="http://en.wikipedia.org/wiki/Slug" target="_blank">here</a>.`,
        }
    },
]

//-------------------------------------------------------------------
var addView = {
    path: 'categories/new',
    title: 'New Category',
    fields: changeView.fields,
    actions: {
        add: function (req, connectors) { return connectors.categories.create(req) },
    },
}


module.exports = {
    listView,
    changeView,
    addView,
}
