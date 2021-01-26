// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// Get our API routes
const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cross Origin middleware

const cors = require ('cors');
app.use(cors({origin: 'http://localhost:4200', credentials: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());


// _Get port from environment and store in Express.

const port = process.env.PORT || '3000';
app.set('port', port);

// _Create HTTP server._
const server = http.createServer(app);

const applicationVideo = require ('./routes/applicationVideo');

app.post ('/checkLogin', (req, res) => {
    applicationVideo.connect_user(req.body.email, req.body.mdp, res, req);
});

app.post ('/checkLoginCompany', (req, res) => {
    applicationAnnonces.connect_company(req.body.email, req.body.mdp, res, req);
});

app.post ('/checkConnection', (req, res) => {
    applicationVideo.check_connection(res,req);
});

app.post ('/create_user', (req, res) => {
    applicationVideo.create_user(req.body.email, req.body.nom, req.body.prenom, req.body.mdp, req.body.birthday, req.body.genre, res);
});

app.post ('/disconnect_user', (req, res) => {
    applicationVideo.disconnect_user(req);
});

app.post('/search_videos', (req, res) => {
    applicationVideo.search(req.body.term, res, req);
});

app.post ('/get_username', (req, res) => {
    applicationVideo.get_name_user(req.body.id, res);
});

app.post ('/get_playlist', (req, res) => {
    applicationVideo.get_playlist(req.body.id, res);
});

app.post ('/get_videos_playlist', (req, res) => {
    applicationVideo.get_videos_by_playlist(req.body.id, res);
});

app.post ('/get_playlist_name', (req, res) => {
    applicationVideo.get_playlist_name(req.body.id, res);
});

app.post ('/get_nb_video', (req, res) => {
    applicationVideo.get_nb_video_by_playlist(req.body.id, res);
});

app.post ('/delete_playlist', (req, res) => {
    applicationVideo.delete_playlist(req.body.id, res);
});

app.post ('/delete_video', (req, res) => {
    applicationVideo.delete_video(req.body.idVideo,req.body.idPlaylist, res);
});

app.post ('/add_playlist', (req, res) => {
    applicationVideo.add_playlist(req.body.id,req.body.name, res);
});

app.post ('/get_last_playlist', (req, res) => {
    applicationVideo.get_last_playlist_id(req.body.id, res);
});

app.post ('/add_video_playlist', (req, res) => {
    applicationVideo.add_video_on_playlist(req.body.id,req.body.url,req.body.title, req.body.id_youtube, res);
});

app.post ('/choose_ad', (req, res) => {
    applicationVideo.choose_ad(req.body.id, res);
});

app.post ('/add_click', (req, res) => {
    applicationVideo.add_click(req.body.id, res);
});

app.post ('/create_company', (req, res) => {
    applicationVideo.create_company(req.body.email, req.body.mdp, req.body.company, res);
});

const applicationAnnonces = require('./routes/applicationAnnonces');
app.post('/annonces', (req, res)=>{
    applicationAnnonces.print_advertisement_by_user(req.body.id_entreprise, res);
});
app.post('/get_keywords', (req, res) => {
    applicationAnnonces.get_all_keywords(res);
});
app.post('/create_new_ad', (req, res) => {
    applicationAnnonces.create_new_advertisement(req.body.id_entreprise, req.body.keywords, req.body.name, req.body.photo,
        req.body.gender, req.body.agemin, req.body.agemax, req.body.datedeb, req.body.datefin, res);
});
app.post('/get_details', (req, res) =>{
    applicationAnnonces.get_advertisement_and_keywords(req.body.id_ciblage, res);
});
app.post('/delete_advertisement', (req, res)=>{
    applicationAnnonces.delete_advertisement(req.body.id_ciblage, res);
});
app.post('/modify_advertisement', (req, res)=>{
    applicationAnnonces.modify_advertisement(req.body.id_ciblage, req.body.name, req.body.photo, res);
});
app.post('/get_categories_api', (req, res) => {
    applicationAnnonces.get_categories_api(res);
})
app.post('/get_category_name', (req, res)=>{
    applicationAnnonces.get_category_by_id(req.body.id_category, res);
})


app.post('/number_people_targetting', (req, res)=>{
    applicationAnnonces.number_people_targetting_for_an_ad(req.body.id_ad,res);
})

app.post('/number_people_targetting_realtime', (req, res)=>{
    applicationAnnonces.number_people(req.body.agemin, req.body.agemax, req.body.gender, req.body.keywords, res);
})

app.post('/name_company', (req, res)=>{
    applicationAnnonces.getCompanyName(req.body.id, res);
})

server.listen(port, () => console.log(`API running on localhost:${port}`));

