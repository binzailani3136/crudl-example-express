import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLID
} from 'graphql';
import { SectionType, SectionInputType } from './section';
var db = require('../../db');

let CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        section: {
            type: SectionType,
            resolve(parent, args) {
                return db.models.Section.findById(parent.section);
            }
        },
        name: {
            type: GraphQLString
        },
        slug: {
            type: GraphQLString
        },
        position: {
            type: GraphQLInt
        }
    })
});

let CategoryInputType = new GraphQLInputObjectType({
    name: 'CategoryInput',
    fields: () => ({
        clientMutationId: {
            type: GraphQLString
        },
        section: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        slug: {
            type: GraphQLString
        },
        position: {
            type: GraphQLInt
        }
    })
});

let CategoryResultType = new GraphQLObjectType({
    name: 'CategoryResult',
    fields: () => ({
        errors: {
            type: new GraphQLList(GraphQLString),
        },
        category: {
            type: CategoryType
        }
    })
});

module.exports = {
    CategoryType: CategoryType,
    CategoryInputType: CategoryInputType,
    CategoryResultType: CategoryResultType
}
