# Procyon

_A lazy loading MVC front end framework_

## What is Procyon?

This is a conceptual front-end framework designed to be integrated with a JSON REST API.
Procyon will handle the route mappings, rendering of static and dynamic content, data management with the API.

Procyon can be used for "multi-page" front-end application development. Procyon uses MVC design pattern to support multi-page request handling.

## Creating your app

Essentially this repo itself is whole system. You just need to serve the root directory from your web server. It is that simple to get you starting. 
So you should copy or clone the directory first. If you have Python 3, you can start a web server by using `http` module. 

```
python3 -m http.server
```

Then create an HTML file. This is going to be your landing page that will handle all the requests. For example take a look at
[example-welcome-page.html](example-welcome-page.html). 

The important code segment is the initialization of the App. In a script module you should do the following:

```js
<script type="module">
    import { App } from '/procyon.js'
    new App('examples/welcome')
</script>
```

Each Application should reside in a sub-directory (i.e. 'App directory'). The first parameter of the App class takes the location of this directory
relatively to the current root directory. 

In the body of the page, you should also have `<div id="app">`. This is where the application is going to render to.

Also, it is important you never store anything "private" in your root directory as the whole directory is accessible to public. 

## App directory structure

Your application should follow the MVC pattern. There are three main folders that you should have:

- controllers
- models
- views
    
Then you should also have `routes.json` file. This maps the URL request to a specified controller handler. Checkout 
`examples/notes-app`[examples/notes-app] to understand how routes are maps to the controllers in the application.

## API resource

Suppose you have a resource called 'note' that you want to store and update in a persistent 
storage such as database table. The API resource for note should have following end points and respond in JSON.
They are the default expected endpoints by Procyon. You can override the endpoints in your data model if necessary. 

`/get`
This is to get data from a resource. 
Additionally `id` parameter contains the identification value of the model to be read.  

`/post`
This is to create a new model through API.

`/put`
This is to update a new model through API.
Additionally `id` parameter contains the identification value of the model to be updated.  

`/delete`
This is to delete a model through the API.
Additionally `id` parameter contains the identification value of the model to be deleted.  

`/batch`
This is to perform a specific action for a set of resource items.
The `type` parameter is to be used to specify the action. It can be `read`, `post` etc.
Depending on the type, the `data` parameter can contain different values.
