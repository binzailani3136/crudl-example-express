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

let PageInfo = new GraphQLObjectType({
    name: 'PageInfo',
    fields: () => ({
        hasPreviousPage: { type: GraphQLString },
        hasNextPage: { type: GraphQLString },
        startCursor: { type: GraphQLString },
        endCursor: { type: GraphQLString },
        counter: { type: GraphQLString }
    })
})

// let TagListEdge = new GraphQLObjectType({
//     name: 'TagListEdge',
//     fields: () => ({
//         cursor: { type: GraphQLString },
//         node: { type: TagType }
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

// const ShipEdge {
//     cursor: String!
//     node: Ship
// }

const { connectionType: TagConnection, edgeType: TagEdge } =
    connectionDefinitions({ name: 'Tag', nodeType: TagType })

const { connectionType: TagListConnection, edgeType: TagListEdge } =
    connectionDefinitions({ name: 'TagList', nodeType: TagType })

// let TagListType = new GraphQLObjectType({
//     name: 'TagList',
//     fields: () => ({
//         tags: {
//             type: TagConnection
//         },
//         pageInfo: {
//             type: PageInfo
//         }
//     })
// })

// let TagEdge = new GraphQLObjectType({
//     name: 'TagEdge',
//     node: { type: TagType },
//     cursor: { type: GraphQLString }
// })
//
// let TagConnection = new GraphQLObjectType({
//     name: 'TagConnection',
//     pageInfo: { type: PageInfo },
//     edges: [TagEdge]
// })

// type ShipConnection {
//     edges: [ShipEdge]
//     pageInfo: PageInfo!
// }

module.exports = {
    TagConnection: TagConnection,
    TagListConnection: TagListConnection,
    TagType: TagType,
    TagListType: TagListType,
    TagInputType: TagInputType,
    TagResultType: TagResultType
}
