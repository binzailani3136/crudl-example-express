var mongoose = require('mongoose');

exports.User = {
    user_demo: {
        _id: mongoose.Types.ObjectId(),
        username: "demo",
        first_name: "John",
        last_name: "Doe",
        is_active: true,
        is_staff: true,
        password: "demo",
        token: "cb1ea0d5cd25d0073e47c36be67b1aa26a210eda",
        email: "",
        date_joined: "2016-06-28T08:45:14.078"
    },
    user_editor: {
        _id: mongoose.Types.ObjectId(),
        "username": "editor",
        "first_name": "Joe",
        "last_name": "Bloggs",
        "is_active": true,
        "is_staff": true,
        "password": "editor",
        "token": "43b464e16613beb806b1e4b2b25c63aea189e397",
        "email": "",
        "date_joined": "2016-06-28T08:45:14.078"
    },
    user_admin: {
        _id: mongoose.Types.ObjectId(),
        username: "admin",
        first_name: "Jane",
        last_name: "Citizen",
        is_active: true,
        is_staff: true,
        password: "admin",
        token: "5d212b63c1723cfdb6833abf858c45924584aed0",
        email: "",
        date_joined: "2016-06-28T08:45:14.078"
    }
}

exports.Section = {
    section_news: {
        _id: mongoose.Types.ObjectId(),
        name: "News",
        slug: "news",
        position: 0,
    },
    section_updates: {
        _id: mongoose.Types.ObjectId(),
        name: "Updates",
        slug: "updates",
        position: 1,
    },
    section_help: {
        _id: mongoose.Types.ObjectId(),
        name: "Help",
        slug: "help",
        position: 2,
    },
    section_faq: {
        _id: mongoose.Types.ObjectId(),
        name: "FAQ",
        slug: "faq",
        position: 3,
    }
}

exports.Category = {
    category_updates_core: {
        _id: mongoose.Types.ObjectId(),
        section: exports.Section.section_updates._id,
        name: "Core",
        slug: "core",
        position: 0,
    },
    category_updates_ui: {
        _id: mongoose.Types.ObjectId(),
        section: exports.Section.section_updates._id,
        name: "UI",
        slug: "ui",
        position: 1,
    },
    category_updates_cli: {
        _id: mongoose.Types.ObjectId(),
        section: exports.Section.section_updates._id,
        name: "CLI",
        slug: "cli",
        position: 2,
    },
    category_updates_documentation: {
        _id: mongoose.Types.ObjectId(),
        section: exports.Section.section_updates._id,
        name: "Documentation",
        slug: "documentation",
        position: 3,
    },
    category_updates_examples: {
        _id: mongoose.Types.ObjectId(),
        section: exports.Section.section_updates._id,
        name: "Examples",
        slug: "examples",
        position: 4,
    },
    category_help_general: {
        _id: mongoose.Types.ObjectId(),
        section: exports.Section.section_help._id,
        name: "General",
        slug: "general",
        position: 0,
    },
    category_help_installation: {
        _id: mongoose.Types.ObjectId(),
        section: exports.Section.section_help._id,
        name: "Installation",
        slug: "installation",
        position: 1,
    },
    category_help_usage: {
        _id: mongoose.Types.ObjectId(),
        section: exports.Section.section_help._id,
        name: "Usage",
        slug: "usage",
        position: 2,
    },
    category_help_customization: {
        _id: mongoose.Types.ObjectId(),
        section: exports.Section.section_help._id,
        name: "Customization",
        slug: "customization",
        position: 3,
    },
    category_help_api: {
        _id: mongoose.Types.ObjectId(),
        section: exports.Section.section_help._id,
        name: "API",
        slug: "api",
        position: 4,
    },
    category_help_examples: {
        _id: mongoose.Types.ObjectId(),
        section: exports.Section.section_help._id,
        name: "Examples",
        slug: "examples",
        position: 5,
    },
}

