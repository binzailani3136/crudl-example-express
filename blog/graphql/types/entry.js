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
import { SectionType, SectionInputType } from './section';
import { CategoryType, CategoryInputType } from './category';
import { TagType, TagInputType } from './tag';
var db = require('../../db');

let EntryType = new GraphQLObjectType({
    name: 'Entry',
    fields: () => ({
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        title: {
            type: GraphQLString
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
        date: {
            type: GraphQLString
        },
        sticky: {
            type: GraphQLBoolean
        },
        section: {
            type: SectionType,
            resolve(parent, args) {
                return db.models.Section.findById(parent.section);
            }
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
        summary: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
        owner: {
            type: UserType,
            resolve(parent, args) {
                return db.models.User.findById(parent.user);
            }
        },
        createdate: {
            type: GraphQLString
        },
        updatedate: {
            type: GraphQLString
        },
    })
});

let EntryInputType = new GraphQLInputObjectType({
    name: 'EntryInput',
    fields: () => ({
        clientMutationId: {
            type: GraphQLString
        },
        title: {
            type: GraphQLString
        },
        status: {
            type: GraphQLString
        },
        date: {
            type: GraphQLString
        },
        sticky: {
            type: GraphQLBoolean
        },
        section: {
            type: GraphQLString
        },
        category: {
            type: GraphQLString
        },
        tags: {
            type: GraphQLString
        },
        summary: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
        owner: {
            type: GraphQLString
        },
    })
});

module.exports = {
    EntryType: EntryType,
    EntryInputType: EntryInputType
}
