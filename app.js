require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token

  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index', { title: 'Home'});
  });

app.get('/artist-search', (req, res) => {
    // res.render('artist-search', { title: 'Artist Search'});
  
spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render('artist-search-results', {artists: data.body.artists.items})
   })
  .catch(err => console.log('The error while searching artists occurred: ', err));
 
  
    console.log(req.query)
});


app.get('/albums/:artistId', (req, res, next) => {
    console.log(req.params)
spotifyApi
.getArtistAlbums(req.params.artistId)
  .then(data => {

    console.log('Artist albums', data.body);
    res.render('albums', {albums: data.body})
    })
    .catch(err => console.log('The error while searching albums occurred: ', err))
  });


app.get('/songs/:artistId', (req, res, next) => {
    console.log(req.params)

  spotifyApi
  .getAlbumTracks(req.params.artistId)
  .then(function(data) {
        res.render('songs', {songs: data.body})
    })
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
