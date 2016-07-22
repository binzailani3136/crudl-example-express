import { formatDate } from '../utils'

function transform(p, func) {
    return p.then(response => {
        return response.set('data', response.data.map(func))
    })
}

//-------------------------------------------------------------------
var listView = {
    path: 'entries',
    title: 'Blog Entries',
    actions: {
        list: function (req, connectors) {
            let entries = connectors.entries.read(req)
            /* here we add a custom column based on the currently logged-in user */
            // let entriesWithCustomColumn = transform(entries, (item) => {
            //     if (item.owner) {
            //         item.is_owner = req.authInfo.user == item.owner.originalId
            //     } else {
            //         item.is_owner = false
            //     }
            //     return item
            // })
            // return entriesWithCustomColumn
            return entries
        }
    },
}

listView.fields = [
    {
        name: 'section',
        key: 'section.name',
        label: 'Section',
    },
    {
        name: 'category',
        key: 'category.name',
        defaultValue: '',
        label: 'Category',
    },
    {
        name: 'title',
        label: 'Title',
        main: true,
        sortable: true,
        sorted: 'ascending',
        sortpriority: '1',
    },
    {
        name: 'status',
        label: 'Status',
    },
    {
        name: 'date',
        label: 'Date',
    },
    {
        name: 'sticky',
        label: 'Sticky',
        render: 'boolean',
    },
    {
        name: 'is_owner',
        label: 'Owner',
        render: 'boolean',
    },
    {
        name: 'counterLinks',
        label: 'No. Links',
        render: 'number',
    },
    {
        name: 'counterTags',
        label: 'No. Tags',
        render: 'number',
    },
]

listView.filters = {
    fields: [
        {
            name: 'section',
            label: 'Section',
            field: 'Select',
            props: (req, connectors) => connectors.sections_options.read(req).then(res => res.data),
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
                    setValue: '',
                    setProps: (section, req, connectors) => {
                        if (!section) {
                            return {
                                readOnly: !section,
                                helpText: !section ? 'In order to select a category, you have to select a section first' : 'Select a category',
                            }
                        }
                        // Get the catogories options filtered by section
                        return connectors.categories_options.read(req.filter('section', section))
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
        },
        {
            name: 'status',
            label: 'Status',
            field: 'Select',
            props: {
                options: [
                    {value: '0', label: 'Draft'},
                    {value: '1', label: 'Online'}
                ]
            },
        },
        {
            name: 'date',
            label: 'Published on',
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
            props: {
                options: [
                    {value: 'true', label: 'True'},
                    {value: 'false', label: 'False'}
                ],
                helpText: 'Note: We use Select in order to distinguish false and none.'
            }
        },
        {
            name: 'summary_Icontains',
            label: 'Search (Summary)',
            field: 'Search',
        },
    ]
}

listView.search = {
    name: 'title_Icontains',
}

//-------------------------------------------------------------------
var changeView = {
    path: 'entries/:_id',
    title: 'Blog Entry',
    actions: {
        get: function (req, connectors) { return connectors.entry(req.id).read(req) },
        delete: function (req, connectors) { return connectors.entry(req.id).delete(req) },
        save: function (req, connectors) { return connectors.entry(req.id).update(req) },
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
                props: {
                    options: [
                        {value: 'Draft', label: 'Draft'},
                        {value: 'Online', label: 'Online'}
                    ]
                },
            },
            {
                name: 'section',
                key: 'section._id',
                label: 'Section',
                field: 'Select',
                /* we set required to false, although this field is actually
                required with the API. */
                required: false,
                props: (req, connectors) => connectors.sections_options.read(req).then(res => ({
                    helpText: 'Select a section',
                    ...res.data
                }))
            },
            {
                name: 'category',
                key: 'category._id',
                label: 'Category',
                field: 'Autocomplete',
                required: false,
                props: {
                    showAll: true,
                    helpText: 'Select a category',
                },
                onChange: listView.filters.fields[1].onChange,
                actions: {
                    select: (req, connectors) => {
                        return Promise.all(req.data.selection.map(item => {
                            return connectors.category(item.value).read(req)
                            .then(res => res.set('data', {
                                value: res.data._id,
                                label: res.data.name,
                            }))
                        }))
                    },
                    search: (req, connectors) => {
                        if (!req.context.section) {
                            return Promise.resolve({data: []})
                        } else {
                            return connectors.categories.read(req
                                .filter('name_Icontains', req.data.query)
                                .filter('section', req.context.section))
                            .then(res => res.set('data', res.data.map(d => ({
                                value: d._id,
                                label: `<b>${d.name}</b> (${d.slug})`,
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
                props: {
                    formatDate: formatDate
                }
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
                        return 'The summary is required with status "Online".'
                    }
                }
            },
            {
                name: 'tags',
                key: 'tags[*]._id',
                label: 'Tags',
                field: 'AutocompleteMultiple',
                required: false,
                props: {
                    showAll: false,
                    helpText: 'Select a tag',
                },
                actions: {
                    search: (req, connectors) => {
                        return connectors.tags_options.read(req.filter('name_Icontains', req.data.query.toLowerCase()))
                        .then(res => res.set('data', res.data.options))
                    },
                    select: (req, connectors) => {
                        return Promise.all(req.data.selection.map(item => {
                            return connectors.tag(item.value).read(req)
                            .then(res => res.set('data', {
                                value: res.data._id,
                                label: res.data.name,
                            }))
                        }))
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
            }
        ]
    }
]

// changeView.tabs = [
//     {
//         title: 'Links',
//         actions: {
//             list: (req, connectors) => connectors.links.read(req.filter('entry', req.id)),
//             add: (req, connectors) => connectors.links.create(req),
//             save: (req, connectors) => connectors.link(req.data.id).update(req),
//             delete: (req, connectors) => connectors.link(req.data.id).delete(req)
//         },
//         itemTitle: '{url}',
//         fields: [
//             {
//                 name: 'url',
//                 label: 'URL',
//                 field: 'URL',
//                 props: {
//                     link: true,
//                 },
//             },
//             {
//                 name: 'title',
//                 label: 'Title',
//                 field: 'String',
//             },
//             {
//                 name: '_id',
//                 field: 'hidden',
//             },
//             {
//                 name: 'entry',
//                 field: 'hidden',
//                 initialValue: (context) => context.data.id,
//             },
//         ],
//     },
// ]

//-------------------------------------------------------------------
var addView = {
    path: 'entries/new',
    title: 'New Blog Entry',
    fieldsets: changeView.fieldsets,
    // validate: changeView.validate,
    actions: {
        add: function (req, connectors) { return connectors.entries.create(req) },
    },
    // denormalize: (data) => {
    //     /* set owner on add */
    //     if (crudl.authInfo.user) data.owner = crudl.authInfo.user
    //     return data
    // }
}

//-------------------------------------------------------------------
module.exports = {
    listView,
    addView,
    changeView,
}
