# crudl express example
This is a [crudl](http://crudl.io/) example with [Express](http://expressjs.com/) and a REST-API as well as GraphQL.

## Requirements
* Node.js
* MongoDB

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

Open your browser and go to ``http://localhost:3000/crudl-rest/`` and login with one of the users.
You have 3 users (patrick, axel, vaclav) with password "crudl" for each one.

### Install crudl-admin (REST)
Go to /crudl-admin-rest/ and install the npm packages, then run watchify:
```
$ npm install
$ npm run watchify
```

### Install crudl-admin (GraphQL)
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

### Authentication
Both the REST and GraphQL API is only accessible for logged-in users based on TokenAuthentication.

### Mutually dependent fields
When adding or editing an _Entry_, the _Categories_ depend on the selected _User_.
If you change the field _User_, the options of field _Category_ are populated based on the chosen _User_.

### Foreign Key, Many-to-Many
There are a couple of foreign keys being used (e.g. _Category_ with _Entry_) and one many-to-many field (_Tags_ with _Entry_).

### Relation with different endpoint
The collection _Links_ is an example of related objects which are assigned through an intermediary table with additional fields.
You can either use the main menu in order to handle all Links are an individual _Entry_ in order to edit the _Links_ assigned to this _Entry_ (which are shown using tabs).

### Autocompletes
We decided to use autocomplete fields for all foreign-key and many-to-many relations.

### Custom fields
With _Users_, we added a custom field _Name_ which is not part of the database or the API.
The methods _normalize_ and _denormalize_ are being used in order to manipulate the data stream.

## Development
This example mainly shows how to use crudl. It is not intended for development on crudl itself.
