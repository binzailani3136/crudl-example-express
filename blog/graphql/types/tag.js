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

// let PageInfo = new GraphQLObjectType({
//     name: 'PageInfo',
//     fields: () => ({
//         hasPreviousPage: { type: GraphQLString },
//         hasNextPage: { type: GraphQLString },
//         startCursor: { type: GraphQLString },
//         endCursor: { type: GraphQLString },
//         counter: { type: GraphQLString }
//     })
// })

let TagListType = new GraphQLObjectType({
    name: 'TagList',
    fields: () => ({
        edges: {
            type: TagConnection
        }
        // pageInfo: {
        //     type: PageInfo
        // }
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
    TagListType: TagListType,
    TagInputType: TagInputType,
    TagResultType: TagResultType
}
