
export function pagination(res) {
    function url2page(url) {
        let match = /page=(\d+)/.exec(url)
        return match ? parseInt(match[1]) : 1
    }
    let nextPage = res.data.next && url2page(res.data.next)
    // Return the pagination descriptor
    return {
        next: nextPage ? { page: nextPage } : undefined,
    }
}

export function urlQuery(req) {
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

export function join(p1, p2, var1, var2, defaultValue={}) {
    return Promise.all([p1, p2])
    .then(responses => {
        return responses[0].set('data', responses[0].data.map(item => {
            item[var1] = responses[1].data.find(obj => obj[var2] == item[var1])
            if (!item[var1]) {
                item[var1] = defaultValue
            }
            return item
        }))
    })
}

// Credits for this function go to https://gist.github.com/mathewbyrne
export function slugify(text) {
    return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export function formatDate(date) {
    return date.toJSON().slice(0, 10)
}
