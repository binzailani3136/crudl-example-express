import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLID
} from 'graphql';

let CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        section: {
            type: new GraphQLNonNull(GraphQLID) // Note: GraphQLID instead of SectionType
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
