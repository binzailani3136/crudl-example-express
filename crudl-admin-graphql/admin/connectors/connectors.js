import { continuousPagination, listQuery, transformErrors } from '../utils'


module.exports = {

    // USERS
    users: {
        query: {
            read: listQuery({
                name: 'allUsers',
                fields: '_id, username, first_name, last_name, email, is_active, is_staff, date_joined',
                args: { first: 20 }
            }),
            create: `mutation ($input: UserInput!) {
                addUser(data: $input) {
                    errors
                    user {_id, username, first_name, last_name, email, is_active, is_staff, date_joined}
                }
            }`,
        },
        pagination: continuousPagination,
        transform: {
            readResponseData: data => data.data.allUsers.edges.map(e => e.node),
            createResponseData: data => {
                if (data.data.addUser.errors) {
                    throw new crudl.ValidationError(transformErrors(data.data.addUser.errors))
                }
                return data.data.addUser.user
            },
        },
    },
    user: {
        query: {
            read: `{user(id: "%_id"){_id, username, first_name, last_name, email, is_active, is_staff, date_joined}}`,
            update: `mutation ($input: UserInput!) {
                changeUser(id: "%_id", data: $input) {
                    errors
                    user {_id, username, first_name, last_name, email, is_active, is_staff, date_joined}
                }
            }`,
            delete: `mutation { deleteUser(id: "%_id") { deleted } }`,
        },
        transform: {
            readResponseData: data => {
                if (!data.data.user) {
                    throw new crudl.NotFoundError('The requested user was not found')
                }
                return data.data.user
            },
            updateResponseData: data => {
                if (data.data.changeUser.errors) {
                    throw new crudl.ValidationError(transformErrors(data.data.changeUser.errors))
                }
                return data.data.changeUser.user
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // SECTIONS
    sections: {
        query: {
            read: listQuery({
                name: 'allSections',
                fields: '_id, name, slug, position',
                args: { first: 20 }
            }),
            create: `mutation ($input: SectionInput!) {
                addSection(data: $input) {
                    errors
                    section {_id, name, slug, position}
                }
            }`,
        },
        pagination: continuousPagination,
        transform: {
            readResponseData: data => data.data.allSections.edges.map(e => e.node),
            createResponseData: data => {
                if (data.data.addSection.errors) {
                    throw new crudl.ValidationError(transformErrors(data.data.addSection.errors))
                }
                return data.data.addSection.section
            },
        },
    },
    section: {
        query: {
            read: `{section(id: "%_id"){_id, name, slug, position}}`,
            update: `mutation ($input: SectionInput!) {
                changeSection(id: "%_id", data: $input) {
                    errors
                    section {_id, name, slug, position}
                }
            }`,
            delete: `mutation { deleteSection(id: "%_id") { deleted } }`,
        },
        transform: {
            readResponseData: data => {
                if (!data.data.section) {
                    throw new crudl.NotFoundError('The requested section was not found')
                }
                return data.data.section
            },
            updateResponseData: data => {
                if (data.data.changeSection.errors) {
                    throw new crudl.ValidationError(transformErrors(data.data.changeSection.errors))
                }
                return data.data.changeSection.section
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // CATEGORIES
    categories: {
        query: {
            read: listQuery({
                name: 'allCategories',
                fields: '_id, section{_id, name}, name, slug, position',
                args: { first: 20 }
            }),
            create: `mutation ($input: CategoryInput!) {
                addCategory(data: $input) {
                    errors
                    category {_id, section{_id, name}, name, slug, position}
                }
            }`,
        },
        pagination: continuousPagination,
        transform: {
            readResponseData: data => data.data.allCategories.edges.map(e => e.node),
            createResponseData: data => {
                if (data.data.addCategory.errors) {
                    throw new crudl.ValidationError(transformErrors(data.data.addCategory.errors))
                }
                return data.data.addCategory.category
            },
        },
    },
    category: {
        query: {
            read: `{category(id: "%_id"){_id, section{_id, name}, name, slug, position}}`,
            update: `mutation ($input: CategoryInput!) {
                changeCategory(id: "%_id", data: $input) {
                    errors
                    category {_id, section{_id, name}, name, slug, position}
                }
            }`,
            delete: `mutation { deleteCategory(id: "%_id") { deleted } }`,
        },
        transform: {
            readResponseData: data => {
                if (!data.data.category) {
                    throw new crudl.NotFoundError('The requested category was not found')
                }
                return data.data.category
            },
            updateResponseData: data => {
                if (data.data.changeCategory.errors) {
                    throw new crudl.ValidationError(transformErrors(data.data.changeCategory.errors))
                }
                return data.data.changeCategory.category
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // TAGS
    tags: {
        query: {
            read: listQuery({
                name: 'allTags',
                fields: '_id, name, slug',
                args: { first: 20 }
            }),
            create: `mutation ($input: TagInput!) {
                addTag(data: $input) {
                    errors
                    tag {_id, name, slug}
                }
            }`,
        },
        pagination: continuousPagination,
        transform: {
            readResponseData: data => data.data.allTags.edges.map(e => e.node),
            createResponseData: data => {
                if (data.data.addTag.errors) {
                    throw new crudl.ValidationError(transformErrors(data.data.addTag.errors))
                }
                return data.data.addTag.tag
            },
        },
    },
    tag: {
        query: {
            read: `{tag(id: "%_id"){_id, name, slug}}`,
            update: `mutation ($input: TagInput!) {
                changeTag(id: "%_id", data: $input) {
                    errors
                    tag {_id, name, slug}
                }
            }`,
            delete: `mutation { deleteTag(id: "%_id") { deleted } }`,
        },
        transform: {
            readResponseData: data => {
                if (!data.data.tag) {
                    throw new crudl.NotFoundError('The requested tag was not found')
                }
                return data.data.tag
            },
            updateResponseData: data => {
                if (data.data.changeTag.errors) {
                    throw new crudl.ValidationError(transformErrors(data.data.changeTag.errors))
                }
                return data.data.changeTag.tag
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // ENTRIES
    entries: {
        query: {
            read: listQuery({
                name: 'allEntries',
                fields: '_id, title, status, date, sticky, section{_id, name}, category{_id, name}, owner{_id, username}, tags{_id}',
                args: { first: 20 }
            }),
            create: `mutation ($input: EntryInput!) {
                addEntry(data: $input) {
                    errors
                    entry {_id, title, status, date, sticky, section{_id, name}, category{_id, name}, summary, body, owner{_id, username}, createdate, updatedate}
                }
            }`,
        },
        pagination: continuousPagination,
        transform: {
            readResponseData: data => data.data.allEntries.edges.map(e => e.node),
            /* set owner on add. alternatively, we could use denormalize with
            the descriptor, see collections/entries.js */
            createRequestData: data => {
                if (crudl.auth.user) data.owner = crudl.auth.user
                return data
            },
            createResponseData: data => {
                if (data.data.addEntry.errors) {
                    throw new crudl.ValidationError(transformErrors(data.data.addEntry.errors))
                }
                return data.data.addEntry.entry
            },
        },
    },
    entry: {
        query: {
            read: `{entry(id: "%_id"){_id, title, status, date, sticky, section{_id, name}, category{_id, name}, tags{_id, name}, summary, body, owner{_id, username}, createdate, updatedate}}`,
            update: `mutation ($input: EntryInput!) {
                changeEntry(id: "%_id", data: $input) {
                    errors
                    entry {_id, title, status, date, sticky, section{_id, name}, category{_id, name}, tags{_id, name}, summary, body, owner{_id, username}, createdate, updatedate}
                }
            }`,
            delete: `mutation { deleteEntry(id: "%_id") { deleted } }`,
        },
        transform: {
            readResponseData: data => {
                if (!data.data.entry) {
                    throw new crudl.NotFoundError('The requested entry was not found')
                }
                return data.data.entry
            },
            updateResponseData: data => {
                if (data.data.changeEntry.errors) {
                    throw new crudl.ValidationError(transformErrors(data.data.changeEntry.errors))
                }
                return data.data.changeEntry.entry
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // ENTRYLINKS
    links: {
        query: {
            read: listQuery({
                name: 'allEntryLinks',
                fields: '_id, entry{_id}, url, title, description, position',
            }),
            create: `mutation ($input: EntryLinkInput!) {
                addEntryLink(data: $input) {
                    errors
                    entrylink {_id, entry{_id}, url, title, description, position}
                }
            }`,
        },
        transform: {
            readResponseData: data => data.data.allEntryLinks.edges.map(e => e.node),
            createResponseData: data => {
                if (data.data.addEntryLink.errors) {
                    throw new crudl.ValidationError(transformErrors(data.data.addEntryLink.errors))
                }
                return data.data.addEntryLink.entrylink
            },
        },
    },
    link: {
        query: {
            read: `{entrylink(id: "%_id"){_id, entry{_id}, url, title, description, position}}`,
            update: `mutation ($input: EntryLinkInput!) {
                changeEntryLink(id: "%_id", data: $input) {
                    errors
                    entrylink {_id, entry{_id}, url, title, description, position}
                }
            }`,
            delete: `mutation { deleteEntryLink(id: "%_id") { deleted } }`,
        },
        transform: {
            readResponseData: data => {
                if (!data.data.entrylink) {
                    throw new crudl.NotFoundError('The requested entrylink was not found')
                }
                return data.data.entrylink
            },
            updateResponseData: data => {
                if (data.data.changeEntryLink.errors) {
                    throw new crudl.ValidationError(transformErrors(data.data.changeEntryLink.errors))
                }
                return data.data.changeEntryLink.entrylink
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // SPECIAL CONNECTORS

    // sections_options
    // a helper for retrieving the sections used with select fields
    sections_options: {
        query: {
            read: `{allSections{edges{node{_id, name}}}}`,
        },
        transform: {
            readResponseData: data => ({
                options: data.data.allSections.edges.map(function(item) {
                    return { value: item.node._id, label: item.node.name }
                }),
            })
        },
    },

    // category_options
    // a helper for retrieving the categories used with select fields
    categories_options: {
        query: {
            read: listQuery({
                name: 'allCategories',
                fields: '_id, name, slug'
            }),
        },
        transform: {
            readResponseData: data => ({
                options: data.data.allCategories.edges.map(function(item) {
                    return { value: item.node._id, label: item.node.name }
                }),
            })
        },
    },

    // tags_options
    // a helper for retrieving the tags used with select fields
    tags_options: {
        query: {
            read: listQuery({
                name: 'allTags',
                fields: '_id, name'
            }),
        },
        transform: {
            readResponseData: data => ({
                options: data.data.allTags.edges.map(function(item) {
                    return { value: item.node._id, label: item.node.name }
                }),
            })
        },
    },

    // AUTHENTICATION
    login: {
        url: '/rest-api/login/',
        mapping: { read: 'post', },
        transform: {
            readResponse: res => {
                if (res.status >= 400) {
                    throw new crudl.ValidationError(res.data)
                }
                return res
            },
            readResponseData: data => ({
                requestHeaders: { "Authorization": `Token ${data.token}` },
                info: data,
            })
        }
    }
}
