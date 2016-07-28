import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLID,
    GraphQLInt
} from 'graphql';

import {
  connectionDefinitions,
} from 'graphql-relay';


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
})

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
})

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
})


const { connectionType: TagConnection, edgeType: TagEdge } =
    connectionDefinitions({ name: 'Tag', nodeType: TagType })

const { connectionType: TagListConnection, edgeType: TagListEdge } =
    connectionDefinitions({ name: 'TagList', nodeType: TagType })


module.exports = {
    TagConnection: TagConnection,
    TagListConnection: TagListConnection,
    TagType: TagType,
    TagInputType: TagInputType,
    TagResultType: TagResultType
}
