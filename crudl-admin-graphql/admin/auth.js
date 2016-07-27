
//-------------------------------------------------------------------
var login = {
    actions: {
        login: function (req) { return crudl.connectors.login.read(req) },
    },
}

login.fields = [
    {
        name: 'username',
        label: 'Username',
        field: 'Text',
    },
    {
        name: 'password',
        label: 'Password',
        field: 'Password',
    },
]

//-------------------------------------------------------------------
module.exports = {
    login,
}
