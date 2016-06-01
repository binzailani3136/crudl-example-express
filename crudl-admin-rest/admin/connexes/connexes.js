
var pagination = require('./pagination')

module.exports = [
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
    }
]
