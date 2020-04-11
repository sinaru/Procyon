# Notes Example

This example has a simple page that list down a bunch of notes that are fetched from 
the sample backend API.

To start the backend API server, you need to have Ruby interpreter. Then simply start the 
[Sinatra](https://github.com/sinatra/sinatra#sinatra) web server by executing the following.

`ruby backend-server.rb`

The start a web server at root directory on port `8080`. For Python 3 that would be, `python -m http.server 8080`

Now access [http://0.0.0.0:8080/example-notes-app.html](http://0.0.0.0:8080/example-notes-app.html)
