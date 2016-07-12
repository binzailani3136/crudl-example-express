import { slugify } from '../utils'

//-------------------------------------------------------------------
var listView = {
    path: 'tags',
    title: 'Tags',
    actions: {
        /* counting the entries requires an additional API call per row. please note that the
        number of entries could be added at the database level, removing this additional call. */
        list: function (req, connectors) {
            return connectors.tags.read(req)
            .then(res => {
                // The result of the following line is an array of promises, where each promise resolves
                // to an array of entries associated with the item
                let promises = res.data.map(item => connectors.entries.read(req.filter('tags', item._id)))
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
        sortable: true,
    },
    {
        name: 'counter_entries',
        label: 'No. Entries',
    },
]

listView.search = {
    name: 'search',
}

//-------------------------------------------------------------------
var changeView = {
    path: 'tags/:_id',
    title: 'Tag',
    actions: {
        get: function (req, connectors) { return connectors.tag(req.id).read(req) },
        delete: function (req, connectors) { return connectors.tag(req.id).delete(req) },
        save: function (req, connectors) { return connectors.tag(req.id).update(req) },
    },
}

changeView.fields = [
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
        watch: {
            for: 'name',
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
