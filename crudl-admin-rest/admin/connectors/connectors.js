import { continuousPagination, urlQuery, transformErrors } from '../utils'

module.exports = [

    // USERS
    {
        id: 'users',
        url: 'users',
        urlQuery,
        pagination: continuousPagination,
        transform: { readResponseData: data => data.docs },
    },
    {
        id: 'user',
        url: 'users/:id',
        transformErrors,
    },

    // SECTIONS
    {
        id: 'sections',
        url: 'sections',
        urlQuery,
        pagination: continuousPagination,
        transform: { readResponseData: data => data.docs },
    },
    {
        id: 'section',
        url: 'sections/:id',
        transformErrors,
    },

    // CATEGORIES
    {
        id: 'categories',
        url: 'categories',
        urlQuery,
        pagination: continuousPagination,
        enableDepagination: true,
        transform: { readResponseData: data => data.docs },
    },
    {
        id: 'category',
        url: 'categories/:id',
        transformErrors,
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
        transform: { readResponseData: data => data.docs },
    },
    {
        id: 'tag',
        url: 'tags/:id',
        transformErrors,
    },

    // ENTRIES
    {
        id: 'entries',
        url: 'entries',
        urlQuery,
        pagination: continuousPagination,
        transform: { readResponseData: data => data.docs },
    },
    {
        id: 'entry',
        url: 'entries/:id',
        transformErrors,
    },

    // ENTRIELINKS
    {
        id: 'links',
        url: 'entrylinks',
        pagination: continuousPagination,
        enableDepagination: true,
        transform: { readResponseData: data => data.docs },
    },
    {
        id: 'link',
        url: 'entrylinks/:id',
        transformErrors,
    },

    // SPECIAL CONNECTORS

    // sections_options
    // a helper for retrieving the sections used with select fields
    {
        id: 'sections_options',
        url: 'sections',
        urlQuery,
        transform: {
            readResponseData: data => ({
                options: data.docs.map(function(item) {
                    return { value: item._id, label: item.name }
                }),
            })
        },
    },

    // category_options
    // a helper for retrieving the categories used with select fields
    {
        id: 'categories_options',
        url: 'categories',
        urlQuery,
        transform: {
            readResponseData: data => ({
                options: data.docs.map(function(item) {
                    return { value: item._id, label: item.name }
                }),
            })
        },
    },

    // tags_options
    // a helper for retrieving the tags used with select fields
    {
        id: 'tags_options',
        url: 'tags',
        urlQuery,
        transform: {
            readResponseData: data => ({
                options: data.docs.map(function(item) {
                    return { value: item._id, label: item.name }
                }),
            })
        },
    },

    // AUTHENTICATION
    {
        id: 'login',
        url: 'login',
        mapping: { read: 'post', },
        transform: {
            readResponseData: data => ({
                requestHeaders: { "Authorization": `Token ${data.token}` },
                info: data,
            })
        },
        transformErrors,
    },

]
