import React from 'react'
import CustomDashboard from './dashboard'

var users = require('./collections/users')
var sections = require('./collections/sections')
var categories = require('./collections/categories')
var tags = require('./collections/tags')
var entries = require('./collections/entries')
var connectors = require('./connectors/connectors')
var { login, logout } = require('./auth')

var admin = {
    title: 'crudl.io Express GraphQL Example',
    dashboard: <CustomDashboard />,
    connectors,
    views: {
        users,
        sections,
        categories,
        tags,
        entries,
    },
    auth: {
        login,
        logout,
    },
}

export default admin
