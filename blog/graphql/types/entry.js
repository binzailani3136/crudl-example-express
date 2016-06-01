import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLEnumType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID
} from 'graphql';
import { UserType, UserInputType } from './user';
import { CategoryType, CategoryInputType } from './category';
import { TagType, TagInputType } from './tag';
var db = require('../../db');

let EntryType = new GraphQLObjectType({
    name: 'Entry',
    fields: () => ({
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        user: {
            type: UserType,
            resolve(parent, args) {
                return db.models.User.findById(parent.user);
            }
        },
        title: {
            type: GraphQLString
        },
        date: {
            type: GraphQLString
        },
        date_from: {
            type: GraphQLString
        },
        date_until: {
            type: GraphQLString
        },
        sticky: {
            type: GraphQLBoolean
        },
        status: {
            type: new GraphQLEnumType({
                name: 'status',
                values: {
                    Draft: { value: 'Draft' },
                    Online: { value: 'Online' }
                }
            })
        },
        category: {
            type: CategoryType,
            resolve(parent, args) {
                return db.models.Category.findById(parent.category);
            }
        },
        tags: {
            type: new GraphQLList(TagType),
            resolve(parent, args) {
                return db.models.Tag.find({_id: {$in: parent.tags}});
            }
        },
        image: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        }
    })
});

let EntryInputType = new GraphQLInputObjectType({
    name: 'EntryInput',
    fields: () => ({
        user: {
            type: GraphQLString
        },
        title: {
            type: GraphQLString
        },
        date: {
            type: GraphQLString
        },
        date_from: {
            type: GraphQLString
        },
        date_until: {
            type: GraphQLString
        },
        sticky: {
            type: GraphQLBoolean
        },
        status: {
            type: GraphQLString
        },
        category: {
            type: GraphQLString
        },
        tags: {
            type: GraphQLString
        },
        image: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        }
    })
});

module.exports = {
    EntryType: EntryType,
    EntryInputType: EntryInputType
}
