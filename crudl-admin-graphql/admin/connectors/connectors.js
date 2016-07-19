function pagination(res) {
    let key = Object.keys(res.data.data)[0]
    let hasNext = res.data.data[key].pageInfo.hasNextPage
    let next = hasNext && {
        after: res.data.data[key].pageInfo.endCursor
    }
    return { next }
}

function objectToArgs(object) {
    let args = Object.getOwnPropertyNames(object).map(name => {
        return `${name}: ${JSON.stringify(object[name])}`
    }).join(', ')
    return args ? `(${args})` : ''
}

function listQuery(options) {
    return (req) => {
        let args = objectToArgs(Object.assign({}, options.args, req.page, req.filters))
        return `{
            ${options.name} ${args} {
                pageInfo { hasNextPage, hasPreviousPage, startCursor, endCursor }
                edges { node { ${options.fields} }}
            }
        }`
    }
}

module.exports = [

    // USERS
    {
        id: 'users',
        query: {
            read: `{users{_id, username, first_name, last_name, email, is_active, is_staff, date_joined}}`,
            // read: listQuery({
            //     name: 'users',
            //     fields: 'id, originalId, username, firstName, lastName, email, isActive, isStaff, dateJoined'
            // }),
        },
        // pagination,
        transform: {
            readResponseData: data => data.data.users
        },
    },
    {
        id: 'user',
        query: {
            read: `{user(id: "%_id"){_id, username, first_name, last_name, email, is_active, is_staff, date_joined}}`,
            update: `mutation ($input: ChangeSectionInput!) {
                changeSection(input: $input) {
                    errors
                    section {id, name, slug, position}
                }
            }`,
            delete: `mutation ($input: DeleteSectionInput!) {
                deleteSection(input: $input) {
                    deleted
                }
            }`,
        },
        transform: {
            readResponseData: data => data.data.user,
            updateResponseData: data => {
                if (data.data.changeUser.errors) {
                    throw data.data.changeUser.errors
                }
                return data.data.changeUser.section
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // SECTIONS
    {
        id: 'sections',
        query: {
            read: `{sections{_id, name, slug, position}}`,
            create: `mutation ($input: CreateSectionInput!) {
                createSection(input: $input) {
                    errors
                    section {_id, name, slug, position}
                }
            }`,
        },
        // pagination,
        transform: {
            readResponseData: data => {
                console.log("XXX", data)
                return data.data.sections
            }
            // createResponseData: data => {
            //     if (data.data.createSection.errors) {
            //         throw data.data.createSection.errors
            //     }
            //     return data.data.createSection.section
            // },
        },
    },
    {
        id: 'section',
        query: {
            read: `{section(id: "%_id"){_id, name, slug, position}}`,
            update: `mutation ($input: ChangeSectionInput!) {
                changeSection(input: $input) {
                    errors
                    section {id, name, slug, position}
                }
            }`,
            delete: `mutation ($input: DeleteSectionInput!) {
                deleteSection(input: $input) {
                    deleted
                }
            }`,
        },
        transform: {
            readResponseData: data => data.data.section,
            updateResponseData: data => {
                if (data.data.changeSection.errors) {
                    throw data.data.changeSection.errors
                }
                return data.data.changeSection.section
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // CATEGORIES
    {
        id: 'categories',
        query: {
            read: `{categories{_id, section, name, slug, position}}`,
            // read: listQuery({
            //     name: 'categories',
            //     fields: 'id, originalId, section{id,name}, name, slug, position, counterEntries',
            //     args: { first: 20, orderBy: "name" }
            // }),
            create: `mutation ($input: CreateCategoryInput!) {
                createCategory(input: $input) {
                    errors
                    category {id, section{id,name}, name, slug, position}
                }
            }`,
        },
        // pagination,
        transform: {
            readResponseData: data => data.data.categories,
            createResponseData: data => {
                if (data.data.createCategory.errors) {
                    throw data.data.createCategory.errors
                }
                return data.data.createCategory.category
            },
        },
    },
    {
        id: 'category',
        query: {
            read: `{category(id: "%_id"){_id, section, name, slug, position}}`,
            update: `mutation ($input: ChangeCategoryInput!) {
                changeCategory(input: $input) {
                    errors
                    category {id, section{id,name}, name, slug, position}
                }
            }`,
            delete: `mutation ($input: DeleteCategoryInput!) {
                deleteCategory(input: $input) {
                    deleted
                }
            }`,
        },
        transform: {
            readResponseData: data => data.data.category,
            updateResponseData: data => {
                if (data.data.changeCategory.errors) {
                    throw data.data.changeCategory.errors
                }
                return data.data.changeCategory.category
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // TAGS
    {
        id: 'tags',
        query: {
            read: `{tags{_id, name, slug}}`,
            // read: listQuery({
            //     name: 'tags',
            //     fields: 'id, originalId, name, slug, counterEntries',
            //     args: { first: 20, orderBy: "name" }
            // }),
            create: `mutation ($input: CreateTagInput!) {
                createTag(input: $input) {
                    errors
                    tag {id, name, slug}
                }
            }`,
        },
        // pagination,
        transform: {
            readResponseData: data => data.data.tags,
            createResponseData: data => {
                if (data.data.createTag.errors) {
                    throw data.data.createTag.errors
                }
                return data.data.createTag.tag
            },
        },
    },
    {
        id: 'tag',
        query: {
            read: `{tag(id: "%_id"){_id, name, slug}}`,
            update: `mutation ($input: ChangeTagInput!) {
                changeTag(input: $input) {
                    errors
                    tag {id, name, slug}
                }
            }`,
            delete: `mutation ($input: DeleteTagInput!) {
                deleteTag(input: $input) {
                    deleted
                }
            }`,
        },
        transform: {
            readResponseData: data => data.data.tag,
            updateResponseData: data => {
                if (data.data.changeTag.errors) {
                    throw data.data.changeTag.errors
                }
                return data.data.changeTag.tag
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // ENTRIES
    {
        id: 'entries',
        query: {
            read: `{entries{_id, title, status, date, sticky, section{_id, name}, category{_id, name}, owner{_id, username}}}`,
            // read: listQuery({
            //     name: 'entries',
            //     fields: 'id, originalId, title, status, date, sticky, section{id, name}, category{id, name}, owner{id, originalId, username}, counterLinks, counterTags',
            //     args: { first: 20, orderBy: "title" }
            // }),
            create: `mutation ($input: CreateEntryInput!) {
                createEntry(input: $input) {
                    errors
                    entry {id, title, status, date, sticky, section{id, name}, category{id, name}, summary, body, owner{id, username}, createdate, updatedate}
                }
            }`,
        },
        // pagination,
        transform: {
            readResponseData: data => data.data.entries,
            createResponseData: data => {
                if (data.data.createEntry.errors) {
                    throw data.data.createEntry.errors
                }
                return data.data.createEntry.entry
            },
        },
    },
    {
        id: 'entry',
        query: {
            read: `{entry(id: "%_id"){_id, title, status, date, sticky, section{_id, name}, category{_id, name}, tags{_id, name}, summary, body, owner{_id, username}}}`,
            update: `mutation ($input: ChangeEntryInput!) {
                changeEntry(input: $input) {
                    errors
                    entry {id, title, status, date, sticky, section{id, name}, category{id, name}, tags{id, name}, summary, body, owner{id, username}, createdate, updatedate}
                }
            }`,
            delete: `mutation ($input: DeleteEntryInput!) {
                deleteEntry(input: $input) {
                    deleted
                }
            }`,
        },
        transform: {
            readResponseData: data => data.data.entry,
            updateResponseData: data => {
                if (data.data.changeEntry.errors) {
                    throw data.data.changeEntry.errors
                }
                return data.data.changeEntry.entry
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // ENTRYLINKS
    {
        id: 'links',
        query: {
            read: listQuery({
                name: 'links',
                fields: 'id, entry{id}, url, title, description, position',
            }),
            create: `mutation ($input: CreateEntrylinkInput!) {
                createEntrylink(input: $input) {
                    errors
                    entrylink {id, entry{id}, url, title, description, position}
                }
            }`,
        },
        transform: {
            readResponseData: data => data.data.links.edges.map(e => e.node),
            createResponseData: data => {
                if (data.data.createEntrylink.errors) {
                    throw data.data.createEntrylink.errors
                }
                return data.data.createEntrylink.entrylink
            },
        },
    },
    {
        id: 'link',
        query: {
            read: `{link(id: "%id"){id, entry{id}, url, title, description, position}}`,
            update: `mutation ($input: ChangeEntrylinkInput!) {
                changeEntrylink(input: $input) {
                    errors
                    entrylink {id, entry{id}, url, title, description, position}
                }
            }`,
            delete: `mutation ($input: DeleteEntrylinkInput!) {
                deleteEntrylink(input: $input) {
                    deleted
                }
            }`,
        },
        transform: {
            readResponseData: data => data.data.entrylink,
            updateResponseData: data => {
                if (data.data.changeEntrylink.errors) {
                    throw data.data.changeEntrylink.errors
                }
                return data.data.changeEntrylink.entrylink
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // SPECIAL CONNECTORS

    // sections_options
    // a helper for retrieving the sections used with select fields
    {
        id: 'sections_options',
        query: {
            read: `{sections{edges{node{id, name}}}}`,
        },
        transform: {
            readResponseData: data => ({
                options: data.data.sections.edges.map(function(item) {
                    return { value: item.node.id, label: item.node.name }
                }),
            })
        },
    },

    // category_options
    // a helper for retrieving the categories used with select fields
    {
        id: 'categories_options',
        query: {
            read: `{categories{edges{node{id, name}}}}`,
        },
        transform: {
            readResponseData: data => ({
                options: data.data.categories.edges.map(function(item) {
                    return { value: item.node.id, label: item.node.name }
                }),
            })
        },
    },

    // tags_options
    // a helper for retrieving the tags used with select fields
    {
        id: 'tags_options',
        query: {
            read: `{tags{edges{node{id, name}}}}`,
        },
        transform: {
            readResponseData: data => ({
                options: data.data.tags.edges.map(function(item) {
                    return { value: item.node.id, label: item.node.name }
                }),
            })
        },
    },

    // AUTHENTICATION
    {
        id: 'login',
        url: '/rest-api/login/',
        mapping: { read: 'post', },
        transform: {
            readResponseData: data => ({
                requestHeaders: { "Authorization": `Token ${data.token}` },
                authInfo: data,
            })
        }
    }
]
