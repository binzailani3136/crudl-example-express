import { formatDate, formatStringToDate, select } from '../utils'
import React from 'react'

//-------------------------------------------------------------------
var listView = {
    path: 'entries',
    title: 'Blog Entries',
    actions: {
        list: function (req) {
            return crudl.connectors.entries.read(req)
            .then(res => {
                /* counting the links requires an additional API call per row. please note that the
                number of links could be added at the database level, removing this additional call. */
                let promises = res.data.map(item => crudl.connectors.links.read(crudl.req().filter('entry', item._id)))
                return Promise.all(promises)
                .then(item_entrylinks => {
                    return res.set('data', res.data.map((item, index) => {
                        item.is_owner = false
                        if (item.owner) item.is_owner = crudl.auth.user == item.owner
                        item.counter_tags = item.tags.length
                        item.counter_links = item_entrylinks[index].data.length
                        return item
                    }))
                })
            })
        }
    },
    normalize: (list) => list.map(item => {
        item.date = formatStringToDate(item.date)
        return item
    })
}

listView.fields = [
    {
        name: '_id',
        label: 'ID',
    },
    {
        name: 'section',
        getValue: select('section.name'),
        label: 'Section',
        sortable: true,
    },
    {
        name: 'category',
        getValue: select('category.name'),
        label: 'Category',
        sortable: true,
    },
    {
        name: 'title',
        label: 'Title',
        main: true,
        sortable: true,
    },
    {
        name: 'status',
        label: 'Status',
        sortable: true,
    },
    {
        name: 'date',
        label: 'Date',
        sortable: true,
        sorted: 'descending',
        sortpriority: '2',
    },
    {
        name: 'sticky',
        label: 'Sticky',
        render: 'boolean',
        sortable: true,
        sorted: 'descending',
        sortpriority: '1',
    },
    {
        name: 'is_owner',
        label: 'Owner',
        render: 'boolean',
    },
    {
        name: 'counter_links',
        label: 'No. Links',
        render: 'number',
    },
    {
        name: 'counter_tags',
        label: 'No. Tags',
        render: 'number',
    },
]

listView.filters = {
    fields: [
        {
            name: 'search',
            label: 'Search',
            field: 'Search',
            helpText: 'Title'
        },
        {
            name: 'section',
            label: 'Section',
            field: 'Select',
            lazy: () => crudl.connectors.sections_options.read(crudl.req()).then(res => res.data),
        },
        {
            name: 'category',
            label: 'Category',
            field: 'Select',
            /* this field depends on section (so we add a watch function in
            order to react to any changes on the field section). */
            onChange: [
                {
                    in: 'section',
                    // set the value to '' if the user changed the section
                    setValue: (section) => (section.value !== section.initialValue) ? '' : undefined,
                    setProps: (section) => {
                        if (!section.value) {
                            return {
                                readOnly: true,
                                helpText: 'In order to select a category, you have to select a section first',
                            }
                        }
                        // Get the catogories options filtered by section
                        return crudl.connectors.categories_options.read(crudl.req().filter('section', section.value))
                        .then(res => {
                            if (res.data.options.length > 0) {
                                return {
                                    readOnly: false,
                                    helpText: 'Select a category',
                                    ...res.data,
                                }
                            } else {
                                return {
                                    readOnly: true,
                                    helpText: 'No categories available for the selected section.'
                                }
                            }
                        })
                    }
                }
            ],
            lazy: () => crudl.connectors.categories_options.read(crudl.req()).then(res => res.data)
        },
        {
            name: 'status',
            label: 'Status',
            field: 'Select',
            options: [
                {value: 'Draft', label: 'Draft'},
                {value: 'Online', label: 'Online'}
            ]
        },
        {
            name: 'date_gt',
            label: 'Published after',
            field: 'Date',
            /* simple date validation (please note that this is just a showcase,
            we know that it does not check for real dates) */
            validate: (value, allValues) => {
                const dateReg = /^\d{4}-\d{2}-\d{2}$/
                if (value && !value.match(dateReg)) {
                    return 'Please enter a date (YYYY-MM-DD).'
                }
            }
        },
        {
            name: 'sticky',
            label: 'Sticky',
            field: 'Select',
            options: [
                {value: 'true', label: 'True'},
                {value: 'false', label: 'False'}
            ],
            helpText: 'Note: We use Select in order to distinguish false and none.'
        },
        {
            name: 'search_summary',
            label: 'Search (Summary)',
            field: 'Search',
        },
    ]
}

//-------------------------------------------------------------------
var changeView = {
    path: 'entries/:_id',
    title: 'Blog Entry',
    tabtitle: 'Main',
    actions: {
        get: function (req) { return crudl.connectors.entry(crudl.path._id).read(req) },
        delete: function (req) { return crudl.connectors.entry(crudl.path._id).delete(req) },
        save: function (req) { return crudl.connectors.entry(crudl.path._id).update(req) },
    },
    normalize: (get) => {
        get.date = formatStringToDate(get.date)
        return get
    },
    validate: function (values) {
        if ((!values.category || values.category == "") && (!values.tags || values.tags.length == 0)) {
            return { _error: 'Either `Category` or `Tags` is required.' }
        }
    }
}

