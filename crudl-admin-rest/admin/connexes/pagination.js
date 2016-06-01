// Determines the page number
function url2page(url) {
    if (!url)
        return null

    // Try to match the page=:pageNum query string
    let match = /page=(\d+)/.exec(url)

    return match ? parseInt(match[1]) : 1
}

function pagination(res) {
    // Determine the current page number
    let current = url2page(res.url)

    // Determine the page count
    let pageCount = current
    if (res.data.next) {
        pageCount = Math.ceil(res.data.count / res.data.results.length)
    }

    // Return the pagination descriptor
    return {
        next: url2page(res.data.next),
        prev: url2page(res.data.previous),
        count: res.data.count,
        current,
        pageCount,
    }
}

module.exports = pagination