exports.Tag = {
    tag_backend: {
        _id: mongoose.Types.ObjectId(),
        name: "backend",
        slug: "backend"
    },
    tag_frontend: {
        _id: mongoose.Types.ObjectId(),
        name: "frontend",
        slug: "frontend"
    },
    tag_admin: {
        _id: mongoose.Types.ObjectId(),
        name: "admin",
        slug: "admin"
    },
    tag_ui: {
        _id: mongoose.Types.ObjectId(),
        name: "ui",
        slug: "ui"
    },
    tag_ux: {
        _id: mongoose.Types.ObjectId(),
        name: "ux",
        slug: "ux"

    },
    tag_usability: {
        _id: mongoose.Types.ObjectId(),
        name: "usability",
        slug: "usability"
    },
    tag_connector: {
        _id: mongoose.Types.ObjectId(),
        name: "connector",
        slug: "connector"
    },
    tag_descriptor: {
        _id: mongoose.Types.ObjectId(),
        name: "descriptor",
        slug: "descriptor"
    },
    tag_admin_kit: {
        _id: mongoose.Types.ObjectId(),
        name: "admin-kit",
        slug: "admin-kit"
    },
    tag_rest: {
        _id: mongoose.Types.ObjectId(),
        name: "rest",
        slug: "rest"
    },
    tag_graphql: {
        _id: mongoose.Types.ObjectId(),
        name: "graphql",
        slug: "graphql"
    },
    tag_api: {
        _id: mongoose.Types.ObjectId(),
        name: "api",
        slug: "api"
    },
    tag_authentication: {
        _id: mongoose.Types.ObjectId(),
        name: "authentication",
        slug: "authentication"
    },
    tag_permissions: {
        _id: mongoose.Types.ObjectId(),
        name: "permissions",
        slug: "permissions"
    },
    tag_fields: {
        _id: mongoose.Types.ObjectId(),
        name: "fields",
        slug: "fields"
    },
    tag_customization: {
        _id: mongoose.Types.ObjectId(),
        name: "customization",
        slug: "customization"
    },
    tag_dashboard: {
        _id: mongoose.Types.ObjectId(),
        name: "dashboard",
        slug: "dashboard"
    },
    tag_listview: {
        _id: mongoose.Types.ObjectId(),
        name: "listview",
        slug: "listview"
    },
    tag_changeview: {
        _id: mongoose.Types.ObjectId(),
        name: "changeview",
        slug: "changeview"
    },
    tag_react: {
        _id: mongoose.Types.ObjectId(),
        name: "react",
        slug: "react"
    },
    tag_deployment: {
        _id: mongoose.Types.ObjectId(),
        name: "deployment",
        slug: "deployment"
    },
    tag_django: {
        _id: mongoose.Types.ObjectId(),
        name: "django",
        slug: "django"
    },
    tag_flask: {
        _id: mongoose.Types.ObjectId(),
        name: "flask",
        slug: "flask"
    },
    tag_node: {
        _id: mongoose.Types.ObjectId(),
        name: "node",
        slug: "node"
    },
    tag_express: {
        _id: mongoose.Types.ObjectId(),
        name: "express",
        slug: "express"
    },
    tag_rails: {
        _id: mongoose.Types.ObjectId(),
        name: "rails",
        slug: "rails"

    },
    tag_hapi: {
        _id: mongoose.Types.ObjectId(),
        name: "hapi",
        slug: "hapi"
    },
    tag_koa: {
        _id: mongoose.Types.ObjectId(),
        name: "koa",
        slug: "koa"
    },
    tag_laravel: {
        _id: mongoose.Types.ObjectId(),
        name: "laravel",
        slug: "laravel"

    },
    tag_nginx: {
        _id: mongoose.Types.ObjectId(),
        name: "nginx",
        slug: "nginx"
    },
    tag_apache: {
        _id: mongoose.Types.ObjectId(),
        name: "apache",
        slug: "apache"
    },
    tag_server: {
        _id: mongoose.Types.ObjectId(),
        name: "server",
        slug: "server"

    },
    tag_tests: {
        _id: mongoose.Types.ObjectId(),
        name: "tests",
        slug: "tests"
    },
    tag_component: {
        _id: mongoose.Types.ObjectId(),
        name: "component",
        slug: "component"
    },
    tag_npm: {
        _id: mongoose.Types.ObjectId(),
        name: "npm",
        slug: "npm"

    },
    tag_documentation: {
        _id: mongoose.Types.ObjectId(),
        name: "documentation",
        slug: "documentation"
    },
    tag_beginner: {
        _id: mongoose.Types.ObjectId(),
        name: "beginner",
        slug: "beginner"
    },
    tag_intermediate: {
        _id: mongoose.Types.ObjectId(),
        name: "intermediate",
        slug: "intermediate"

    },
    tag_advanced: {
        _id: mongoose.Types.ObjectId(),
        name: "advanced",
        slug: "advanced"
    },
    tag_expert: {
        _id: mongoose.Types.ObjectId(),
        name: "expert",
        slug: "expert"
    },
    tag_browserify: {
        _id: mongoose.Types.ObjectId(),
        name: "browserify",
        slug: "browserify"

    },
    tag_webpack: {
        _id: mongoose.Types.ObjectId(),
        name: "webpack",
        slug: "webpack"
    },
    tag_mongodb: {
        _id: mongoose.Types.ObjectId(),
        name: "mongodb",
        slug: "mongodb"
    },
    tag_mysql: {
        _id: mongoose.Types.ObjectId(),
        name: "mysql",
        slug: "mysql"

    },
    tag_postgresql: {
        _id: mongoose.Types.ObjectId(),
        name: "postgresql",
        slug: "postgresql"
    },
    tag_rethinkdb: {
        _id: mongoose.Types.ObjectId(),
        name: "rethinkdb",
        slug: "rethinkdb"

    },
    tag_python: {
        _id: mongoose.Types.ObjectId(),
        name: "python",
        slug: "python"
    },
}

