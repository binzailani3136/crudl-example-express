import { continuousPagination, urlQuery, transformErrors } from '../utils'

/**
* Transform helper. Takes care of errors and allows a quick definition of the
* data transformation for the read operation.
*/
function transform(readResponseData, other) {

    function transformResponse(res) {
        if (res.status >= 400) {
            throw (res.data ? transformErrors(res.data) : res)
        }
        return res
    }

    return {
        readResponse: transformResponse,
        createResponse: transformResponse,
        updateResponse: transformResponse,
        deleteResponse: transformResponse,
        readResponseData: readResponseData || (data => data),
        ...other,
    }
}


module.exports = [

    // USERS
    {
        id: 'users',
        url: 'users',
        urlQuery,
        pagination: continuousPagination,
        transform: transform(data => data.docs),
    },
    {
        id: 'user',
        url: 'users/:id',
        transform: transform(),
    },

    // SECTIONS
    {
        id: 'sections',
        url: 'sections',
        urlQuery,
        pagination: continuousPagination,
        transform: transform(data => data.docs),
    },
    {
        id: 'section',
        url: 'sections/:id',
        transform: transform(),
    },

    // CATEGORIES
    {
        id: 'categories',
        url: 'categories',
        urlQuery,
        pagination: continuousPagination,
        enableDepagination: true,
        transform: transform(data => data.docs),
    },
    {
        id: 'category',
        url: 'categories/:id',
        transform: transform(),
    },
    {
        id: 'allCategories',
        use: 'categories',
    },

    // TAGS
    {
        id: 'tags',
        url: 'tags',
        urlQuery,
        pagination: continuousPagination,
        transform: transform(data => data.docs),
    },
    {
        id: 'tag',
        url: 'tags/:id',
        transform: transform(),
    },

    // ENTRIES
    {
        id: 'entries',
        url: 'entries',
        urlQuery,
        pagination: continuousPagination,
        transform: {
            readResponseData: data => data.docs,
            /* set owner on add. alternatively, we could use denormalize with
            the descriptor, see collections/entries.js */
            createRequestData: data => {
                if (crudl.auth.user) data.owner = crudl.auth.user
                return data
            }
        },
    },
    {
        id: 'entry',
        url: 'entries/:id',
        transform: transform(),
    },

    // ENTRIELINKS
    {
        id: 'links',
        url: 'entrylinks',
        pagination: continuousPagination,
        enableDepagination: true,
        transform: transform(data => data.docs),
    },
    {
        id: 'link',
        url: 'entrylinks/:id',
        transform: transform(),
    },

    // SPECIAL CONNECTORS

    // sections_options
    // a helper for retrieving the sections used with select fields
    {
        id: 'sections_options',
        url: 'sections',
        urlQuery,
        transform: transform(data => ({
            options: data.docs.map(function(item) {
                return { value: item._id, label: item.name }
            }),
        })),
    },

    // category_options
    // a helper for retrieving the categories used with select fields
    {
        id: 'categories_options',
        url: 'categories',
        urlQuery,
        transform: transform(data => ({
            options: data.docs.map(function(item) {
                return { value: item._id, label: item.name }
            }),
        })),
    },

    // tags_options
    // a helper for retrieving the tags used with select fields
    {
        id: 'tags_options',
        url: 'tags',
        urlQuery,
        transform: transform(data => ({
            options: data.docs.map(function(item) {
                return { value: item._id, label: item.name }
            }),
        })),
    },

    // AUTHENTICATION
    {
        id: 'login',
        url: '/rest-api/login/',
        mapping: { read: 'post', },
        transform: transform(data => ({
            requestHeaders: { "Authorization": `Token ${data.token}` },
            info: data,
        })),
    },

]
