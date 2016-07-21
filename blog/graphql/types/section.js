import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLID
} from 'graphql';

let SectionType = new GraphQLObjectType({
    name: 'Section',
    fields: () => ({
        _id: {
            type: new GraphQLNonNull(GraphQLID)
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

let SectionInputType = new GraphQLInputObjectType({
    name: 'SectionInput',
    fields: () => ({
        clientMutationId: {
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

let SectionResultType = new GraphQLObjectType({
    name: 'SectionResult',
    fields: () => ({
        errors: {
            type: new GraphQLList(GraphQLString),
        },
        section: {
            type: SectionType
        }
    })
});

module.exports = {
    SectionType: SectionType,
    SectionInputType: SectionInputType,
    SectionResultType: SectionResultType
}
