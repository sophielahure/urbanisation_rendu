const config = require('./config');
const mysql = require('mysql');

const db_playlist_utilisateur = mysql.createConnection({
    host: config.connexion.mysqlHost,
    user: config.connexion.mysqlLogin,
    password: config.connexion.mysqlPassword,
    database: config.database_playlist_utilisateur.mysqlDatabase
});

db_playlist_utilisateur.connect();
module.exports.db_playlist_utilisateur = db_playlist_utilisateur;

const db_playlist_entreprise = mysql.createConnection({
    host: config.connexion.mysqlHost,
    user: config.connexion.mysqlLogin,
    password: config.connexion.mysqlPassword,
    database: config.database_playlist_entreprise.mysqlDatabase
});

db_playlist_entreprise.connect();
module.exports.db_playlist_entreprise = db_playlist_entreprise;

const db_playlists = mysql.createConnection({
    host: config.connexion.mysqlHost,
    user: config.connexion.mysqlLogin,
    password: config.connexion.mysqlPassword,
    database: config.database_playlists.mysqlDatabase
});

db_playlists.connect();
module.exports.db_playlists = db_playlists;

const db_playlist_annonce = mysql.createConnection({
    host: config.connexion.mysqlHost,
    user: config.connexion.mysqlLogin,
    password: config.connexion.mysqlPassword,
    database: config.database_playlist_annonce.mysqlDatabase
});

db_playlist_annonce.connect();
module.exports.db_playlist_annonce = db_playlist_annonce;

const db_cookies = mysql.createConnection({
    host: config.connexion.mysqlHost,
    user: config.connexion.mysqlLogin,
    password: config.connexion.mysqlPassword,
    database: config.database_cookies.mysqlDatabase
});

db_cookies.connect();
module.exports.db_cookies = db_cookies;

