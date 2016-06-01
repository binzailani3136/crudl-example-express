import { types } from '../../Definitions'
import { root } from './settings'

var actions = {
    list: (req, connexes) => connexes.links.read(req),
    get: (req, connexes) => connexes.link.read(req),
    delete: (req, connexes) => connexes.link.delete(req),
    save: (req, connexes) => connexes.link.update(req),
    add: (req, connexes) => connexes.links.create(req),
}

//-------------------------------------------------------------------
var collection = {
    meta: {
        type: types.TYPE_COLLECTION,
        path: 'entrylinks',
        actions,
    },
    title: 'Entry Links',
    fields: [ 'url', 'title', 'entry' ],
}

//-------------------------------------------------------------------
collection.resource =  {
    meta: {
        type: types.TYPE_RESOURCE,
        path: 'entrylinks/:id',
        actions,
    },
    title: 'Entry Link',
}

//-------------------------------------------------------------------
collection.resource.add = {
    meta: {
        type: types.TYPE_ADD_RESOURCE,
        actions,
    },
    path: 'entrylinks/new',
}

//-------------------------------------------------------------------
collection.resource.fields = [
    {
        meta: {
            type: types.TYPE_FIELD,
            props: () => ({
                link: true,
            })
        },
        name: 'url',
        label: 'URL',
        field: 'String',
    },
    {
        meta: { type: types.TYPE_FIELD },
        name: 'title',
        label: 'Title',
        field: 'String',
    },
    {
        meta: {
            type: types.TYPE_FIELD,
            props: (data) => ({
                link: data ? true : false,
                linkURL: data ? `/entries/${data.entry}` : undefined,
            })
        },
        name: 'entry',
        label: 'Entry',
        field: 'String',
    },
]

export default { collections: [collection] }
