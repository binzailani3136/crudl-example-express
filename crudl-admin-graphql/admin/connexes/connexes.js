var pagination = require('./pagination')


module.exports = [
    {
        id: 'entries',
        url: '',
        query: `{allEntries{edges{node{id,title,date,category{id,name}}}}}`,
        transform: {
            readData: data => data.data.allEntries.edges.map(e => e.node)
        },
    },
    {
        id: 'entries_options',
        url: 'entries/',
        mapping: {
            read: 'options',
        }
    },
    {
        id: 'entry',
        url: '',
        query: `{entry(id: $id){id,title,date,category{id,name}}}`,
        transform: {
            readData: data => data.data.entry
        }
    },
    {
        id: 'categories',
        url: '',
        query: `{allCategories{edges{node{id,name}}}}`,
        transform: {
            readData: data => data.data.allCategories.edges.map(e => e.node)
        },
    },
    {
        id: 'categories_options',
        use: 'categories',
        transform: {
            readData: data => ({
                options: data.map(d => ({ label: d.name, value: d.id }))
            })
        },
    },
]
