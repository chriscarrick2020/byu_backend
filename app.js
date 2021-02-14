/**
 * @fileoverview This our app. It serves as RestAPI webservice that is used to
 * return formatted movie responses to the requester.
 */
const express = require("express");
const request = require('request');
const cors = require('cors')
const app = express();
const port = 3001;
const API_KEY = process.env.TMDB_API_KEY;

app.options('/movies', cors(), (_, res) => {
    /**
     * Define the 'OPTIONS' request for the `/movies` endpoint.
     * @param req An express request object.
     * @param res An express response object.
     */
    res.status(204).send();
});

app.get('/movies', cors(), (req, res) => {
    /**
     * Define the 'OPTIONS' request for the `/movies` endpoint.
     * @param req An express request object.
     * @param response An express response object.
     */
    const query_params = req.query
    const search_parameter = query_params.search;
    if (query_params === {} || !('search' in query_params)) {
        // return a 400 response if there are no query parameters or if search
        // is not in the query paramters.
        res.status(400).send({error: 'missing search query parameter'});
        return;
    } else if (Object.size(query_params) > 1 || !query_params.search) {
        // return a 400 respone if there are query parameters but 'search' is not one of them
        // or if there are additional query parameters we were not expecting.
        res.status(400).send({error: 'invalid query parameter'});
        return;
    } else if (!search_parameter) {
        // the query parameter 'search' exisits but is undefined.
        res.status(400).send({error: 'missing search query paramater value'});
        return;
    }

    const the_movie_db_url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${search_parameter}&page=1&include_adult=false`;
    request({method: 'GET', uri:the_movie_db_url}, function(error, response, body) {
        if (error) {
            response.status(500).send({error: error})
        }
        let response_body = []
        let body_json = JSON.parse(body);

        for (var i = 0; i < 10; i++)
        {
            if (!body_json.results[i]) {
                // Only add what we have. If we have less than 10 stop adding to response_body array.
                break;
            }

            // Build the response object.
            let poster_path = body_json.results[i].poster_path
            if (poster_path != null) {
                poster_path = `https://image.tmdb.org/t/p/w500/${body_json.results[i].poster_path}`
            }
            response_body.push({
                movie_id: body_json.results[i].id,
                title: body_json.results[i].title,
                poster_image_url: poster_path,
                popularity_summary: `${body_json.results[i].popularity} out of ${body_json.results[i].vote_count}`
            })
        }
        res.status(200).send(response_body)
        return;
    })
});

app.post('/movies', cors(), (_, res) => {
    /**
     * Define the 'POST' request for the `/movies` endpoint.
     * @param req An express request object.
     * @param res An express response object.
     */
    res.status(404).send();
});

app.put('/movies', cors(), (_, res) => {
    /**
     * Define the 'PUT' request for the `/movies` endpoint.
     * @param req An express request object.
     * @param res An express response object.
     */
    res.status(404).send();
});

app.delete('/movies', cors(), (_, res) => {
    /**
     * Define the 'DELETE' request for the `/movies` endpoint.
     * @param req An express request object.
     * @param res An express response object.
     */
    res.status(404).send();
});


app.listen(port, () => {
    /** Start the app. */
    console.log(`App running. Listening on http://localhost:${port}`)
    app.emit("app_started")
});

/**
 * Borrowed from: https://stackoverflow.com/questions/5223/length-of-a-javascript-object
 */
Object.size = function(obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };
