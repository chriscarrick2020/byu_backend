# byu_backend
Backed RestAPI webservice

To run: npm run start

Note: 
* requires devDepenedencies to be installed as well, as 'start' will first run the tests, and then start the server.
* Must have a `TMDB_API_KEY` environment variable that equals a valid TMDB api key.

### Possiblites for future version:
* move the endpoints out of the app.js and into a dedicated endpoint folder.
* create a service folder that containes the endpoint logic.
* create an endpoint folder the containes the endpoint route definitions.
* make it so the port, and url are set using environment variables.
* leverage additonal data from TMDB to provide more data.
* Connect this to a DB and add the ability for users to save their favorite movies.
* Make it so that users can track which movies they've watched and when, so that they can know how recently they watched a movie.
