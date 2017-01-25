import { numberedPagination, urlQuery, transformErrors } from '../utils'

/**
* Transform helper. Takes care of errors and allows a quick definition of the
* data transformation for the read operation.
*/
function transform(readResponseData, other) {

    function transformResponse(res) {
        if (res.status === 400) {
            throw new crudl.ValidationError(transformErrors(res.data))
        }
        if (!res.data) {
            throw new crudl.NotFoundError(`Couldn't find ${res.url}`)
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


module.exports = {

    // USERS
    users: {
        url: 'users',
        urlQuery,
        pagination: numberedPagination,
        transform: transform(data => data.docs),
    },
    user: {
        url: 'users/:id',
        transform: transform(),
    },

    // SECTIONS
    sections: {
        url: 'sections',
        urlQuery,
        pagination: numberedPagination,
        transform: transform(data => data.docs),
    },
    section: {
        url: 'sections/:id',
        transform: transform(),
    },

    // CATEGORIES
    categories: {
        url: 'categories',
        urlQuery,
        pagination: numberedPagination,
        enableDepagination: true,
        transform: transform(data => data.docs),
    },
    category: {
        url: 'categories/:id',
        transform: transform(),
    },
    // TAGS
    tags: {
        url: 'tags',
        urlQuery,
        pagination: numberedPagination,
        transform: transform(data => data.docs),
    },
    tag: {
        url: 'tags/:id',
        transform: transform(),
    },

    // ENTRIES
    entries: {
        url: 'entries',
        urlQuery,
        pagination: numberedPagination,
        transform: transform(data => data.docs, {
            /* set owner on add. alternatively, we could use denormalize with
            the descriptor, see views/entries.js */
            createRequestData: data => {
                if (crudl.auth.user) data.owner = crudl.auth.user
                return data
            }
        })
    },
    entry: {
        url: 'entries/:id',
        transform: transform(),
    },

    // ENTRIELINKS
    links: {
        url: 'entrylinks',
        pagination: numberedPagination,
        enableDepagination: true,
        transform: transform(data => data.docs),
    },
    link: {
        url: 'entrylinks/:id',
        transform: transform(),
    },

    // SPECIAL CONNECTORS

    // sections_options
    // a helper for retrieving the sections used with select fields
    sections_options: {
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
    categories_options: {
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
    tags_options: {
        url: 'tags',
        urlQuery,
        transform: transform(data => ({
            options: data.docs.map(function(item) {
                return { value: item._id, label: item.name }
            }),
        })),
    },

    // AUTHENTICATION
    login: {
        url: '/rest-api/login/',
        mapping: { read: 'post', },
        transform: transform(data => ({
            requestHeaders: { "Authorization": `Token ${data.token}` },
            info: data,
        })),
    },

}
