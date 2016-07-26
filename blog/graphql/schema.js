// schema.js
import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt
} from 'graphql';

import { UserType, UserInputType, UserResultType, UserListType, UserListFilter } from './types/user';
import { SectionType, SectionInputType, SectionResultType } from './types/section';
import { CategoryType, CategoryInputType, CategoryResultType } from './types/category';
import { TagType, TagInputType, TagResultType } from './types/tag';
import { EntryType, EntryInputType, EntryResultType } from './types/entry';
import { EntryLinkType, EntryLinkInputType, EntryLinkResultType } from './types/entrylink';
var paginate = require('express-paginate');
import db from '../db';

function getErrors(err) {
    let errors = null
    if (err.name === "ValidationError") {
        errors = []
        Object.keys(err.errors).forEach((key) => {
            errors.push(key)
            errors.push(err.errors[key].message)
        })
    } else {
        errors = err
    }
    return errors
}
let nores = null

let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
            users: {
                type: new GraphQLList(UserType),
                resolve: () => db.models.User.find()
            },
            // users: {
            //     type: UserListType,
            //     args: { limit: { type: GraphQLInt }, page: { type: GraphQLInt }, filters: { type: UserListFilter } },
            //     resolve: (root, {limit, page, filters}) => {
            //         const query = {}
            //         let counter = 0
            //         if (filters.is_staff) { query["is_staff"] = { "$eq": filters.is_staff }}
            //         db.models.User.count({}, function (err, count) { counter = count });
            //         return db.models.User.paginate(query, { page: page, limit: limit, })
            //         .then(function(result) {
            //             return {
            //                 "users": result.docs,
            //                 "pageInfo": {
            //                     "total": result.total,
            //                     "limit": result.limit,
            //                     "page": result.page,
            //                     "pages": result.pages,
            //                     "counter": counter
            //                 }
            //             }
            //         });
            //     }
            // },
            user: {
                type: UserType,
                args: { id: { type: GraphQLID } },
                resolve: (root, {id}) => db.models.User.findById(id)
            },
            sections: {
                type: new GraphQLList(SectionType),
                args: {
                    orderBy: { type: GraphQLString }
                },
                resolve: (root, {orderBy}) => {
                    let sort = ""
                    if (orderBy) { sort = orderBy.replace(/,/g, ' ') }
                    return db.models.Section.find().sort(sort)
                }
            },
            section: {
                type: SectionType,
                args: { id: { type: GraphQLID } },
                resolve: (root, {id}) => db.models.Section.findById(id)
            },
            categories: {
                type: new GraphQLList(CategoryType),
                args: {
                    orderBy: { type: GraphQLString },
                    section: { type: GraphQLString },
                    name: { type: GraphQLString },
                    search: { type: GraphQLString }
                },
                resolve: (root, {orderBy, section, name, search}) => {
                    const query = {}
                    let sort = ""
                    if (orderBy) { sort = orderBy.replace(/,/g, ' ') }
                    if (section) { query["section"] = { "$eq": section }}
                    if (name) { query["name"] = { "$regex": name, "$options": "i" }}
                    if (search) { query["name"] = { "$regex": search, "$options": "i" }}
                    return db.models.Category.find(query).sort(sort)
                }
            },
            category: {
                type: CategoryType,
                args: { id: { type: GraphQLID } },
                resolve: (root, {id}) => db.models.Category.findById(id)
            },
            tags: {
                type: new GraphQLList(TagType),
                args: {
                    orderBy: { type: GraphQLString }
                },
                resolve: (root, {orderBy}) => {
                    let sort = ""
                    if (orderBy) { sort = orderBy.replace(/,/g, ' ') }
                    return db.models.Tag.find().sort(sort)
                }
            },
            tag: {
                type: TagType,
                args: { id: { type: GraphQLID } },
                resolve: (root, {id}) => db.models.Tag.findById(id)
            },
            entries: {
                type: new GraphQLList(EntryType),
                args: {
                    orderBy: { type: GraphQLString },
                    title: { type: GraphQLString },
                    status: { type: GraphQLString },
                    date_gt: { type: GraphQLString },
                    sticky: { type: GraphQLString },
                    section: { type: GraphQLString },
                    category: { type: GraphQLString },
                    tags: { type: GraphQLString },
                    owner: { type: GraphQLString },
                    search: { type: GraphQLString },
                    search_summary: { type: GraphQLString },
                },
                resolve: (root, {orderBy, title, status, date_gt, sticky, section, category, tags, owner, search, search_summary}) => {
                    const query = {}
                    let sort = ""
                    if (orderBy) { sort = orderBy.replace(/,/g, ' ') }
                    if (title) { query["title"] = { "$regex": title, "$options": "i" }}
                    if (status) { query["status"] = { "$eq": status }}
                    if (date_gt) { query["date"] = { "$gt": date_gt }}
                    if (sticky) { query["sticky"] = { "$eq": sticky }}
                    if (section) { query["section"] = { "$eq": section }}
                    if (category) { query["category"] = { "$eq": category }}
                    if (tags) { query["tags"] = { "$in": [tags] }}
                    if (owner) { query["owner"] = { "$eq": owner }}
                    if (search) { query["title"] = { "$regex": search, "$options": "i" }}
                    if (search_summary) { query["summary"] = { "$regex": search_summary, "$options": "i" }}
                    return db.models.Entry.find(query).sort(sort)
                }
            },
            entry: {
                type: EntryType,
                args: { id: { type: GraphQLID } },
                resolve: (root, {id}) => db.models.Entry.findById(id)
            },
            entrylinks: {
                type: new GraphQLList(EntryLinkType),
                resolve: () => db.models.EntryLink.find()
            },
            entrylink: {
                type: EntryLinkType,
                args: { id: { type: GraphQLID } },
                resolve: (root, {id}) => db.models.EntryLink.findById(id)
            },
        })
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: () => ({
            addUser: {
                type: UserType,
                args: { data: { name: 'data', type: new GraphQLNonNull(UserInputType) }},
                resolve: (root, {data}) => {
                    return new db.models.User(data).save()
                }
            },
            changeUser: {
                type: UserType,
                args: {
                    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) },
                    data: { name: 'data', type: new GraphQLNonNull(UserInputType) }
                },
                resolve: (root, {id, data}) => {
                    return db.models.User.findByIdAndUpdate(id, data)
                }
            },
            deleteUser: {
                type: UserType,
                args: { id: { name: 'id', type: new GraphQLNonNull(GraphQLID) }},
                resolve: (root, {id}) => {
                    return db.models.User.findByIdAndRemove(id)
                }
            },
            addSection: {
                type: SectionResultType,
                args: { data: { name: 'data', type: new GraphQLNonNull(SectionInputType) }},
                resolve: (root, {data}) => {
                    return db.models.Section.create(data)
                    .then((function(object) { return { nores, object } }), function(err) {
                        let errors = getErrors(err)
                        return { errors, nores }
                    })
                }
            },
            changeSection: {
                type: SectionResultType,
                args: {
                    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) },
                    data: { name: 'data', type: new GraphQLNonNull(SectionInputType) }
                },
                resolve: (root, {id, data}) => {
                    return db.models.Section.findByIdAndUpdate(id, data, { runValidators: true, new: true  })
                    .then((function(object) { return { nores, object } }), function(err) {
                        let errors = getErrors(err)
                        return { errors, nores }
                    })
                }
            },
            deleteSection: {
                type: SectionType,
                args: { id: { name: 'id', type: new GraphQLNonNull(GraphQLID) }},
                resolve: (root, {id}) => {
                    return db.models.Section.findByIdAndRemove(id)
                }
            },
            addCategory: {
                type: CategoryResultType,
                args: { data: { name: 'data', type: new GraphQLNonNull(CategoryInputType) }},
                resolve: (root, {data}) => {
                    return db.models.Category.create(data)
                    .then((function(object) { return { nores, object } }), function(err) {
                        let errors = getErrors(err)
                        return { errors, nores }
                    })
                }
            },
            changeCategory: {
                type: CategoryResultType,
                args: {
                    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) },
                    data: { name: 'data', type: new GraphQLNonNull(CategoryInputType) }
                },
                resolve: (root, {id, data}) => {
                    return db.models.Category.findByIdAndUpdate(id, data, { runValidators: true, new: true  })
                    .then((function(object) { return { nores, object } }), function(err) {
                        let errors = getErrors(err)
                        return { errors, nores }
                    })
                }
            },
            deleteCategory: {
                type: CategoryType,
                args: { id: { name: 'id', type: new GraphQLNonNull(GraphQLID) }},
                resolve: (root, {id}) => {
                    return db.models.Category.findByIdAndRemove(id)
                }
            },
            addTag: {
                type: TagResultType,
                args: { data: { name: 'data', type: new GraphQLNonNull(TagInputType) }},
                resolve: (root, {data}) => {
                    return db.models.Tag.create(data)
                    .then((function(object) { return { nores, object } }), function(err) {
                        let errors = getErrors(err)
                        return { errors, nores }
                    })
                }
            },
            changeTag: {
                type: TagResultType,
                args: {
                    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) },
                    data: { name: 'data', type: new GraphQLNonNull(TagInputType) }
                },
                resolve: (root, {id, data}) => {
                    return db.models.Tag.findByIdAndUpdate(id, data, { runValidators: true, new: true  })
                    .then((function(object) { return { nores, object } }), function(err) {
                        let errors = getErrors(err)
                        return { errors, nores }
                    })
                }
            },
            deleteTag: {
                type: TagType,
                args: { id: { name: 'id', type: new GraphQLNonNull(GraphQLID) }},
                resolve: (root, {id}) => {
                    return db.models.Tag.findByIdAndRemove(id)
                }
            },
            addEntry: {
                type: EntryResultType,
                args: { data: { name: 'data', type: new GraphQLNonNull(EntryInputType) }},
                resolve: (root, {data}) => {
                    return db.models.Entry.create(data)
                    .then((function(object) { return { nores, object } }), function(err) {
                        let errors = getErrors(err)
                        return { errors, nores }
                    })
                }
            },
            changeEntry: {
                type: EntryResultType,
                args: {
                    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) },
                    data: { name: 'data', type: new GraphQLNonNull(EntryInputType) }
                },
                resolve: (root, {id, data}) => {
                    if (data.category == "") data.category = null
                    return db.models.Entry.findByIdAndUpdate(id, data, { runValidators: true, new: true  })
                    .then((function(object) { return { nores, object } }), function(err) {
                        let errors = getErrors(err)
                        return { errors, nores }
                    })
                }
            },
            deleteEntry: {
                type: EntryType,
                args: { id: { name: 'id', type: new GraphQLNonNull(GraphQLID) }},
                resolve: (root, {id}) => {
                    return db.models.Entry.findByIdAndRemove(id)
                }
            },
            addEntryLink: {
                type: EntryLinkResultType,
                args: { data: { name: 'data', type: new GraphQLNonNull(EntryLinkInputType) }},
                resolve: (root, {data}) => {
                    return db.models.EntryLink.create(data)
                    .then((function(object) { return { nores, object } }), function(err) {
                        let errors = getErrors(err)
                        return { errors, nores }
                    })
                }
            },
            changeEntryLink: {
                type: EntryLinkType,
                args: {
                    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) },
                    data: { name: 'data', type: new GraphQLNonNull(UserInputType) }
                },
                resolve: (root, {id, data}) => {
                    return db.models.EntryLink.findByIdAndUpdate(id, data)
                }
            },
            deleteEntryLink: {
                type: EntryLinkType,
                args: { id: { name: 'id', type: new GraphQLNonNull(GraphQLID) }},
                resolve: (root, {id}) => {
                    return db.models.EntryLink.findByIdAndRemove(id)
                }
            },
        })
    }),
});

export default schema;
