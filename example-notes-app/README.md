# Notes Example

This example has a simple page that list down a bunch of notes that are fetched from 
the sample backend API. You can also create and update the notes.

## Backend server

### Sinatra (ruby)
To start the backend API server, you need to have Ruby interpreter. Then simply start the 
[Sinatra](https://github.com/sinatra/sinatra#sinatra) web server by executing the following.

`ruby backend-server.rb`

### Flask (python)

The same backend server is available as a Flask app. For this you need to have `flask` and `flask_cors` packages.

Then you can start the Flask backend server by typing 

`FLASK_APP=backend-server.py flask run --host=0.0.0.0 --port=3000`.

## Frontend server

Then start a web server at root directory on port `8080`. For Python 3 that would be, `python -m http.server 8080`

Now access [http://0.0.0.0:8080/example-notes-app.html](http://0.0.0.0:8080/example-notes-app.html)