exports.Entry = {
    entry_1: {
        _id: mongoose.Types.ObjectId(),
        title: "crudl.io launched",
        status: "Online",
        date: "2016-05-07",
        sticky: true,
        section: exports.Section.section_news._id,
        summary: "Consequatur voluptatem rem rerum quo culpa. Praesentium qui dolore quo impedit. Nesciunt delectus atque molestiae ipsa consequuntur veritatis. Quisquam qui aliquid maxime qui.",
        body: "Minus earum eveniet temporibus beatae eum et porro. Atque id error commodi sed tenetur repudiandae. Error quis soluta optio ratione aspernatur mollitia molestiae. Et voluptas et similique.\r\nCorrupti maxime commodi molestiae sequi tenetur voluptatem quas. Quia ab dolores beatae minus. Quas et nihil quo maxime itaque non hic officia. Sequi reiciendis rerum adipisci nihil.",
        owner: exports.User.user_demo._id
    },
    entry_2: {
        _id: mongoose.Types.ObjectId(),
        title: "Upcoming development (Autumn 2016)",
        status: "Online",
        date: "2016-04-02",
        sticky: true,
        section: exports.Section.section_news._id,
        summary: "Consequatur voluptatem rem rerum quo culpa. Praesentium qui dolore quo impedit. Nesciunt delectus atque molestiae ipsa consequuntur veritatis. Quisquam qui aliquid maxime qui.",
        body: "Minus earum eveniet temporibus beatae eum et porro. Atque id error commodi sed tenetur repudiandae. Error quis soluta optio ratione aspernatur mollitia molestiae. Et voluptas et similique.\r\nCorrupti maxime commodi molestiae sequi tenetur voluptatem quas. Quia ab dolores beatae minus. Quas et nihil quo maxime itaque non hic officia. Sequi reiciendis rerum adipisci nihil.",
        owner: exports.User.user_demo._id
    },
    entry_3: {
        _id: mongoose.Types.ObjectId(),
        title: "Python/Django example",
        status: "Draft",
        date: "2016-06-07",
        section: exports.Section.section_help._id,
        category: exports.Category.category_help_examples._id,
        tags: [
            exports.Tag.tag_django._id,
            exports.Tag.tag_graphql._id,
            exports.Tag.tag_postgresql._id,
            exports.Tag.tag_python._id,
            exports.Tag.tag_rest._id
        ],
        summary: "Consequatur voluptatem rem rerum quo culpa. Praesentium qui dolore quo impedit. Nesciunt delectus atque molestiae ipsa consequuntur veritatis. Quisquam qui aliquid maxime qui.",
        body: "Minus earum eveniet temporibus beatae eum et porro. Atque id error commodi sed tenetur repudiandae. Error quis soluta optio ratione aspernatur mollitia molestiae. Et voluptas et similique.\r\nCorrupti maxime commodi molestiae sequi tenetur voluptatem quas. Quia ab dolores beatae minus. Quas et nihil quo maxime itaque non hic officia. Sequi reiciendis rerum adipisci nihil.",
        owner: exports.User.user_demo._id
    },
    entry_4: {
        _id: mongoose.Types.ObjectId(),
        title: "Writing a custom component",
        status: "Online",
        date: "2016-06-02",
        section: exports.Section.section_help._id,
        category: exports.Category.category_help_customization._id,
        tags: [
            exports.Tag.tag_advanced._id,
            exports.Tag.tag_component._id,
            exports.Tag.tag_customization._id,
            exports.Tag.tag_react._id
        ],
        summary: "Consequatur voluptatem rem rerum quo culpa. Praesentium qui dolore quo impedit. Nesciunt delectus atque molestiae ipsa consequuntur veritatis. Quisquam qui aliquid maxime qui.",
        body: "Minus earum eveniet temporibus beatae eum et porro. Atque id error commodi sed tenetur repudiandae. Error quis soluta optio ratione aspernatur mollitia molestiae. Et voluptas et similique.\r\nCorrupti maxime commodi molestiae sequi tenetur voluptatem quas. Quia ab dolores beatae minus. Quas et nihil quo maxime itaque non hic officia. Sequi reiciendis rerum adipisci nihil.",
        owner: exports.User.user_demo._id
    },
    entry_5: {
        _id: mongoose.Types.ObjectId(),
        title: "Authentication and permissions",
        status: "Draft",
        date: "2016-05-27",
        section: exports.Section.section_help._id,
        category: exports.Category.category_help_usage._id,
        tags: [
            exports.Tag.tag_authentication._id,
            exports.Tag.tag_backend._id,
            exports.Tag.tag_permissions._id
        ],
        summary: "Consequatur voluptatem rem rerum quo culpa. Praesentium qui dolore quo impedit. Nesciunt delectus atque molestiae ipsa consequuntur veritatis. Quisquam qui aliquid maxime qui.",
        body: "Minus earum eveniet temporibus beatae eum et porro. Atque id error commodi sed tenetur repudiandae. Error quis soluta optio ratione aspernatur mollitia molestiae. Et voluptas et similique.\r\nCorrupti maxime commodi molestiae sequi tenetur voluptatem quas. Quia ab dolores beatae minus. Quas et nihil quo maxime itaque non hic officia. Sequi reiciendis rerum adipisci nihil.",
        owner: exports.User.user_demo._id
    },
    entry_6: {
        _id: mongoose.Types.ObjectId(),
        title: "Separation of concerns",
        status: "Online",
        date: "2016-05-22",
        section: exports.Section.section_faq._id,
        summary: "Consequatur voluptatem rem rerum quo culpa. Praesentium qui dolore quo impedit. Nesciunt delectus atque molestiae ipsa consequuntur veritatis. Quisquam qui aliquid maxime qui.",
        body: "Minus earum eveniet temporibus beatae eum et porro. Atque id error commodi sed tenetur repudiandae. Error quis soluta optio ratione aspernatur mollitia molestiae. Et voluptas et similique.\r\nCorrupti maxime commodi molestiae sequi tenetur voluptatem quas. Quia ab dolores beatae minus. Quas et nihil quo maxime itaque non hic officia. Sequi reiciendis rerum adipisci nihil.",
        owner: exports.User.user_demo._id
    },
}

exports.EntryLink = [
    {
        entry: exports.Entry.entry_1._id,
        url: "http://crudl.io",
        title: "CRUDL",
        position: 0
    },
    {
        entry: exports.Entry.entry_3._id,
        url: "https://www.djangoproject.com/",
        title: "Django",
        position: 0
    },
    {
        entry: exports.Entry.entry_3._id,
        url: "http://www.django-rest-framework.org/",
        title: "Django REST Framework",
        position: 1
    },
    {
        entry: exports.Entry.entry_3._id,
        url: "http://graphene-python.org/",
        title: "Graphene",
        position: 2
    },
    {
        entry: exports.Entry.entry_5._id,
        url: "https://auth0.com/",
        title: "Auth0",
        position: 0
    }
]
