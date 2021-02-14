/**
 * @fileoverview Test file for app.js. It is used to verify that our apps endpoint
 * is properly configured and returns the correct responses.
 */
var expect = require("chai").expect;
var assert = require('chai').assert;
const request = require('request');

const URL = 'http://localhost:3001/movies'


describe("Verify ENV Vars", function() {
    /** A test to verify that we have the correct env_variables set. */

    it('Expects TMDB_API_KEY to exisit as an ENV variable.', function() {
        expect(process.env.TMDB_API_KEY).is.not.undefined
    })
});


describe("Endpoints", function() {
    /** A group of tests for our collection of endpoints */
    var server;
    before(function (done) {
        server = require('../app');
        done();
    });

    after(function(done) {
        delete require.cache[require.resolve( '../app' )];
        done();
    });

    describe("GET - /movies", function() {
        /** A group of tests for the GET endpoint */

        it("returns statusCode: 400, body equals: {'error': 'missing search query parameter'}", function(done) {
            /**
             * Should return a 400 Bad Request if no query params are provided,
             * along with a message explaining what went wrong.
             */
            request({method: 'GET', uri: URL}, function(_, response, body) {
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal('{"error":"missing search query parameter"}');
                done();
            });
        });

        let bad_get_url = `${URL}?bad_query_param=Bond`
        it("returns statusCode: 400, body equals: {'error': 'invalid query parameter'}", function(done) {
            /**
             * Should return a 400 Bad Request when and invalid query parameter is provided,
             * along with a message explaining what went wrong.
             */
            request({method: 'GET', uri: bad_get_url}, function(_, response, body) {
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal('{"error":"invalid query parameter"}');
                done();
            });
        });

        bad_get_url = `${URL}?search`
        it("returns statusCode: 400, body equals: {'error': 'invalid query parameter'}", function(done) {
            /**
             * Should return a 400 Bad Request when there is no query parameter provided,
             * along with a message explaining what went wrong.
             */
            request({method: 'GET', uri: bad_get_url}, function(_, response, body) {
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal('{"error":"invalid query parameter"}');
                done();
            });
        });

        let good_get_url = `${URL}?search=Bond`
        it("returns statusCode: 200, body returns an array of ten movie objects", function(done) {
            /** Should return a 200 status code, and an array of no more than 10 movie objects. */
            request({method: 'GET', uri: good_get_url}, function(_, response, body) {
                /**
                 * movie objects should adhere to the following contract:
                 * {
                 *      "movie_id": integer,
                 *      "title": string,
                 *      "poster_image_url": string, (https://developers.themoviedb.org/3/getting-started/images)
                 *      "popularity_summary": string, (i.e. "{popularity} out of {vote_count}")
                 * }
                 */
                let body_json = JSON.parse(body)
                let body_keys = ['movie_id', 'title', 'poster_image_url', 'popularity_summary']
                expect(response.statusCode).to.equal(200);
                expect(body_json.length).to.be.within(5, 10);
                assert.isTrue(body_json.length <= 10)
                for (let i = 0; i < body_json.length; i++){
                    expect(body_json[i]).to.have.keys(body_keys);
                };
                done();
            });
        });
    });

    describe("OPTIONS - /movies", function() {
        /** A group of tests for the OPTIONS endpoint */

        it("returns statusCode: 204, used for cors requests.", function(done) {
            request({method: 'OPTIONS', uri: URL}, function(_, response, _) {
                /** Used to test that cors will work. */
                expect(response.statusCode).to.equal(204);
                done();
            });
        });

    });

    describe("POST - /movies", function() {
        /** A group of tests for the POST endpoint */

        it("returns statusCode: 404 as this endpoint is not implemented.", function(done) {
            request({method: 'POST', uri: URL}, function(_, response, _) {
                /** Used to test that post returns a 404. */
                expect(response.statusCode).to.equal(404);
                done();
            });
        });

    });

    describe("PUT - /movies", function() {
        /** A group of tests for the PUT endpoint */

        it("returns statusCode: 404 as this endpoint is not implemented.", function(done) {
            request({method: 'PUT', uri: URL}, function(_, response, _) {
                /** Used to test that put returns a 404. */
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });

    describe("DELETE - /movies", function() {
        /** A group of tests for the DELETE endpoint */

        it("returns statusCode: 404 as this endpoint is not implemented.", function(done) {
            request({method: 'DELETE', uri: URL}, function(_, response, _) {
                /** Used to test that delete returns a 404. */
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });
});