changeView.fieldsets = [
    {
        fields: [
            {
                name: '_id',
                field: 'hidden',
            },
            {
                name: 'title',
                label: 'Title',
                field: 'Text',
                required: true,
            },
            {
                name: 'status',
                label: 'Status',
                field: 'Select',
                required: true,
                initialValue: 'Draft',
                /* set options manually */
                options: [
                    {value: 'Draft', label: 'Draft'},
                    {value: 'Online', label: 'Online'}
                ]
            },
            {
                name: 'section',
                label: 'Section',
                field: 'Select',
                /* we set required to false, although this field is actually
                required with the API. */
                required: false,
                lazy: () => crudl.connectors.sections_options.read(crudl.req()).then(res => ({
                    helpText: 'Select a section',
                    ...res.data
                }))
            },
            {
                name: 'category',
                label: 'Category',
                field: 'Autocomplete',
                required: false,
                showAll: true,
                helpText: 'Select a category',
                onChange: listView.filters.fields[2].onChange,
                actions: {
                    select: (req) => {
                        return crudl.connectors.categories_options.read(req
                            .filter('idIn', req.data.selection.map(item => item.value).toString()))
                        .then(res => res.setData(res.data.options))
                        /* the code below is an alternative, if an id_in filter is not available
                        and if the options are build manually */
                        // return Promise.all(req.data.selection.map(item => {
                        //     return crudl.connectors.category(item.value).read(req)
                        //     .then(res => res.set('data', {
                        //         value: res.data._id,
                        //         label: res.data.name,
                        //     }))
                        // })).then(responses => ({ data: responses.map(r => r.data) }))
                    },
                    search: (req) => {
                        if (!crudl.context.data.section) {
                            return Promise.resolve({data: []})
                        } else {
                            return crudl.connectors.categories.read(req
                                .filter('name', req.data.query)
                                .filter('section', crudl.context.data.section))
                            .then(res => res.set('data', res.data.map(d => ({
                                value: d._id,
                                label: <span><b>{d.name}</b> ({d.slug})</span>,
                            }))))
                        }
                    },
                },
            },
        ],
    },
    {
        title: 'Content',
        expanded: true,
        fields: [
            {
                name: 'date',
                label: 'Date',
                field: 'Date',
                required: true,
                initialValue: () => formatDate(new Date()),
                formatDate: formatDate
            },
            {
                name: 'sticky',
                label: 'Sticky',
                field: 'Checkbox',
            },
            {
                name: 'summary',
                label: 'Summary',
                field: 'Textarea',
                validate: (value, allValues) => {
                    if (!value && allValues.status == 'Online') {
                        return 'The summary is required with status "Online".'
                    }
                }
            },
            {
                name: 'body',
                label: 'Body',
                field: 'Textarea',
                validate: (value, allValues) => {
                    if (!value && allValues.status == 'Online') {
                        return 'The body is required with status "Online".'
                    }
                }
            },
            {
                name: 'tags',
                label: 'Tags',
                field: 'AutocompleteMultiple',
                required: false,
                showAll: false,
                helpText: 'Select a tag',
                actions: {
                    search: (req) => {
                        return crudl.connectors.tags_options.read(req.filter('name', req.data.query.toLowerCase()))
                        .then(res => res.set('data', res.data.options))
                    },
                    select: (req) => {
                        return crudl.connectors.tags_options.read(req
                            .filter('idIn', req.data.selection.map(item => item.value).toString()))
                        .then(res => res.setData(res.data.options))
                    },
                },
            }
        ]
    },
    {
        title: 'Internal',
        expanded: false,
        fields: [
            {
                name: 'createdate',
                label: 'Date (Create)',
                field: 'Datetime',
                readOnly: true
            },
            {
                name: 'updatedate',
                label: 'Date (Update)',
                field: 'Datetime',
                readOnly: true
            },
        ]
    }
]

changeView.tabs = [
    {
        title: 'Links',
        actions: {
            list: (req) => crudl.connectors.links.read(req.filter('entry', crudl.path._id)),
            add: (req) => crudl.connectors.links.create(req),
            save: (req) => crudl.connectors.link(req.data._id).update(req),
            delete: (req) => crudl.connectors.link(req.data._id).delete(req)
        },
        itemTitle: '{url}',
        fields: [
            {
                name: 'url',
                label: 'URL',
                field: 'URL',
                link: true,
            },
            {
                name: 'title',
                label: 'Title',
                field: 'String',
            },
            {
                name: '_id',
                field: 'hidden',
            },
            {
                name: 'entry',
                field: 'hidden',
                initialValue: () => crudl.context.data._id,
            },
        ],
    },
]

//-------------------------------------------------------------------
var addView = {
    path: 'entries/new',
    title: 'New Blog Entry',
    fieldsets: changeView.fieldsets,
    validate: changeView.validate,
    actions: {
        add: function (req) { return crudl.connectors.entries.create(req) },
    },
    denormalize: (data) => {
        /* set owner on add. alternatively, we could manipulate the data
        with the connector by using createRequestData (see connectors.js) */
        if (crudl.auth.user) data.owner = crudl.auth.user
        return data
    }
}

//-------------------------------------------------------------------
module.exports = {
    listView,
    addView,
    changeView,
}
