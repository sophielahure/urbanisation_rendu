const connexion = {
    // paramètres de connexion à la base de données
    mysqlHost:     'db',
    charset:       'utf8',
    mysqlLogin:    'root',
    mysqlPassword: 'root',
};

/*const connexion = {
    // paramètres de connexion à la base de données
    mysqlHost:     'localhost',
    charset:       'utf8',
    mysqlLogin:    'root',
    mysqlPassword: '',
};*/

module.exports.connexion = connexion;

const database_playlist_utilisateur = {
    mysqlDatabase: 'playlist_utilisateur',
    mysqlCompte: 'compte'
};

module.exports.database_playlist_utilisateur = database_playlist_utilisateur;

const database_playlist_entreprise = {
    mysqlDatabase: 'playlist_entreprise',
    mysqlCompte: 'compte'
};

module.exports.database_playlist_entreprise = database_playlist_entreprise;

const database_playlists = {
    mysqlDatabase: 'playlist_playlist',
    // les noms des tables
    mysqlAppartenir: 'appartenir',
    mysqlPlaylist: 'playlist',
    mysqlVideo: 'video',
};
module.exports.database_playlists = database_playlists;

const database_playlist_annonce = {
    mysqlDatabase: 'playlist_annonce',
    // les noms des tables
    mysqlAssociation: 'association',
    mysqlCiblage: 'ciblage',
    mysqlMotcle: 'mot_cle'
};
module.exports.database_playlist_annonce = database_playlist_annonce;

const database_cookies = {
    mysqlDatabase: 'playlist_cookies',
    // les noms des tables
    mysqlCookie: 'cookie',
}
module.exports.database_cookies = database_cookies;
