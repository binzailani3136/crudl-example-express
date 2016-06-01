import { types } from '../../Definitions'
import { root } from './settings'

var actions = {
    list: (req, connexes) => connexes.tags.read(req),
    add: (req, connexes) => connexes.tags.create(req),
    get: (req, connexes) => connexes.tag.read(req),
    delete: (req, connexes) => connexes.tag.delete(req),
    save: (req, connexes) => connexes.tag.update(req),
}

//-------------------------------------------------------------------
var collection = {
    meta: {
        type: types.TYPE_COLLECTION,
        path: 'tags',
        actions,
    },
    title: 'Tags',
    fields: [ 'name', ],
}

//-------------------------------------------------------------------
collection.resource =  {
    meta: {
        type: types.TYPE_RESOURCE,
        path: 'tags/:id',
        actions,
    },
    title: 'Entry Tag',
}

//-------------------------------------------------------------------
collection.resource.add = {
    meta: {
        type: types.TYPE_ADD_RESOURCE,
        actions,
    },
    path: 'tags/new',
}

//-------------------------------------------------------------------
collection.resource.fields = [
    {
        meta: { type: types.TYPE_FIELD },
        name: 'name',
        label: 'Name',
        field: 'String',
    },
]

export default { collections: [collection] }
