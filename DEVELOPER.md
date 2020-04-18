## Procyon Development

The `lib` directory contains all the core and library files of Procyon. Your application
code have to be put in a separate directory such as `app`.

The `path` parameter in the URL can be used to set navigation route. The `routes.json` file in the app directory 
specify what path should be handled by what controller and action.

The `controller` directory contains the classes that is used to handle each request. 

Each class of a controller should inherit directly or as a sub class of a Controller class.

The `views` directory contains the view files that can be used in the controller action to render content.
Each view class should be inherited from View class.

Templates to be used by the views are locate in `templates` directory. 

The `models` directory contains the data models for each API resource. 
