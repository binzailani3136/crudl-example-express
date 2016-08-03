import { slugify } from '../utils'

//-------------------------------------------------------------------
var listView = {
    path: 'sections',
    title: 'Sections',
    actions: {
        /* counting the entries requires an additional API call per row. please note that the
        number of entries could be added at the database level, removing this additional call. */
        list: function (req) {
            return crudl.connectors.sections.read(req)
            .then(res => {
                // The result of the following line is an array of promises, where each promise resolves
                // to an array of entries associated with the item
                let promises = res.data.map(item => crudl.connectors.entries.read(req.filter('section', item._id)))
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
    },
}

listView.fields = [
    {
        name: '_id',
        label: 'ID',
    },
    {
        name: 'name',
        label: 'Name',
        main: true,
        sortable: true,
        sorted: 'ascending',
        sortpriority: '1',
        sortKey: 'slug',
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

//-------------------------------------------------------------------
var changeView = {
    path: 'sections/:_id',
    title: 'Section',
    actions: {
        get: function (req) { return crudl.connectors.section(crudl.path._id).read(req) },
        delete: function (req) { return crudl.connectors.section(crudl.path._id).delete(req) },
        save: function (req) { return crudl.connectors.section(crudl.path._id).update(req) },
    },
}

changeView.fields = [
    {
        name: 'name',
        label: 'Name',
        field: 'String',
        required: true
    },
    {
        name: 'slug',
        label: 'Slug',
        field: 'String',
        onChange: {
            in: 'name',
            setInitialValue: (name) => slugify(name.value),
        },
        props: {
            helpText: `If left blank, the slug will be automatically generated.
            More about slugs <a href="http://en.wikipedia.org/wiki/Slug" target="_blank">here</a>.`,
        }
    },
]

//-------------------------------------------------------------------
var addView = {
    path: 'sections/new',
    title: 'New Section',
    fields: changeView.fields,
    actions: {
        add: function (req) { return crudl.connectors.sections.create(req) },
    },
}


module.exports = {
    listView,
    changeView,
    addView,
}
