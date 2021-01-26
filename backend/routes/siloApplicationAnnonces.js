const config = require('./config');
const db = require('./mysqlConnect');
const {sendError, sendMessage} = require ("./message");


//retourne toutes les annonces d'une entreprise
function get_advertisement_by_user(id_entreprise, res){
    const query = 'SELECT * FROM ciblage WHERE id_entreprise= ?';
    const data = [id_entreprise];
    return new Promise((resolve, reject)=>{
        db.db_playlist_annonce.query(query, data, (err,rows) => {
            if(err) return reject(err);
            return resolve(rows);
        });
    });
}

module.exports.get_advertisement_by_user = get_advertisement_by_user;

//associer les mots cles aux annonces
function associate_keywords_advertisement(id_ciblage, mots_cles){
    const promises = [];
    for(const id_mot of mots_cles){
        const query = "INSERT INTO association (id_ciblage, id_motcle) VALUES (?, ?)";
        const data = [id_ciblage, id_mot];

        let p = new Promise((resolve, reject)=>{
            db.db_playlist_annonce.query(query, data, (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0]);
            });
        });
        promises.push(p);

    }
    return Promise.all(promises);
}
module.exports.associate_keywords_advertisement = associate_keywords_advertisement;


//recuperer l'id d'une annonce
function get_id_advertisement(id_entreprise, nom, photo, genre, agemin, agemax, datedeb, datefin){
    const query = 'SELECT id FROM ciblage WHERE id_entreprise = ? AND nom=? AND photo=? AND genre=? AND ' +
        'agemin=? AND agemax=? AND datedeb=? AND datefin=?';
    const data = [id_entreprise, nom, photo, genre, agemin, agemax, datedeb, datefin];

    return new Promise((resolve, reject) => {
        db.db_playlist_annonce.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0].id);
        });
    });

}
module.exports.get_id_advertisement = get_id_advertisement;

//ajouter une annonce (ciblage)
function add_advertisement(id_entreprise, mots_cles,nom, photo, genre, agemin, agemax, datedeb, datefin){
    const query = 'INSERT INTO ciblage (nom, photo, genre, agemin, agemax, datedeb, datefin, id_entreprise) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?) ';
    const data = [nom, photo, genre, agemin, agemax, datedeb, datefin, id_entreprise];

    return new Promise((resolve, reject) => {
        db.db_playlist_annonce.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0]);
        });
    });
}
module.exports.add_advertisement = add_advertisement; // on exporte la fonction

//ajouter une annonce et l'association des mots-clés
function add_advertisement_and_keywords(id_entreprise, mots_cles,nom, photo, genre, agemin, agemax, datedeb, datefin){
    add_advertisement(id_entreprise, mots_cles, nom, photo, genre, agemin, agemax, datedeb, datefin);
    get_id_advertisement(id_entreprise, nom, photo, genre, agemin, agemax, datedeb, datefin).then(function(result){
        associate_keywords_advertisement(result, mots_cles);
    });

}
module.exports.add_advertisement_and_keywords = add_advertisement_and_keywords; // on exporte la fonction

//modifier une annonce
function modify_advertisement(id_ciblage, nom, photo, genre, agemin, agemax, datedeb, datefin){
    const query = 'UPDATE ciblage SET nom=?, photo=?, genre=?, agemin=?, agemax=?, datedeb=?, datefin=? WHERE id=?';
    const data = [nom, photo, genre, agemin, agemax, datedeb, datefin, id_ciblage];

    db.db_playlist_annonce.query(query, data, function(err, result) {
            if (err) throw err;
            });

}
module.exports.modify_advertisement = modify_advertisement;

function modify_advertisement_name_photo(id_ciblage, nom, photo){
    const query = 'UPDATE ciblage SET nom=?, photo=? WHERE id=?';
    const data = [nom, photo, id_ciblage];
    db.db_playlist_annonce.query(query, data, function(err, result) {
        if (err) throw err;
    });
}
module.exports.modify_advertisement_name_photo = modify_advertisement_name_photo;

//supprimer les mots-clés d'une annonce
function delete_keywords_advertisement(id_ciblage){
    const query = "DELETE FROM association where id_ciblage = ?";
    const data = [id_ciblage];

    db.db_playlist_annonce.query(query, data, function(err, result){
        if(err) throw err;
    });
}
module.exports.delete_keywords_advertisement = delete_keywords_advertisement;

//modifier les mots-clés d'une annonce
function modify_keywords_advertisement(id_ciblage, mots_cles ){
    delete_keywords_advertisement(id_ciblage);
    associate_keywords_advertisement(id_ciblage, mots_cles);
}
module.exports.modify_keywords_advertisement = modify_keywords_advertisement;

function modify_advertisement_and_keywords(id_ciblage, nom, photo, genre, agemin, agemax, datedeb, datefin, mots_cles){
    modify_advertisement(id_ciblage, nom, photo, genre, agemin, agemax, datedeb, datefin);
    modify_keywords_advertisement(id_ciblage, mots_cles);
}
module.exports.modify_advertisement_and_keywords = modify_advertisement_and_keywords;

function delete_advertisement(id_ciblage){
    const query = "DELETE FROM ciblage where id = ?";
    const data = [id_ciblage];

    db.db_playlist_annonce.query(query, data, function(err, result){
        if(err) throw err;
    });

    delete_keywords_advertisement(id_ciblage);
}

module.exports.delete_advertisement = delete_advertisement;

