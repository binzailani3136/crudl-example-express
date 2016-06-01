//-------------------------------------------------------------------
var listView = {
    path: 'users',
    title: 'Users',
    actions: {
        list: function (req, connexes) { return connexes.users.read(req) },
    },
    normalize: (list) => list.map(item => {
        item.full_name = item.last_name + ', ' + item.first_name
        return item
    })
}

listView.fields = [
    {
        name: 'username',
        label: 'Username',
        main: true,
    },
    {
        name: 'full_name',
        label: 'Full name',
    },
    {
        name: 'email',
        label: 'Email address',
    },
    {
        name: 'is_staff',
        label: 'Staff member',
        render: 'boolean',
    },
    {
        name: 'is_active',
        label: 'Active',
        render: 'boolean',
    },
]

//-------------------------------------------------------------------
var changeView = {
    path: 'users/:_id/',
    title: 'User',
    actions: {
        get: function (req, connexes) { return connexes.user.read(req) },
        /* FIXME: delete should throw a warning with related objects (intermediary page) */
        delete: function (req, connexes) { return connexes.user.delete(req) },
        save: function (req, connexes) { return connexes.user.update(req) },
    },
    normalize: (data, error) => {
        if (error) {
            if (error.first_name) {
                error.full_name = 'First name: ' + error.first_name
            }
            throw error
        }
        data.full_name = data.last_name + ', ' + data.first_name
        return data
    },
    denormalize: (data) => {
        let index = data.full_name.indexOf(',')
        data.last_name = data.full_name.slice(0, index)
        data.first_name = data.full_name.slice(index+1)
        return data
    }
}

changeView.fields = [
    {
        name: 'username',
        label: 'Username',
        field: 'String',
    },
    {
        name: 'full_name',
        label: 'Name',
        field: 'String',
    },
    {
        name: 'email',
        label: 'Email address',
        field: 'String',
    },
    {
        name: 'is_staff',
        label: 'Staff member',
        field: 'Checkbox',
    },
    {
        name: 'is_active',
        label: 'Active',
        field: 'Checkbox',
    },
    /* FIXME: date_joined should be read only with the frontend */
    {
        name: 'date_joined',
        label: 'Date joined',
        field: 'Date',
    },
    /* FIXME: add field password with help_text explaining how
    to reset the password (custom page) */
]

//-------------------------------------------------------------------
var addView = {
    path: 'users/new',
    title: 'New User',
    fields: changeView.fields,
    actions: {
        add: function (req, connexes) { return connexes.users.create(req) },
    },
}


module.exports = {
    listView,
    changeView,
    addView,
}
