const config = require('./config');
const db = require ('./mysqlConnect');

function verify_email_address (email, id_application){
    return new Promise((resolve, reject) => {
        if (id_application ===1){
            const query = `
            SELECT COUNT(id) AS nb FROM ${config.database_playlist_utilisateur.mysqlCompte} 
            WHERE email= ?`;
            const data = [email];
            db.db_playlist_utilisateur.query(query, data, (err, rows) => {
                if (err) return reject(err);
                let res= true;
                if(rows[0].nb===0){
                    res=false;
                }
                resolve(res);
            });
        } else if (id_application ===2) {
            const query = `
            SELECT COUNT(id) AS nb FROM ${config.database_playlist_entreprise.mysqlCompte} 
            WHERE email= ?`;
            const data = [email];
            db.db_playlist_entreprise.query(query, data, (err, rows) => {
                if (err) return reject(err);
                let res= true;
                if(rows[0].nb===0){
                    res=false;
                }
                resolve(res);
            });
        } else {
            reject('id application not exists');
        }
    });
}

module.exports.verify_email_address  = verify_email_address ;

async function get_user_by_email_mdp (email, mdp, id_application){
    if(await verify_email_address (email, id_application)){
        return new Promise((resolve, reject) => {
            if (id_application ===1){
                const query = `
                SELECT id, mdp FROM ${config.database_playlist_utilisateur.mysqlCompte} 
                WHERE email= ?`;
                const data = [email];
                db.db_playlist_utilisateur.query(query, data, (err, rows) => {
                    if (err) return reject(err);
                    let res= rows[0].id;
                    if(rows[0].mdp!==mdp){
                        res=-1;
                    }
                    resolve(res);

                });
            } else if (id_application ===2) {
                const query = `
                SELECT id, mdp FROM ${config.database_playlist_entreprise.mysqlCompte} 
                WHERE email= ?`;
                const data = [email];
                db.db_playlist_entreprise.query(query, data, (err, rows) => {
                    if (err) return reject(err);
                    let res= rows[0].id;
                    if(rows[0].mdp!==mdp){
                        res=-1;
                    }
                    resolve(res);
                });
            } else {
                reject('id application not exists');
            }
        });
    } else {
        return -1;
    }
}

module.exports.get_user_by_email_mdp  = get_user_by_email_mdp ;

function get_name_by_id (id_user, id_application){
    return new Promise((resolve, reject) => {
        if (id_application ===1){
            const query = `
                SELECT nom, prenom FROM ${config.database_playlist_utilisateur.mysqlCompte} 
                WHERE id= ?`;
            const data = [id_user];
            db.db_playlist_utilisateur.query(query, data, (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0]);

            });
        } else if (id_application ===2) {
            const query = `
                SELECT entreprise FROM ${config.database_playlist_entreprise.mysqlCompte} 
                WHERE id= ?`;
            const data = [id_user];
            db.db_playlist_entreprise.query(query, data, (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0]);
            });
        } else {
            reject('id application not exists');
        }
    });
}

module.exports.get_name_by_id  = get_name_by_id;

function add_user_business_user (email, mdp, name_business){
    const query =`INSERT INTO ${config.database_playlist_entreprise.mysqlCompte} (entreprise, email, mdp) VALUES (?, ?, ?)`;
    const data = [name_business, email, mdp];

    return new Promise((resolve, reject) => {
        db.db_playlist_entreprise.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

module.exports.add_user_business_user  = add_user_business_user;

function add_user_playlist_user (email, nom, prenom, mdp, birthday, genre){
    const query =`INSERT INTO ${config.database_playlist_utilisateur.mysqlCompte} (nom, prenom, genre, datenaissance, email, mdp) VALUES (?, ?, ?, ?, ?, ?)`;
    const data = [nom, prenom, genre, birthday, email, mdp];

    return new Promise((resolve, reject) => {
        db.db_playlist_utilisateur.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

module.exports.add_user_playlist_user  = add_user_playlist_user;

function get_age_and_gender(id){
    const query =`SELECT genre, DATE_FORMAT(datenaissance, "%Y-%m-%d") as birthday FROM ${config.database_playlist_utilisateur.mysqlCompte} WHERE id=?`;
    const data = [id];

    return new Promise((resolve, reject) => {
        db.db_playlist_utilisateur.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0]);
        });
    });
}

module.exports.get_age_and_gender  = get_age_and_gender;

function get_people_by_age_and_gender(date_min, date_max, gender){
    const query =`SELECT id FROM ${config.database_playlist_utilisateur.mysqlCompte} WHERE genre=? AND datenaissance>=? AND datenaissance<?`;
    const data = [gender, date_min, date_max];

    return new Promise((resolve, reject) => {
        db.db_playlist_utilisateur.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

module.exports.get_people_by_age_and_gender  = get_people_by_age_and_gender;

function get_people_by_age(date_min, date_max){
    const query =`SELECT id FROM ${config.database_playlist_utilisateur.mysqlCompte} WHERE datenaissance>=? AND datenaissance<?`;
    const data = [date_min, date_max];

    return new Promise((resolve, reject) => {
        db.db_playlist_utilisateur.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

module.exports.get_people_by_age  = get_people_by_age;
