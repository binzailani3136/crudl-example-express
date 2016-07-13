# crudl express example
This is a [crudl](http://crudl.io/) example with [Express](http://expressjs.com/) and a REST-API as well as GraphQL.

* crudl is still under development and the syntax might change (esp. with connectors and descriptors).
* The relevant part for your admin interface is within the folder crudl-admin-rest/admin/ (resp. crudl-admin-graphql/admin/). All other files and folders are generally given when using crudl.
* The descriptors are intentionally verbose in order to illustrate the possibilites with crudl.

## Requirements
* Node.js
* MongoDB

## TOC
* [Installation](#installation)
    * [Optional: Install crudl-admin-rest (REST)](#install-crudl-admin-rest-rest)
    * [Optional: Install crudl-admin-graphql (GraphQL)](#install-crudl-admin-graphql-graphql)
* [URLs](#urls)
* [Notes](#notes)
    * [Connectors and Descriptors](#connectors-and-descriptors)
    * [Authentication](#authentication)
    * [Field dependency](#field-dependency)
    * [Foreign Key, Many-to-Many](#foreign-key-many-to-many)
    * [Relation with different endpoint](#relation-with-different-endpoint)
    * [Normalize/denormalize](#normalizedenormalize)
    * [Custom components](#custom-components)
    * [Initial values](#initial-values)
    * [Validate fields and form](#validate-fields-and-form)
    * [Custom column with listView](#custom-column-with-listview)
    * [Multiple sort with listView](#multiple-sort-with-listview)
    * [Filtering with listView](#filtering-with-listview)
    * [Change password](#change-password)
* [Limitations](#limitations)
* [Development](#development)
* [Credits & Links](#credits--links)

## Installation
1. Start mongodb:

    ```
    $ mongod --dbpath "/path/to/my/database/"
    ```

2. cd into blog, install the npm dependencies and initialize the database:

    ```
    $ cd blog
    $ npm install
    $ npm run initdb
    ```

3. Start the server

    ```
    $ npm run start
    ```

Open your browser and go to ``http://localhost:3000/crudl-rest/`` or ``http://localhost:3000/crudl-graphql/`` and login with the demo user (demo/demo).

### Install crudl-admin-rest (REST)
IMPORTANT: This step is optional and you only need to run watchify if you actually change files within the folder /crudl-admin-rest/.

Go to /crudl-admin-rest/ and install the npm packages, then run watchify:

```
$ npm install
$ npm run watchify
```

### Install crudl-admin-graphql (GraphQL)
IMPORTANT: This step is optional and you only need to run watchify if you actually change files within the folder /crudl-admin-graphql/.

Go to /crudl-admin-graphql/ and install the npm packages, then run watchify:

```
$ npm install
$ npm run watchify
```

## URLs
```
/api/               # REST API (DRF)
/graphiql/          # GraphQL Query Interface
/crudl-rest/        # Crudl Admin (REST)
/crudl-graphql/     # Crudl Admin (GraphQL)
```

## Notes
While this example is simple, there's still a couple of more advanced features in order to represent a real-world scenario.

### Connectors and Descriptors
In order for CRUDL to work, you need to define _connectors_ (API endpoints) and a _descriptor_ (visual representation). The _descriptor_ consists of _collections_ and the _authentification_.

Here is the basic structure of a REST connector:
```javascript
{
    id: 'entries',
    url: 'entries/',
    urlQuery,
    pagination,
    transform: {
        readResponseData: data => data.docs,
    },
},
```

And here is a similar connector with GraphQL:
```javascript
{
    id: 'entries',
    query: {
        read: `{allEntries{id, title, status, date}}`,
    },
    pagination,
    transform: {
        readResponseData: data => data.data.allEntries.edges.map(e => e.node)
    },
},
```

With collections, you create the visual representation by defining the _listView_, _changeView_ and _addView_ of each object:
```javascript
var listView = {}
listView.fields = []
listView.filters = []
listView.search = []
var changeView = {}
changeView.fields = []
changeView.tabs = []
var addView = {}
```

### Authentication
Both the REST and GraphQL API is only accessible for logged-in users based on TokenAuthentication. Besides the Token, we also return an attribute _authInfo_ in order to subsequently have access to the currently logged-in user (e.g. for filtering).

```javascript
{
    id: 'login',
    url: 'login/',
    mapping: { read: 'post', },
    transform: {
        readResponseData: data => ({
            requestHeaders: { 'Authorization': `Token ${data.token}` },
            authInfo: data,
        })
    }
}
```

### Field dependency
With _Entries_, the _Categories_ depend on the selected _Section_. If you change the field _Section_, the options of field _Category_ are populated based on the chosen _Section_ due to the _watch_ method.

```javascript
{
    name: 'category',
    field: 'Autocomplete',
    watch: [
        {
            for: 'section',
            setProps: section => ({
                disabled: !section,
                helpText: !section ? "In order to select a category, you have to select a section first" : "Select a category",
            }),
        }
    ],
    actions: {
        asyncProps: (req, connectors) => {
            /* return the filtered categories based on req.context.section */
        }
    },
}
```

You can use the same syntax with list filters (see entries.js).

### Foreign Key, Many-to-Many
There are a couple of foreign keys being used (e.g. _Section_ or _Category_ with _Entry_) and one many-to-many field (_Tags_ with _Entry_).

```javascript
{
    name: 'section',
    label: 'Section',
    field: 'Select',
    actions: {
        asyncProps: (req, connectors) => connectors.sections_options.read(req),
    },
},
{
    name: 'category',
    label: 'Category',
    field: 'Autocomplete',
    actions: {
        /* return the value and label when selecting a category */
        select: (req, connectors) => {
            return Promise.all(req.data.selection.map(item => {
                return connectors.category(item.value).read(req)
                .then(res => res.set('data', {
                    value: res.data.id,
                    label: res.data.name,
                }))
            }))
        },
        /* return the value and a custom label when searching for a category */
        search: (req, connectors) => {
            return connectors.categories.read(req.filter('name', req.data.query)
            .then(res => res.set('data', res.data.map(d => ({
                value: d.id,
                label: `<b>${d.name}</b> (${d.slug})`,
            }))))
        },
    },
},
{
    name: 'tags',
    label: 'Tags',
    field: 'AutocompleteMultiple',
    actions: {},
}
```

### Relation with different endpoint
The collection _Links_ is an example of related objects which are assigned through an intermediary table with additional fields.

```javascript
changeView.tabs = [
    {
        title: 'Links',
        actions: {
            list: (req, connectors) => connectors.links.read(req.filter('entry', req.id)),
            add: (req, connectors) => connectors.links.create(req),
            save: (req, connectors) => connectors.link(req.data.id).update(req),
            delete: (req, connectors) => connectors.link(req.data.id).delete(req)
        },
        itemTitle: '{url}',
        fields: [
            {
                name: 'url',
                label: 'URL',
                field: 'URL',
                props: {
                    link: true,
                },
            },
            {
                name: 'title',
                label: 'Title',
                field: 'String',
            },
            {
                name: 'id',
                field: 'hidden',
            },
            {
                name: 'entry',
                field: 'hidden',
                initialValue: (context) => context.data.id,
            },
        ],
    },
]
```

### Normalize/denormalize
With _Users_, we added a custom field _full_name_ which is not part of the database or the API. We achieve this by using the methods _normalize_ and _denormalize_ in order to manipulate the data stream.

```javascript
var changeView = {
    /* manipulate data sent by the API */
    normalize: (data, error) => {
        data.full_name = data.last_name + ', ' + data.first_name
        return data
    },
    /* manipulate data before sending to the API  */
    denormalize: (data) => {
        let index = data.full_name.indexOf(',')
        if (index >= 0) {
            data.last_name = data.full_name.slice(0, index)
            data.first_name = data.full_name.slice(index+1)
        }
        return data
    }
}
```

Please note that it is probably better to add that field to the API. We just added this case in order to demonstrate the maniuplation of data.

### Custom components
We have added a custom component _SplitDateTimeField.jsx_ (see admin/fields) in order to show how you're able to implement fields which are not part of the core package.

```javascript
import options from './admin/options'
import descriptor from './admin/descriptor'
import SplitDateTimeField from './admin/fields/SplitDateTimeField'

Crudl.addField('SplitDateTime', SplitDateTimeField)
Crudl.render(descriptor, options)
```

### Initial values
You can set initial values with every field (based on context, if needed).

```javascript
{
    name: 'date',
    label: 'Date',
    field: 'Date',
    initialValue: () => formatDate(new Date())
},
{
    name: 'user',
    label: 'User',
    field: 'hidden',
    initialValue: (context) => context.auth.user
},
```

### Validate fields and form
Validation should usually be handled with the API. That said, it sometimes makes sense to use frontend validation as well.

```javascript
{
    name: 'date_gt',
    label: 'Published after',
    field: 'Date',
    /* simple date validation */
    validate: (value, allValues) => {
        const dateReg = /^\d{4}-\d{2}-\d{2}$/
        if (value && !value.match(dateReg)) {
            return 'Please enter a date (YYYY-MM-DD).'
        }
    }
},
{
    name: 'summary',
    label: 'Summary',
    field: 'Textarea',
    validate: (value, allValues) => {
        if (!value && allValues.status == '1') {
            return 'The summary is required with status "Online".'
        }
    }
},
```

In order to validate the complete form, you define a function validate with the changeView or addView:

```javascript
var changeView = {
    path: 'entries/:id',
    title: 'Blog Entry',
    actions: { ... },
    validate: function (values) {
        if (!values.category && !values.tags) {
            return { _error: 'Either `Category` or `Tags` is required.' }
        }
    }
}
```

### Custom column with listView
With _Entries_, we added a custom column to the _listView_ based on the currently logged-in user.

```javascript
var listView = {
    path: 'entries',
    title: 'Blog Entries',
    actions: {
        list: function (req, connectors) {
            let entries = connectors.entries.read(req)
            /* here we add a custom column based on the currently logged-in user */
            let entriesWithCustomColumn = transform(entries, (item) => {
                item.is_owner = req.authInfo.user == item.owner
                return item
            })
            return entriesWithCustomColumn
        }
    },
}

listView.fields = [
    { ... }
    {
        name: 'is_owner',
        label: 'Owner',
        render: 'boolean',
    },
]
```

### Multiple sort with listView
The _listView_ supports ordering by multiple columns (see entries.js).

### Filtering with listView
Filtering is done by defining fields with _listView.filters_ (see entries.js). You have all the options available with the _changeView_ (e.g. initial values, field dependency, autocompletes, ...).

### Change password
You can only change the password of the currently logged-in _User_ (see collections/users.js)

## Limitations
* Sorting with MongoDB is case sensitive. With aggregation, it is possible to implement case-insensitive sorting.

## Development
This example mainly shows how to use crudl. It is not intended for development on crudl itself.

## Credits & Links
crudl and crudl-django-example is written and maintained by vonautomatisch (Patrick Kranzlmüller, Axel Swoboda).

* http://crudl.io
* https://twitter.com/crudlio
* http://vonautomatisch.at
