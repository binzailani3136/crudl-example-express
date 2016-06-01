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

import { UserType, UserInputType, UserListType, UserListFilter } from './types/user';
import { CategoryType, CategoryInputType } from './types/category';
import { TagType, TagInputType } from './types/tag';
import { EntryType, EntryInputType } from './types/entry';
import { EntryLinkType, EntryLinkInputType } from './types/entrylink';
var paginate = require('express-paginate');
import db from '../db';

let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
            users: {
                type: UserListType,
                args: { limit: { type: GraphQLInt }, page: { type: GraphQLInt }, filters: { type: UserListFilter } },
                resolve: (root, {limit, page, filters}) => {
                    const query = {}
                    let counter = 0
                    if (filters.is_staff) { query["is_staff"] = { "$eq": filters.is_staff }}
                    db.models.User.count({}, function (err, count) { counter = count });
                    return db.models.User.paginate(query, { page: page, limit: limit, })
                    .then(function(result) {
                        return {
                            "users": result.docs,
                            "pageInfo": {
                                "total": result.total,
                                "limit": result.limit,
                                "page": result.page,
                                "pages": result.pages,
                                "counter": counter
                            }
                        }
                    });
                }
            },
            user: {
                type: UserType,
                args: { id: { type: GraphQLID } },
                resolve: (root, {id}) => db.models.User.findById(id)
            },
            categories: {
                type: new GraphQLList(CategoryType),
                resolve: () => db.models.Category.find()
            },
            category: {
                type: CategoryType,
                args: { id: { type: GraphQLID } },
                resolve: (root, {id}) => db.models.Category.findById(id)
            },
            tags: {
                type: new GraphQLList(TagType),
                resolve: () => db.models.Tag.find()
            },
            tag: {
                type: TagType,
                args: { id: { type: GraphQLID } },
                resolve: (root, {id}) => db.models.Tag.findById(id)
            },
            entries: {
                type: new GraphQLList(EntryType),
                resolve: () => db.models.Entry.find()
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
            addCategory: {
                type: CategoryType,
                args: { data: { name: 'data', type: new GraphQLNonNull(CategoryInputType) }},
                resolve: (root, {data}) => {
                    return new db.models.Category(data).save()
                }
            },
            changeCategory: {
                type: CategoryType,
                args: {
                    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) },
                    data: { name: 'data', type: new GraphQLNonNull(UserInputType) }
                },
                resolve: (root, {id, data}) => {
                    return db.models.Category.findByIdAndUpdate(id, data)
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
                type: TagType,
                args: { data: { name: 'data', type: new GraphQLNonNull(UserInputType) }},
                resolve: (root, {data}) => {
                    return new db.models.Tag(data).save()
                }
            },
            changeTag: {
                type: TagType,
                args: {
                    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) },
                    data: { name: 'data', type: new GraphQLNonNull(UserInputType) }
                },
                resolve: (root, {id, data}) => {
                    return db.models.Tag.findByIdAndUpdate(id, data)
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
                type: EntryType,
                args: { data: { name: 'data', type: new GraphQLNonNull(UserInputType) }},
                resolve: (root, {data}) => {
                    return new db.models.Entry(data).save()
                }
            },
            changeEntry: {
                type: EntryType,
                args: {
                    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) },
                    data: { name: 'data', type: new GraphQLNonNull(UserInputType) }
                },
                resolve: (root, {id, data}) => {
                    return db.models.Entry.findByIdAndUpdate(id, data)
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
                type: EntryLinkType,
                args: { data: { name: 'data', type: new GraphQLNonNull(UserInputType) }},
                resolve: (root, {data}) => {
                    return new db.models.EntryLink(data).save()
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
