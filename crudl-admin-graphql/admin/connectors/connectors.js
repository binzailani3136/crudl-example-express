

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

function sorting(req) {
    if (req.sorting && req.sorting.length > 0) {
        return {
            orderBy: req.sorting.map(field => {
                let prefix = field.sorted == 'ascending' ? '' : '-'
                return prefix + field.name
            }).join(',')
        }
    }
    return {}
}

function listQuery(options) {
    if (Object.prototype.toString.call(options.fields) === '[object Array]') {
        options.fields = options.fields.join(', ')
    }
    return (req) => {
        let args = objectToArgs(Object.assign({},
            options.args,
            //req.page,
            req.filters,
            sorting(req)
        ))
        return `{
            ${options.name} ${args} {
                ${options.fields}
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
            read: listQuery({
                name: 'sections',
                fields: '_id, name, slug, position'
            }),
            create: `mutation ($input: SectionInput!) {
                addSection(data: $input) {
                    errors
                    section {_id, name, slug, position}
                }
            }`,
        },
        // pagination,
        transform: {
            readResponseData: data => data.data.sections,
            createResponseData: data => {
                if (data.data.addSection.errors) {
                    throw data.data.addSection.errors
                }
                return data.data.addSection.section
            },
        },
    },
    {
        id: 'section',
        query: {
            read: `{section(id: "%_id"){_id, name, slug, position}}`,
            update: `mutation ($input: SectionInput!) {
                changeSection(id: "%_id", data: $input) {
                    errors
                    section {_id, name, slug, position}
                }
            }`,
            delete: `mutation ($input: SectionInput!) {
                deleteSection($id: ID!, data: $input) {
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
            read: listQuery({
                name: 'categories',
                fields: '_id, section{_id, name}, name, slug, position'
            }),
            create: `mutation ($input: CategoryInput!) {
                addCategory(data: $input) {
                    errors
                    category {_id, section{_id, name}, name, slug, position}
                }
            }`,
        },
        // pagination,
        transform: {
            readResponseData: data => data.data.categories,
            createResponseData: data => {
                if (data.data.addCategory.errors) {
                    throw data.data.addCategory.errors
                }
                return data.data.addCategory.category
            },
        },
    },
    {
        id: 'category',
        query: {
            read: `{category(id: "%_id"){_id, section, name, slug, position}}`,
            update: `mutation ($input: CategoryInput!) {
                changeCategory(id: "%_id", data: $input) {
                    errors
                    category {_id, section, name, slug, position}
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
            read: listQuery({
                name: 'tags',
                fields: '_id, name, slug'
            }),
            create: `mutation ($input: TagInput!) {
                addTag(data: $input) {
                    errors
                    tag {_id, name, slug}
                }
            }`,
        },
        // pagination,
        transform: {
            readResponseData: data => data.data.tags,
            createResponseData: data => {
                if (data.data.addTag.errors) {
                    throw data.data.addTag.errors
                }
                return data.data.addTag.tag
            },
        },
    },
    {
        id: 'tag',
        query: {
            read: `{tag(id: "%_id"){_id, name, slug}}`,
            update: `mutation ($input: TagInput!) {
                changeTag(id: "%_id", data: $input) {
                    errors
                    tag {_id, name, slug}
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
            read: listQuery({
                name: 'entries',
                fields: '_id, title, status, date, sticky, section{_id, name}, category{_id, name}, owner{_id, username}, tags{_id}'
            }),
            create: `mutation ($input: EntryInput!) {
                addEntry(data: $input) {
                    errors
                    entry {_id, title, status, date, sticky, section{_id, name}, category{_id, name}, summary, body, owner{_id, username}, createdate, updatedate}
                }
            }`,
        },
        // pagination,
        transform: {
            readResponseData: data => data.data.entries,
            createResponseData: data => {
                if (data.data.addEntry.errors) {
                    throw data.data.addEntry.errors
                }
                return data.data.addEntry.entry
            },
        },
    },
    {
        id: 'entry',
        query: {
            read: `{entry(id: "%_id"){_id, title, status, date, sticky, section{_id, name}, category{_id, name}, tags{_id, name}, summary, body, owner{_id, username}}}`,
            update: `mutation ($input: EntryInput!) {
                changeEntry(id: "%_id", data: $input) {
                    errors
                    entry {_id, title, status, date, sticky, section{_id, name}, category{_id, name}, tags{_id, name}, summary, body, owner{_id, username}, createdate, updatedate}
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
                console.log("updateResponseData", data)
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
                name: 'entrylinks',
                fields: '_id, entry{_id}, url, title, description, position',
            }),
            create: `mutation ($input: LinkInput!) {
                addLink(input: $input) {
                    errors
                    link {_id, entry{_id}, url, title, description, position}
                }
            }`,
        },
        transform: {
            readResponseData: data => data.data.entrylinks,
            createResponseData: data => {
                if (data.data.addLink.errors) {
                    throw data.data.addLink.errors
                }
                return data.data.addLink.entry
            },
        },
    },
    {
        id: 'link',
        query: {
            read: `{entrylink(id: "%_id"){_id, entry{_id}, url, title, description, position}}`,
            update: `mutation ($input: LinkInput!) {
                changeLink(input: $input) {
                    errors
                    entrylink {_id, entry{_id}, url, title, description, position}
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
            read: `{sections{_id, name}}`,
        },
        transform: {
            readResponseData: data => ({
                options: data.data.sections.map(function(item) {
                    return { value: item._id, label: item.name }
                }),
            })
        },
    },

    // category_options
    // a helper for retrieving the categories used with select fields
    {
        id: 'categories_options',
        query: {
            read: `{categories{_id, name}}`,
        },
        transform: {
            readResponseData: data => ({
                options: data.data.categories.map(function(item) {
                    return { value: item._id, label: item.name }
                }),
            })
        },
    },

    // tags_options
    // a helper for retrieving the tags used with select fields
    {
        id: 'tags_options',
        query: {
            read: `{tags{_id, name}}`,
        },
        transform: {
            readResponseData: data => ({
                options: data.data.tags.map(function(item) {
                    return { value: item._id, label: item.name }
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
