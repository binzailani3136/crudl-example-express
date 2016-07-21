import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLID
} from 'graphql';

let TagType = new GraphQLObjectType({
    name: 'Tag',
    fields: () => ({
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        name: {
            type: GraphQLString
        },
        slug: {
            type: GraphQLString
        }
    })
});

let TagInputType = new GraphQLInputObjectType({
    name: 'TagInput',
    fields: () => ({
        clientMutationId: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        slug: {
            type: GraphQLString
        }
    })
});

let TagResultType = new GraphQLObjectType({
    name: 'TagResult',
    fields: () => ({
        errors: {
            type: new GraphQLList(GraphQLString),
        },
        tag: {
            type: TagType
        }
    })
});

module.exports = {
    TagType: TagType,
    TagInputType: TagInputType,
    TagResultType: TagResultType
}
