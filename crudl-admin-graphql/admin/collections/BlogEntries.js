//-------------------------------------------------------------------
var collection = {
    path: 'entries',
    title: 'Blog Entries',
    query: '',
    actions: {
        list: (req, connexes) => connexes.entries.read(req),
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
    {
        name: 'category',
        label: 'Category',
        key: 'category.name',
    },
]

//-------------------------------------------------------------------
collection.resource = {
    path: 'entries/:id',
    title: 'Blog Entry',
    tab: true,
    actions: {
        get: (req, connexes) => connexes.entry.read(req),
        delete: (req, connexes) => connexes.entry.delete(req),
        save: (req, connexes) => connexes.entry.update(req),
    },
}

//-------------------------------------------------------------------
collection.resource.fields = [
    {
        name: 'title',
        label: 'Title',
        field: 'String',
    },
    {
        name: 'category',
        key: 'category.id',
        label: 'Category',
        field: 'Autocomplete',
        // sync: true,
        actions: {
            asyncProps: (req, connexes) => connexes.categories_options.read(req),
        },
    },
    {
        name: 'date',
        label: 'Date',
        field: 'Date',
    },
    // {
    //     name: 'body',
    //     label: 'Text',
    //     field: 'Text',
    // },
    // {
    //     name: 'tags',
    //     label: 'Tags',
    //     field: 'Select',
    //     actions: {
    //         asyncProps: (req, connexes) => connexes.tags_options.read(req)
    //     },
    // },
]

//-------------------------------------------------------------------
collection.resource.add = {
    path: 'entries/new',
    title: 'New Blog Entry',
    fields: collection.resource.fields,
    actions: {
        add: (req, connexes) => connexes.entries.create(req),
    },
},

//-------------------------------------------------------------------
relation_links = {
    title: 'Links',
    tab: true,
    actions: {
        list: (req, connexes) => connexes.links.read(req),
    },
}

relation_links.fields = [
    {
        name: 'url',
        label: 'URL',
        field: 'String',
        props: () => ({
            link: true,
        }),
    },
    {
        name: 'title',
        label: 'Title',
        field: 'String',
    },
    {
        name: 'entry',
        label: 'Entry',
        field: 'String',
        props: (data) => ({
            link: data ? true : false,
            linkURL: data ? `/entries/${data.entry}` : undefined,
        }),
    },
]

// collection.resource.inlines = [relation_links]

//-------------------------------------------------------------------
collection.layout = {}

module.exports = collection
