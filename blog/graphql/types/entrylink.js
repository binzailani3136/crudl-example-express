import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLID
} from 'graphql';
import { EntryType, EntryInputType } from './entry';
var db = require('../../db');

let EntryLinkType = new GraphQLObjectType({
    name: 'Entrylink',
    fields: () => ({
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        entry: {
            type: EntryType,
            resolve(parent, args) {
                return db.models.Entry.findById(parent.entry);
            }
        },
        url: {
            type: GraphQLString
        },
        title: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        position: {
            type: GraphQLInt
        }
    })
});

let EntryLinkInputType = new GraphQLInputObjectType({
    name: 'EntryLinkInput',
    fields: () => ({
        clientMutationId: {
            type: GraphQLString
        },
        entry: {
            type: GraphQLString
        },
        url: {
            type: GraphQLString
        },
        title: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        position: {
            type: GraphQLInt
        }
    })
});

let EntryLinkResultType = new GraphQLObjectType({
    name: 'EntryLinkResult',
    fields: () => ({
        errors: {
            type: new GraphQLList(GraphQLString),
        },
        link: {
            type: EntryLinkType
        }
    })
});

module.exports = {
    EntryLinkType: EntryLinkType,
    EntryLinkInputType: EntryLinkInputType,
    EntryLinkResultType: EntryLinkResultType
}
