//-------------------------------------------------------------------
var login = {
    // path: 'login', // optional
    // title: 'Login', // optional
    actions: {
        login: function (req, connectors) { return connectors.login.read(req) },
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
