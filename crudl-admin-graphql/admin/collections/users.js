//-------------------------------------------------------------------
var listView = {
    path: 'users',
    title: 'Users',
    actions: {
        list: function (req, connectors) {
            return connectors.users.read(req)
        },
    },
    normalize: (list) => list.map(item => {
        if (!item.lastName) {
            item.fullName = item.firstName
        } else if (!item.firstName) {
            item.fullName = `<b>${item.lastName}</b>`
        } else {
            item.fullName = `<b>${item.lastName}</b>, ${item.firstName}`
        }
        return item
    })
}

listView.fields = [
    {
        name: 'originalId',
        label: 'ID',
    },
    {
        name: 'username',
        label: 'Username',
        main: true,
    },
    {
        name: 'fullName',
        label: 'Full name',
    },
    {
        name: 'email',
        label: 'Email address',
    },
    {
        name: 'isActive',
        label: 'Active',
        render: 'boolean',
    },
    {
        name: 'isStaff',
        label: 'Staff member',
        render: 'boolean',
    },
]

//-------------------------------------------------------------------
var changeView = {
    path: 'users/:id',
    title: 'User',
    actions: {
        get: function (req, connectors) { return connectors.user(req.id).read(req) },
        save: function (req, connectors) { return connectors.user(req.id).update(req) },
    },
    normalize: (data, error) => {
        if (error) {
            if (error.firstName)
                error.fullName = 'First name: ' + error.firstName
            if (error.lastName)
                error.fullName = 'Last name: ' + error.lastName
            throw error
        }
        // full_name
        data.fullName = data.lastName + ', ' + data.firstName
        data.fullName = data.fullName.replace(/(^, )|(, $)/, '')
        return data
    },
    denormalize: (data) => {
        let index = data.fullName.indexOf(',')
        if (index >= 0) {
            data.lastName = data.fullName.slice(0, index)
            data.firstName = data.fullName.slice(index+1)
        } else {
            data.lastName = ''
            data.firstName = ''
        }
        return data
    }
}

changeView.fieldsets = [
    {
        fields: [
            {
                name: 'id',
                field: 'hidden',
            },
            {
                name: 'username',
                label: 'Username',
                field: 'String',
            },
        ],
    },
    {
        fields: [
            {
                name: 'fullName',
                label: 'Name',
                field: 'String',
                validate: (value, allValues) => {
                    if (value && value.indexOf(',') < 0) {
                        return 'The required format is: LastName, FirstName'
                    }
                },
            },
            {
                name: 'email',
                label: 'Email address',
                field: 'String',
            }
        ],
    },
    {
        title: 'Roles',
        expanded: true,
        fields: [
            {
                name: 'isActive',
                label: 'Active',
                field: 'Checkbox',
                initialValue: true,
                props: {
                    helpText: 'Designates whether this user should be treated as active. Unselect this instead of deleting accounts.'
                },
            },
            {
                name: 'isStaff',
                label: 'Staff member',
                field: 'Checkbox',
                props: {
                    helpText: 'Designates whether the user can log into crudl.'
                },
            },
        ],
    },
    {
        title: 'More...',
        expanded: false,
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        fields: [
            {
                name: 'dateJoined',
                label: 'Date joined',
                readOnly: true,
                field: 'SplitDateTime',
                props: {
                    getTime: (date) => {
                        let T = date.indexOf('T')
                        return date.slice(T+1, T+6)
                    },
                    getDate: (date) => {
                        let T = date.indexOf('T')
                        return date.slice(0, T)
                    },
                }
            },
        ],
    },
    {
        title: 'Password',
        expanded: false,
        description: "Raw passwords are not stored, so there is no way to see this user's password, but you can set a new password.",
        fields: [
            {
                name: 'password',
                label: 'Password',
                field: 'Password',
            },
            {
                name: 'password_confirm',
                label: 'Password (Confirm)',
                field: 'Password',
                validate: (value, allValues) => {
                    if (value != allValues.password) {
                        return 'The passwords do not match.'
                    }
                }
            },
        ]
    }
]

//-------------------------------------------------------------------
var addView = {
    path: 'users/new',
    title: 'New User',
    fieldsets: changeView.fieldsets,
    actions: {
        add: function (req, connectors) { return connectors.users.create(req) },
    },
}


module.exports = {
    listView,
    changeView,
    addView,
}
