
// Credits for this function go to https://gist.github.com/mathewbyrne
function slugify(text) {
    return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

//-------------------------------------------------------------------
var listView = {
    path: 'categories',
    title: 'Categories',
    actions: {
        list: function (req, cxs) { return cxs.categories.read(req) },
    },
}

listView.fields = [
    {
        name: 'name',
        label: 'Name',
        main: true,
    },
    {
        name: 'slug',
        label: 'Slug',
    },
    {
        name: 'user',
        label: 'User',
    },
]

listView.filters = {
    fields: [
        {
            name: 'user',
            label: 'User',
            field: 'Select',
            actions: {
                asyncProps: (req, cxs) => cxs.users.read(req)
                .then(res => res.set('data', {'options': res.data.map(user => ({
                    value: user._id,
                    label: user.username,
                }))}))
            },
            initialValue: '',
        },
    ]
}

//-------------------------------------------------------------------
var changeView = {
    path: 'categories/:_id/',
    title: 'Category',
    actions: {
        get: function (req, cxs) { return cxs.category.read(req) },
        delete: function (req, cxs) { return cxs.category.delete(req) },
        save: function (req, cxs) { return cxs.category.update(req) },
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
        watch: {
            for: 'name',
            setInitialValue: (name) => slugify(name),
        },
        props: {
            helpText: 'If left blank, the slug will be automatically generated.'
        }
    },
    {
        name: 'user',
        label: 'User',
        field: 'Autocomplete',
        props: {
            helpText: 'Help!'
        },
        actions: {
            select: (req, cxs) => {
                return Promise.all(req.data.selection.map(item => {
                    return cxs.user.read(req.with('_id', item.value))
                    .then(res => res.set('data', {
                        value: res.data._id,
                        label: res.data.username,
                    }))
                }))
            },
            search: (req, cxs) => {
                return cxs.users.read(req.filter('username', req.data.query))
                .then(res => res.set('data', res.data.map(user => ({
                    value: user._id,
                    label: user.username,
                }))))
            }
        }
    },
]

//-------------------------------------------------------------------
var addView = {
    path: 'categories/new',
    title: 'New Category',
    fields: changeView.fields,
    actions: {
        add: function (req, cxs) { return cxs.categories.create(req) },
    },
}


module.exports = {
    listView,
    changeView,
    addView,
}
