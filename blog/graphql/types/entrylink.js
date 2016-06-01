import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
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

module.exports = {
    EntryLinkType: EntryLinkType,
    EntryLinkInputType: EntryLinkInputType
}
