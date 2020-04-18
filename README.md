# Procyon

_A lazy loading front end framework for backend APIs_

## What is Procyon?

This is a conceptual front-end framework designed to be integrated with a JSON REST API.
Procyon will handle the route mappings, rendering of static and dynamic content, data management with the API.

Procyon can be used for "multi-page" front-end application development. Procyon uses MVC design pattern to support multi-page request handling.

### API resource

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

## Creating your app

Essentially this repo itself is Procyon. You just need to serve the root directory from your web server. It is that simple to get you starting. 
So you should copy or clone the directory first. If you have Python 3, you can start a web server by using `http` module. 

```
python3 -m http.server
```

Then create an HTML file. This is going to be your landing page that will handle all the requests. For example take a look at
[example-welcome-page.html](example-welcome-page.html). 

Also, it is important you never store anything "private" in your root directory as the whole directory is accessible to public. 

## Development

The `lib` folder contains all the core and library files of Procyon. Your application
code have to be put in a separate directory such as `app`.

The `path` parameter in the URL can be used to set navigation route. The `routes.json` file in the app directory 
specify what path should be handled by what controller and action.

The `controller` directory contains the classes that is used to handle each request. 

Each class of a controller should inherit directly or as a sub class of a Controller class.

The `views` directory contains the view files that can be used in the controller action to render content.
Each view class should be inherited from View class.

Templates to be used by the views are locate in `templates` directory. 

The `models` directory contains the data models for each API resource. 
