
function pagination(res) {
    let nextPage = undefined
    if (res.data.page < res.data.pages) {
        nextPage = res.data.page + 1
    }
    // Return the pagination descriptor
    return {
        next: nextPage ? { page: nextPage } : undefined,
    }
}

function urlQuery(req) {
    return Object.assign({},
        req.filters,
        req.page,
        {
            ordering: req.sorting.map(field => {
                let prefix = field.sorted == 'ascending' ? '' : '-'
                return prefix + field.name
            }).join(',')
        }
    )
}

module.exports = [
    {
        id: 'users',
        url: 'users/',
        pagination,
        transform: {
            readResData: data => data.docs,
        },
    },
    {
        id: 'user',
        url: 'users/:_id/',
    },
    {
        id: 'categories',
        url: 'categories/',
        pagination,
        transform: {
            readResData: data => data.docs,
        },
    },
    {
        id: 'category',
        url: 'categories/:_id/',
    },
    {
        id: 'entries',
        url: 'entries/',
        pagination,
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
