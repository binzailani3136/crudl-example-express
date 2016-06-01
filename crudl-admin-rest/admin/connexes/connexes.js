
var pagination = require('./pagination')

module.exports = [
    {
        id: 'users',
        url: 'users/',
        transform: {
            readResData: data => data.docs,
        },
    },
    {
        id: 'user',
        url: 'users/:_id/',
    },
    {
        id: 'entries',
        url: 'entries/',
        transform: {
            readResData: data => data.docs,
        },
    },
    {
        id: 'entry',
        url: 'entries/:_id/',
    },
    {
        id: 'auth_token',
        url: 'api-token-auth/',
        mapping: { read: 'post', },
        transform: {
            readResData: data => ({
                requestHeaders: { "Authorization": `Token ${data.token}` },
                authInfo: data,
            })
        }
    }
]