function get_all_keywords(){
    const query = 'SELECT id, mot FROM mot_cle';
    const data = [];

    return new Promise((resolve, reject)=>{
        db.db_playlist_annonce.query(query, data, (err,rows) => {
            if(err) return reject(err);
            resolve(rows);
        });
    });
}

module.exports.get_all_keywords = get_all_keywords;

function get_keywords_advertisement(id_ciblage){
    const query = "SELECT mot FROM mot_cle INNER JOIN association ON mot_cle.id = association.id_motcle " +
        "WHERE association.id_ciblage = ?";
    const data = [id_ciblage];
    return new Promise((resolve, reject)=>{
        db.db_playlist_annonce.query(query, data, (err,rows) => {
            if(err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.get_keywords_advertisement = get_keywords_advertisement;

function get_advertisement(id_ciblage){
    const query = "SELECT * FROM ciblage WHERE id = ?";
    const data = [id_ciblage];
    return new Promise((resolve, reject) => {
        db.db_playlist_annonce.query(query, data, (err,rows)=>{
            if(err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.get_advertisement = get_advertisement;

function get_keywords_and_advertisement(id_ciblage){
    promises = [];
    // const query = "SELECT id, nom, id_motcle FROM ciblage, association WHERE ciblage.id = association.id_ciblage and ciblage.id = ?";
    const query = "SELECT * FROM ciblage WHERE id=?";
    const data = [id_ciblage];
    let p1 =  new Promise((resolve, reject) => {
        db.db_playlist_annonce.query(query, data, (err,rows)=>{
            if(err) return reject(err);
            res = [];


            let details = [rows[0].id, rows[0].nom, rows[0].photo, rows[0].genre, rows[0].agemin, rows[0].agemax,
                rows[0].datedeb, rows[0].datefin, rows[0].id_entreprise];
            res.push(details);

            resolve(res);
        });

    });
    promises.push(p1);
    const query2 = "SELECT id_motcle FROM association WHERE id_ciblage = ?";
    const data2 = [id_ciblage];
    let p2 =  new Promise((resolve, reject) => {
        db.db_playlist_annonce.query(query2, data2, (err,rows)=>{
            if(err) return reject(err);
            res2 = [];
            for(i=0;i<rows.length;i++){
                res2.push(rows[i].id_motcle);
            }
            resolve(res2);
        });

    });
    promises.push(p2);
    //  return final_result;
    return Promise.all(promises);
}
module.exports.get_keywords_and_advertisement = get_keywords_and_advertisement;

function add_appearance(id_ciblage){
    const query = `UPDATE ${config.database_playlist_annonce.mysqlCiblage} SET number_of_appearances=number_of_appearances+1 WHERE id=?`;
    const data = [id_ciblage];
    return new Promise((resolve, reject)=>{
        db.db_playlist_annonce.query(query, data, (err,rows) => {
            if(err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.add_appearance = add_appearance;


function add_click(id_ad){
    const query = `UPDATE ${config.database_playlist_annonce.mysqlCiblage} SET number_of_clicks=number_of_clicks+1 WHERE id=?`;
    const data = [id_ad];
    db.db_playlist_annonce.query(query, data);
}
module.exports.add_click = add_click;

function add_occurence(id_ad){
    const query = `UPDATE ${config.database_playlist_annonce.mysqlCiblage} SET number_of_appearances=number_of_appearances+1 WHERE id=?`;
    const data = [id_ad];
    db.db_playlist_annonce.query(query, data);
}
module.exports.add_occurence = add_occurence;

function get_targeting_for_people(genre, age){
    let date = new Date();
    let month = date.getMonth() + 1;
    let today_date = date.getFullYear() + '-' + month  + '-' + date.getDate();
    const query = `
            SELECT id FROM ${config.database_playlist_annonce.mysqlCiblage} 
            WHERE genre=? AND agemin<=? AND agemax>=? AND datedeb<=? AND datefin>=?`;
    const data = [genre, age, age, today_date, today_date];
    return new Promise((resolve, reject)=>{
        db.db_playlist_annonce.query(query, data, (err,rows) => {
            if(err) return reject(err);
            resolve(rows);
        });
    });
}

module.exports.get_targeting_for_people = get_targeting_for_people;

function get_key_words_by_targetting(id_targetting){
    const query = `
            SELECT id_motcle FROM ${config.database_playlist_annonce.mysqlAssociation} 
            WHERE id_ciblage=?`;
    const data = [id_targetting];
    return new Promise((resolve, reject)=>{
        db.db_playlist_annonce.query(query, data, (err,rows) => {
            if(err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.get_key_words_by_targetting = get_key_words_by_targetting;

function get_name_and_id_ad(id_ad){
    const query = `
            SELECT id, nom FROM ${config.database_playlist_annonce.mysqlCiblage} 
            WHERE id=?`;
    const data = [id_ad];
    return new Promise((resolve, reject)=>{
        db.db_playlist_annonce.query(query, data, (err,rows) => {
            if(err) return reject(err);
            resolve(rows[0]);
        });
    });
}
module.exports.get_name_and_id_ad = get_name_and_id_ad;

function get_ad_by_id(id_ad){
    const query = `
            SELECT genre, agemin, agemax FROM ${config.database_playlist_annonce.mysqlCiblage} 
            WHERE id=?`;
    const data = [id_ad];
    return new Promise((resolve, reject)=>{
        db.db_playlist_annonce.query(query, data, (err,rows) => {
            if(err) return reject(err);
            resolve(rows[0]);
        });
    });
}
module.exports.get_ad_by_id = get_ad_by_id;

