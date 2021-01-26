const siloAPIYoutube = require('./siloApplicationAPIYoutube');
const siloUtilisateur = require('./siloApplicationUtilisateur');
const siloPlaylist = require('./siloApplicationPlaylist');
const siloAnnonces = require('./siloApplicationAnnonces');
const {sendError, sendMessage} = require ("./message");
const auth = require ('./auth');
const utf8 = require('utf8');

async function connect_user(email, mdp, res, req) {
    let user_exist = await siloUtilisateur.verify_email_address(email, 1);
    if (user_exist){
        let user_id = await siloUtilisateur.get_user_by_email_mdp(email, mdp, 1);
        if (user_id === -1){
            sendError(res,'Erreur dans le login ou le mot de passe');
        }else{
            auth.setSessionCookie(req, res, {userId:user_id}, 1);
            sendMessage(res,{applicationId: 1, userId: user_id});
        }
    } else{
        sendError(res,'Erreur dans le login ou le mot de passe');
    }
}

module.exports.connect_user = connect_user;

async function create_user(email, nom, prenom, mdp, birthday, genre, res){
    let user_exist = await siloUtilisateur.verify_email_address(email, 1);
    if (user_exist){
        sendError(res,'Le mail est déjà utilisé');
    } else {
        await siloUtilisateur.add_user_playlist_user(email, nom, prenom, mdp, birthday, genre);
        sendMessage(res,'inscrit');
    }
}

module.exports.create_user = create_user;

async function disconnect_user(req){
    await auth.deconnexion(req);
}

module.exports.disconnect_user = disconnect_user;

async function get_name_user(id,res){
    let user_name = await siloUtilisateur.get_name_by_id(id,1);
    sendMessage(res,user_name);

}

module.exports.get_name_user = get_name_user;

async function get_playlist(id,res){
    let playlists = await siloPlaylist.get_playlist_by_user(id);
    sendMessage(res, playlists);

}

module.exports.get_playlist = get_playlist;

async function get_videos_by_playlist(id,res){
    let playlists = await siloPlaylist.get_video_by_playlist(id);

    for(let playlist of playlists){
        playlist.title = utf8.decode(playlist.title);
    }
    sendMessage(res, playlists);
}

module.exports.get_videos_by_playlist = get_videos_by_playlist;

async function get_playlist_name(id,res){
    let playlist = await siloPlaylist.get_playlist_name_by_id(id);
    sendMessage(res, playlist);
}

module.exports.get_playlist_name = get_playlist_name;

async function get_nb_video_by_playlist(id,res){
    let nb = await siloPlaylist.get_nb_video_by_playlist(id);
    sendMessage(res, nb);
}

module.exports.get_nb_video_by_playlist = get_nb_video_by_playlist;

async function delete_playlist(id,res){
    await siloPlaylist.delete_playlist(id);
    sendMessage(res, "suppression reussi");
}

module.exports.delete_playlist = delete_playlist;

async function add_playlist(id,name,res){
    await siloPlaylist.add_playlist(id,name);
    sendMessage(res, "ajout reussi");
}

module.exports.add_playlist = add_playlist;


async function delete_video(idVideo,idPlaylist,res){
    await siloPlaylist.delete_video_on_playlist(idPlaylist,idVideo);
    sendMessage(res, "suppression reussi");
}

module.exports.delete_video = delete_video;



async function get_last_playlist_id(id,res){
    let idplaylist = await siloPlaylist.get_last_playlist_id(id);
    sendMessage(res, idplaylist);
}
module.exports.get_last_playlist_id = get_last_playlist_id;

async function add_video_on_playlist(id,lien,title, id_youtube, res){
    let mot = utf8.encode(title);
    let category = await siloAPIYoutube.get_video_category(id_youtube);
    await siloPlaylist.add_video_on_playlist(id,lien,mot,id_youtube, category);
    sendMessage(res, "ok");
}
module.exports.add_video_on_playlist = add_video_on_playlist;


async function search(term, res, req){
    let videos = await siloAPIYoutube.searchByKeyword(term, 20);
    sendMessage(res, videos);
}
module.exports.search = search;

async function check_connection(res, req){
    let token = await auth.getSession(req);
    sendMessage(res, token);
}

module.exports.check_connection =check_connection

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


async function choose_ad(id_user, res){
    let user_info = await siloUtilisateur.get_age_and_gender(id_user);
    let birthday= user_info.birthday.split('-');
    let date = new Date();

    let age = date.getFullYear() - birthday[0];
    if(date.getMonth()+1<birthday[1]){
        age=age-1;
    } else if(date.getMonth()+1 == birthday[1] && date.getDate()<birthday[2]){
        age=age-1;
    }

    let annonces = await siloAnnonces.get_targeting_for_people(user_info.genre, age);

    let choice = [];
    for (let annonce of annonces){
        let keywords = await siloAnnonces.get_key_words_by_targetting(annonce.id);

        let categories = [];
        for (let keyword of keywords){
            categories.push(keyword.id_motcle);
        }

        let nb_video = await siloPlaylist.get_nb_video_by_user_and_categories(id_user, categories);

        if (nb_video.nb>0){
            choice.push(annonce.id);
        }
    }

    let id_ad = choice[getRandomInt(choice.length)];

    let name_and_id_ad = await siloAnnonces.get_name_and_id_ad(id_ad);

    siloAnnonces.add_occurence(id_ad);

    sendMessage(res, name_and_id_ad);
}
module.exports.choose_ad =choose_ad;

async function add_click(id_ad, res) {
    await siloAnnonces.add_click(id_ad);
    sendMessage(res, 'ok');
}
module.exports.add_click = add_click;

async function create_company(email, mdp, name_business, res) {
    let user_exist = await siloUtilisateur.verify_email_address(email, 2);
    if (user_exist){
        sendError(res,'Le mail est déjà utilisé');
    } else {
        await siloUtilisateur.add_user_business_user(email, mdp, name_business);
        sendMessage(res,'inscrit');
    }
}
module.exports.create_company = create_company;

