import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt
} from 'graphql';

let UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        username: {
            type: GraphQLString
        },
        first_name: {
            type: GraphQLString
        },
        last_name: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        is_staff: {
            type: GraphQLBoolean
        },
        is_active: {
            type: GraphQLBoolean
        },
        date_joined: {
            type: GraphQLString
        }
    })
})

let UserInputType = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: () => ({
        clientMutationId: {
            type: GraphQLString
        },
        username: {
            type: GraphQLString
        },
        password: {
            type: GraphQLString
        },
        first_name: {
            type: GraphQLString
        },
        last_name: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        is_staff: {
            type: GraphQLBoolean
        },
        is_active: {
            type: GraphQLBoolean
        },
    })
})

let UserResultType = new GraphQLObjectType({
    name: 'UserResult',
    fields: () => ({
        errors: {
            type: new GraphQLList(GraphQLString),
        },
        user: {
            type: UserType
        }
    })
});

let PageInfo = new GraphQLObjectType({
    name: 'PageInfo',
    fields: () => ({
        total: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        page: { type: GraphQLInt },
        pages: { type: GraphQLInt },
        counter: { type: GraphQLInt }
    })
})

let UserListType = new GraphQLObjectType({
    name: 'UserList',
    fields: () => ({
        users: {
            type: new GraphQLList(UserType)
        },
        pageInfo: {
            type: PageInfo
        }
    })
})

let UserListFilter = new GraphQLInputObjectType({
    name: 'UserListFilter',
    fields: () => ({
        is_staff: {
            type: GraphQLBoolean
        }
    })
})

module.exports = {
    UserType: UserType,
    UserInputType: UserInputType,
    UserListType: UserListType,
    UserListFilter: UserListFilter,
    UserResultType: UserResultType
}
