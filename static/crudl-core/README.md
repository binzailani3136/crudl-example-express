# crudl
DISCLAIMER: This is a preliminary, sketchy and incomplete documentation.

## TOC
* [About](#about)
* [Architecture](#architecture)
* [Options](#options)
* [Descriptor](#descriptor)
    * [Attributes and properties](#attributes-and-properties)
* [Connectors](#connectors)
    * [Requests](#requests)
    * [Responses](#responses)
    * [Errors](#errors)
* [Collections](#collections)
    * [Actions](#actions)
    * [Promise functions](#promise-functions)
    * [Normalize and denormalize functions](#normalize-and-denormalize-functions)
    * [Paths](#paths)
* [List View](#list-view)
* [Change View](#change-view)
* [Add View](#add-view)
* [Tab View](#tab-view)
* [Read View](#read-view)
* [Fieldsets](#fieldsets)
* [Fields](#fields)
    * [onChange](#onchange)
* [Credits & Links](#credits--links)

## About
CRUDL is a React application for rapidly building an admin interface based on your API. You just need to define the endpoints and a visual representation in order to get a full-blown UI for managing your data.

## Architecture
The CRUDL architecture (depicted below) consists of three logical layers. The connectors, views, and the react-redux frontend. We use React and Redux for the frontend, which consists of different views such as *list*, *add*, and *change* view.  The purpose of the connectors layer is to provide the views with a unified access to different APIs like REST or GraphQL. You configure the connectors, the fileds, and the views by providing a [descriptor](#descriptor).
```
+-----------------------+
|     React / Redux     |     
+-----------------------+
|         Views         |
+-----------------------+
  ↓         ↑         ↑         CRUDL
request  response  errors
  ↓         ↑         ↑
+-----------------------+
|       Connectors      |
+-----------------------+       ------------
            ↕                  
         ~~~~~~~           
           API                  BACKEND
         ~~~~~~~             

```

## Options
Upon initialization, you may provide CRUDL with some options:
```js
crudl.render(descriptor, {
    debug: false,
    basePath: '/crudl/', // The basePath of the front end
    baseURL: '/api/',    // The baseURL of the API (backend)
    rootElementId: 'crudl-root', // Where to place the root react element
})
```
Assuming we deploy CRUDL on www.mydomain.com, we'll have CRUDL running on `www.mydomain.com/crudl/...` and the ajax requests of the connectors will be directed at `www.mydomain.com/api/...`.

## Descriptor
The purpose of the descriptor is to provide CRUDL with the necessary information about the connectors and the views.
The descriptor is an object with the following attributes and properties:
```js
const descriptor = {
    title,              // Title of the CRUDL instance (a string or a react element property)
    connectors,         // an array of connectors
    collections,        // an array of collections
    dashboard,          // The index page of the CRUDL instance (a string or a react element property)
    login,              // Login view
    logout,             // Logout view
    pageNotFound        // The descriptor of the 404 page
}
```
The provided descriptor will be validated (using [Joi](https://github.com/hapijs/joi)) and all its attributes and properties are checked against the descriptor's schema.

> ### Attributes and properties
We distinguish between attributes and properties. An attribute is a value of a certain type (such as string, boolean, function, an object, etc.), whereas property can also be a function that returns such a value. In other words, with property you can also provide the getter method. For example, the title of the CRUDL instance is a string (or react element) property. So you can define it as
```js
title: 'Welcome to CRUDL'`
```
or as
```js
title: () => `Welcome to CRUDL. Today is ${getDayName()}
```
or even as:
```js
title: () => <span>Welcome to <strong>CRUDL</strong>. Today is {getDayName()}</span>,
```

## Connectors
The purpose of the connectors is to provide CRUDL with a unified view of the backend API. A connector is an object that defines the four CRUD methods `create`, `read`, `update`, and `delete`. These methods accept a [request](#requests) object as their argument and return a *promise* that either resolves to a [response](#responses) object or throws an [error](#errors). Normally, a single connector represents a single API endpoint or a single resource. So you define, for example, a single connector to access the blog entries and another connector to access the users.

CRUDL provides connectors for RESTful and GraphQL APIs. A REST connector must define the `url` attribute and a GraphQL connector must define the `query` attribute. A connector has the following schema:
```js
{
    id,             // A string uniquely identifying the connector
    url,            // REST: The endpoint URL (will be appended to options.baseURL)
    urlQuery,       // REST: A function that builds the url query part
    query,          // GraphQL: The GraphQL queries for create, read, update, and delete operations
    mapping,        // The mapping between CRUD and HTTP methods
    transform,      // Definition of Request and Response transformations
    pagination,     // Function that returns pagination info
}
```
 * `url`: url can either be a string such as `users/`, that will resolve against the `baseURL` [option](#options). Or it can be a function of the form: `(request) => urlString`

 * `urlQuery`: is an optional attribute. When provided, it must be a function `(request) => query`, where `query` is an object of url query keys and values e.g. `{ search: 'John', sortBy: 'last_name' }`. The resulting URL would then be: `baseURL/users?search=John&sortBy=last_name`.

 * `query`: An object with attributes `create`, `read`, `update`, and `delete` each defining a GraphQL query. The definition of the GraphQL query can be either a string or a function `(request) => queryString`

 * `mapping`: An object that defines the mapping between the CRUD and HTTP methods. The default mapping of a REST connector is:
   ```js
   {
       create: 'post',
       read: 'get',
       update: 'patch',
       delete: 'delete',
   }
   ```
   The default mapping of a GraphQL descriptor is:
   ```js
   {
       create: 'post',
       read: 'post',
       update: 'post',
       delete: 'post',
   }
   ```

 * `transform`: An object of request and response transformations:
   ```js
   {
       // Request
       createRequest: (req) => req,
       readRequest: (req) => req,
       updateRequest: (req) => req,
       deleteRequest: (req) => req,
       // Request data
       createRequestData: (data) => data,
       readRequestData: (data) => data,
       updateRequestData: (data) => data,
       deleteRequestData: (data) => data,
       // Response
       createResponse: (res) => res,
       readResponse: (res) => res,
       updateResponse: (res) => res,
       deleteResponse: (res) => res,
       // Response data
       createResponseData: (data) => data,
       readResponseData: (data) => data,
       updateResponseData: (data) => data,
       deleteResponseData: (data) => data,
   }
   ```
   The transformation of a request is applied prior to the transformation of request data and similarly, the transformation of a response is applied prior to transformation of a response data.
 * `pagination`: a function `(response) => paginationInfo`, where the format of `paginationInfo` depends on the kind of pagination that is being used.

   The **numbered pagination** requires pagination info in the form: `{ allPages, currentPage, resultsTotal, filteredTotal }`, where `allPages` is an array of page cursors. Page cursors can be any data. `allPages[i-1]` must provide a page cursor for the i-th page. The `currentPage` is the page number of the currently displayed page. The corresponding page cursor of the current page is `allPages[currentPage-1]`. The total number of results can be optionally provided as `resultsTotal`. The total number of *filtered* results can be optionally provided as `filteredTotal`.

   The **continuous scroll pagination** requires the pagination info in the form: `{ next, resultsTotal, resultsTotal, filteredTotal }`. Where next is a pageCursor that must be truthy if there exist a next page, otherwise it must be falsy. The `resultsTotal` is optional and it gives the number of the total available results. The total number of *filtered* results can be optionally provided as `filteredTotal`.

### Requests
A request object contains all the information necessary to execute on of the CRUD methods on a connector.
It is an object with the following attributes:
```js
{
    data,           // Context dependent: in a change view, the data contains the form values
    params,         // Connectors may require parameters to do their job, these are stored here
    filters,        // The requested filters
    sorting,        // The requested sorting
    pagination,     // true / false (whether to paginate, default true)
    page,           // The requested page
    headers,        // The http headers (e.g. the auth token)
}
```
>Calling a connector like this `crudl.connectors.user(31).read(request)` will cause the request object to have the `params = [31]`.

### Responses
A response object has the following attributes:
```js
{
    data,       // The data as returned by the API
    url,        // The url of the API endpoint (where the request was directed at)
    status,     // The HTTP status code of the response
}
```
The response may contain other attributes as well. For example, if a connector has the pagination function defined, the response will contain the attribute `pagination` set to the result of this function e.g.
```js
{
    data: [{id: 1, ...}, {id: 2, ...}, ..., {id: 63, ...} ],
    url: '/api/users/',
    status: 200,
    pagination: {
        page: 1,
        allPages: [1, 2, 3],
        resultsTotal: 63,
    }
}
```

### Errors
It is the responsibility of the connectors to throw the right errors. CRUDL distinguishes four kinds of errors:

* ValidationError: An object of the form: `{ fieldNameA: errorA, fieldNameB: errorB, ...  }`. Non field errors have the special attribute key `_error` (we use the same format error as [redux-form](https://github.com/erikras/redux-form)). Corresponds to HTTP status code 400.

* AuthorizationError: The request is not authorized. When this error is thrown, CRUDL redirects the user to the login view. Corresponds to HTTP status code 401.

* PermissionError: Thrown when the user is authorized to access the API but not permitted to execute the requested action e.g. delete a user, change passwords, etc. Corresponds to HTTP status code 403.

* NotFoundError: When this error is thrown, CRUDL redirect the user to the `pageNotFound` view. Corresponds to HTTP status code 404.

## Collections
The attribute `descriptor.collections` is an array of objects of the form:
```js
{
    listView,       // required
    changeView,     // required
    addView,        // optional
}
```

Before we go into details about the views, let's define some common elements of the view:

### Actions
Each view must define its `actions`, which is an object [property](#attributes-and-properties). The attributes of the actions property are the particular actions.

An action is a function that takes a request as its argument and returns a *promise*. A CRUDL promise either resolves to a [reponse](#responses) or throws an [error](#errors). Typically, actions make use of the connectors to do their job. For example, a typical list view defines an action like this:
```js
list: (req) => crudl.connectors.users.read(req)
```

### Promise functions
Some attributes may be asynchronous functions that may return promises (alternatively they may return plain values). The resolved values of these promises depend on the requirements of the particular function. You can use connectors to implement their functionality, but don't forget that the connectors promises resolve to *response* objects. It may therefore be necessarey to use them like this:
```js
return crudl.connectors.users.read().then(response => response.data)
```

### Normalize and denormalize functions
The functions `normalize` and `denormalize` are used to prepare, manipulate, annotate etc. the data for the frontend and for the backend. The normalization function prepares the data for the frontend (before they are displayed) and the denormalization function prepares to data for the backend (before they are passed to the connectors). The general form is `(data) => data` for views and `(value, allValues) => value` for [fields](#fields).

### Paths
> Note on paths and urls. In order to distinguish between backend URLs and the frontend URLs, we call the later *paths*. That means, connectors (ajax call) access URLs and views are displayed at paths.

A path can be defined as a simple (`'users'`) or parametrized (`'users/:id'`) string.
The parametrized version of the path definition is used only in change views and is not applicable to the list or add views. In order to resolve the parametrized change view path, the corresponding list item is used as the reference. In order to have a full control over the resolution, one can also define a path as an object:
```js
{
    name: 'users/:id',
    id: (listItem) => listItem.originalId,
}
```

## List View
A list view is defined like this:
```js
{
    // Required:
    path,             // The path of this view e.g. 'users' relative to options.basePath
    title,            // A string - title of this view (shown in navigation) e.g. 'Users'
    fields,           // An array of list view fields (see below)
    actions: {
        list,         // The list action (see below)
    }        
    // Optional:
    filters: {       
        fields,       // An array of fields (see below)
        denormalize,  // The denormalize function for the filters form
    }
    normalize,        // The normalize function of the form (listItems) => listItems (see below)
}
```

* `list` resolves to a response, where `response.data == [{ ...item1 }, { ...item2 }, ..., { ...itemN }]`. The response object may optionally have `response.pagination` defined.

* `filters.fields`: See [fields](#fields) for details.

* `normalize`: a function of the form `listItems => listItems`

## Change View
```js
{
    // Required
    path,               // Parametrized path definition
    title,              // A string e.g. 'User'
    actions: {
        get,            
        save,
        delete,
    }
    fields,             // A list of fields
    fieldsets,          // A list of fieldsets

    // Optional
    tabs,               // A list of tabs
    normalize,          // The normalization function (dataToShow) => dataToShow
    denormalize,        // The denormalization function (dataToSend) => dataToSend
    validate,           // Frontend validation function
}
```
Either `fields` or `fieldsets`, but not both, must be specified. The attribute `validation` is a [redux-form](https://github.com/erikras/redux-form) validation function.

## Add View
The add view defines almost the same set of attributes and properties as the change view. It is often possible to reuse parts of the change view.
```js
{
    // Required
    path,               // A path definition
    title,              // A string. e.g. 'Add new user'
    actions: {
        add,
    },
    fields,             // A list of fields
    fieldsets,          // A list of fieldsets

    // Optional
    validate,           // Frontend validation function
    denormalize,        // Note: add views don't have a normalize function
}
```

## Read View
coming soon

## Fieldsets
With fieldsets, you are able to group fields with the change/addView.
```js
{
    // Required
    fields,                 // Array of fields

    // Optional properties
    title,                  // string property
    hidden,                 // boolean property e.g. hidden: () => !isOwner()
    description,            // string or react element property
    expanded,               // boolean property

    // Misc optional
    onChange,               // onChange (see below)
}
```

## Fields
With the fields, you describe the behaviour of a single element with the changeView and/or addView.
```js
{
    // Required Properties
    name,                   // string property
    field,                  // string property (name of a field component to use)

    // Optional properties
    label,                  // string property (by default equal to the value of name)
    readOnly,               // booolean property

    // Misc optional
    initialValue,           // Initial value in an add view
    defaultValue,           // Default value if undefined
    key,                    // The name of the key (by default equal to the value of name)
    props,                  // An object or a promise function
    required,               // boolean
    validate,               // a function (value, allFieldsValues) => error || undefined
    onChange,               // onChange
}
```

### onChange
With onChange, you are able to define dependencies between one or more fields. For example, you might have a field Country and a field State. When changing the field Country, the options for field State should be populated. In order to achieve this, you use onChange with State, listening to updates in Country and (re)populate the available options depending on the selected Country.
```js
{
    // Required
    in,                     // a string or an array of strings (field names)

    // Optional
    setProps,               // An object or a promise function
    setValue,               // a plain value or a promise function
    setInitialValue,        // a plain valuer or a promise function
}
```

## Credits & Links
CRUDL and crudl-django-example is written and maintained by vonautomatisch (Patrick Kranzlmüller, Axel Swoboda).

* http://crudl.io
* https://twitter.com/crudlio
* http://vonautomatisch.at
