# crudl express example
This is a [crudl](http://crudl.io/) example with [Express](https://www.djangoproject.com/) and a REST-API as well as GraphQL.

## Requirements

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

## Development
This example mainly shows how to use crudl. It is not intended for development on crudl itself.
