//-------------------------------------------------------------------
var login = {
    // path: 'login', // optional
    // title: 'Login', // optional
    actions: {
        login: function (req, cxs) { return cxs.auth_token.read(req) },
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
