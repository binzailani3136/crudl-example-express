import toPath from 'lodash/toPath'
import get from 'lodash/get'

//-------------------------------------------------------------------
export function continuousPagination(res) {
    let nextPage = undefined
    let resultsTotal = undefined
    let filteredTotal = undefined
    if (res.data.page < res.data.pages) {
        nextPage = res.data.page + 1
    }
    if (res.data.counter) {
        resultsTotal = res.data.counter
    }
    if (res.data.total) {
        filteredTotal = res.data.total
    }
    // Return the pagination descriptor
    return {
        type: 'continuous',
        resultsTotal,
        filteredTotal,
        next: nextPage ? { page: nextPage } : undefined,
    }
}

export function numberedPagination(res) {

    // total number of results
    let resultsTotal = res.data.counter
    // total number of filtered results
    let filteredTotal = res.data.total
    // current page
    let currentPage = res.data.page
    // total pages
    let pagesTotal = res.data.pages

    // next page as number
    let nextPage = currentPage > pagesTotal ? currentPage + 1 : null
    // previous page as number
    let previousPage = currentPage > 1 ? currentPage - 1 : null
    // the page size
    let pageSize = res.data.docs.length

    // Compute all page cursors
    let allPages = []
    for (let i = 0; i < pagesTotal; i++) {
        allPages[i] = `${(i+1)}` // We return string, so that the page will be preserved in the path query
    }

    return {
        type: 'numbered',
        allPages,
        currentPage,
        resultsTotal,
        filteredTotal,
    }
}

//-------------------------------------------------------------------
export function urlQuery(req) {
    return Object.assign({},
        req.filters,
        req.page && { page: req.page },
        {
            ordering: req.sorting.map(field => {
                let prefix = field.sorted == 'ascending' ? '' : '-'
                return prefix + field.sortKey
            }).join(',')
        }
    )
}

//-------------------------------------------------------------------
export function join(p1, p2, var1, var2) {
    return Promise.all([p1, p2])
    .then(responses => {
        return responses[0].set('data', responses[0].data.map(item => {
            item[var1] = responses[1].data.find(obj => obj[var2] == item[var1])
            return item
        }))
    })
}

// Credits for this function go to https://gist.github.com/mathewbyrne
export function slugify(text) {
    if (typeof text !== 'undefined') {
        return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
    }
    return undefined
}

export function formatDate(date) {
    return date.toJSON().slice(0, 10)
}

export function formatStringToDate(dateStr) {
    let date = new Date(dateStr)
    return date.toJSON().slice(0, 10)
}

/* transform mongoose error to redux-form (object) error
mongoose:
{
    "__all__": "message",
    "key": "message"
}
redux-form:
{
    "_error": "message",
    "key": "message"
}
*/
export function transformErrors(error) {
    console.log("REST transformErrors", error)
    if (error !== null && typeof error === 'object') {
        if (error.__all__) {
            error._error = error.__all__
        }
    }
    return error
}

/**
* Works like lodash.get() with an extra feature: '[*]' selects
* the complete array. For example:
*
*      let object = { name: 'Abc', tags: [ {id: 1, name: 'javascript'}, {id: 2, name: 'select'} ]}
*      let names = select(object, 'tags[*].name')
*      console.log(names)
*      > ['javascript', 'select']
*
*/
export function select(pathSpec, defaultValue) {
    const _select = (data, pathSpec, defaultValue) => {
        if (!data || !pathSpec) {
            return defaultValue
        }
        const path = toPath(pathSpec)
        const pos = path.indexOf('*')
        if (pos >= 0) {
            // Break the path at '*' and do select() recursively on
            // every element of the first path part
            return get(data, path.slice(0, pos)).map(
                item => _select(item, path.slice(pos + 1), defaultValue)
            )
        }
        return get(data, path, defaultValue)
    }
    return (data) => _select(data, pathSpec, defaultValue)
}
