import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID
} from 'graphql';

let TagType = new GraphQLObjectType({
    name: 'Tag',
    fields: () => ({
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        user: {
            type: new GraphQLNonNull(GraphQLID) // Note: GraphQLID instead of UserType
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
        user: {
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

module.exports = {
    TagType: TagType,
    TagInputType: TagInputType
}
