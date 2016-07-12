import { slugify } from '../utils'

//-------------------------------------------------------------------
var listView = {
    path: 'categories',
    title: 'Categories',
    actions: {
        /* counting the entries requires an additional API call per row. please note that the
        number of entries could be added at the database level, removing this additional call. */
        list: function (req, connectors) {
            return connectors.categories.read(req)
            .then(res => {
                // The result of the following line is an array of promises, where each promise resolves
                // to an array of entries associated with the item
                let promises = res.data.map(item => connectors.entries.read(req.filter('category', item._id)))
                // We return a single promise that synchronizes on all the promises created in the previous step
                return Promise.all(promises)
                // And we also need to return a correct response, so we transform
                // the resolved results in the `then` method of the Promise.all promise
                .then(item_entries => {
                    return res.set('data', res.data.map((item, index) => {
                        item.counter_entries = item_entries[index].data.length
                        return item
                    }))
                })
            })
		}
    }
}

listView.fields = [
    {
        name: 'section',
        key: 'section.name',
        label: 'Section',
        sortable: true,
        sorted: 'ascending',
        sortpriority: '1',
    },
    {
        name: 'name',
        label: 'Name',
        main: true,
        sortable: true,
        sorted: 'ascending',
        sortpriority: '2',
    },
    {
        name: 'slug',
        label: 'Slug',
        sortable: true,
    },
    {
        name: 'counter_entries',
        label: 'No. Entries',
    },
]

listView.filters = {
    fields: [
        {
            name: 'section',
            label: 'Section',
            field: 'Select',
            /* we manually build the available options. please note that you could also
            use a connector, making this a one-liner */
            actions: {
                asyncProps: (req, connectors) => connectors.sections.read(req)
                .then(res => res.set('data', {
                    options: res.data.map(section => ({
                        value: section._id,
                        label: section.name,
                    }))
                }))
            },
            initialValue: '',
        },
    ]
}

//-------------------------------------------------------------------
var changeView = {
    path: 'categories/:_id',
    title: 'Category',
    actions: {
        get: function (req, connectors) { return connectors.category(req.id).read(req) },
        delete: function (req, connectors) { return connectors.category(req.id).delete(req) },
        save: function (req, connectors) { return connectors.category(req.id).update(req) },
    },
}

changeView.fields = [
    {
        name: 'section',
        label: 'Section',
        field: 'Select',
        required: true,
        /* Here we build the list of possible options with an extra API call */
        actions: {
            asyncProps: (req, connectors) => connectors.sections.read(req)
            .then(res => res.set('data', {
                options: res.data.map(section => ({
                    value: section._id,
                    label: section.name,
                }))
            }))
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
        watch: {
            for: 'name',
            setInitialValue: (name) => slugify(name),
        },
        props: {
            helpText: `If left blank, the slug will be automatically generated.
            More about slugs <a href="http://en.wikipedia.org/wiki/Slug" target="_blank">here</a>.`,
        }
    },
]

listView.search = {
    name: 'search',
}

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
