// ici, on se connecte à la base de données. Ainsi, on pourra utiliser
// db (l'équivalent de PDO) pour réaliser les requêtes mySQL.
const config = require('./config');
const db = require ('./mysqlConnect');

function get_playlist_by_user(id_user){
    const query = `
        SELECT id,nom FROM ${config.database_playlists.mysqlPlaylist} WHERE id_user= ?`;
    const data = [id_user];

    return new Promise((resolve, reject) => {
        db.db_playlists.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.get_playlist_by_user = get_playlist_by_user; // on exporte la fonction

function get_playlist_name_by_id(id){
    const query = `
        SELECT nom FROM ${config.database_playlists.mysqlPlaylist} WHERE id= ?`;
    const data = [id];

    return new Promise((resolve, reject) => {
        db.db_playlists.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0]);
        });
    });
}
module.exports.get_playlist_name_by_id = get_playlist_name_by_id; // on exporte la fonction

function get_nb_video_by_playlist(id){
    const query = `
        SELECT count(*) as nb FROM ${config.database_playlists.mysqlAppartenir} WHERE id_playlist= ?`;
    const data = [id];

    return new Promise((resolve, reject) => {
        db.db_playlists.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0]);
        });
    });
}
module.exports.get_nb_video_by_playlist = get_nb_video_by_playlist; // on exporte la fonction


function get_video_by_playlist(id_playlist){
    const query = `SELECT ${config.database_playlists.mysqlVideo}.id, lien,title FROM ${config.database_playlists.mysqlVideo} 
			INNER JOIN ${config.database_playlists.mysqlAppartenir} ON ${config.database_playlists.mysqlVideo}.id = ${config.database_playlists.mysqlAppartenir}.id_video 
			WHERE ${config.database_playlists.mysqlAppartenir}.id_playlist= ?`;
    const data = [id_playlist];

    return new Promise((resolve, reject) => {
        db.db_playlists.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.get_video_by_playlist = get_video_by_playlist; // on exporte la fonction


function add_video_on_playlist(id_playlist, lien_video, name_video, id_youtube, category){

    db.db_playlists.query(
		// verification que la video n'est pas deja enregistrée
        `SELECT count(*) AS nb FROM ${config.database_playlists.mysqlVideo} WHERE id_youtube=?`,
        [id_youtube],
        (error,result)=>{
            if(error){
                console.log(error);
            } else {
				if(result[0].nb == 0){
					// enregistrer le lien de la video 
                    db.db_playlists.query(
                                `INSERT INTO ${config.database_playlists.mysqlVideo} (lien,title, id_youtube, category) VALUES (?,?,?,?)`,
                                [lien_video,name_video, id_youtube, category]
                            )
				}
				// recupere l'id de la video par rapport au lien
                db.db_playlists.query(
                    `SELECT id FROM ${config.database_playlists.mysqlVideo} WHERE id_youtube=?`,
                    [id_youtube],
                    (error2,result2)=> {
					// verifier que la video appartient pas deja a la playlist
                        db.db_playlists.query(
						`SELECT count(*) as nb FROM ${config.database_playlists.mysqlAppartenir} WHERE id_video=? and id_playlist=?`,
						[result2[0].id,id_playlist],
						(error3,result3)=> {
							if (error3) {
								console.log(error3);
							} else {
									if( result3[0].nb == 0){
										// ajout de la video dans la playlist
                                        db.db_playlists.query(
										`INSERT INTO ${config.database_playlists.mysqlAppartenir} (id_playlist, id_video) VALUES (?, ?)`,
										[id_playlist,result2[0].id]
									)
								}

							}
						}

                        );

                    }

                    );
            }
        }
    );
}
module.exports.add_video_on_playlist = add_video_on_playlist; // on exporte la fonction

function add_playlist(id_user, name){
    db.db_playlists.query(
        `INSERT INTO ${config.database_playlists.mysqlPlaylist} (nom, id_user) VALUES (?, ?)`,
        [name,id_user]

    );
}
module.exports.add_playlist = add_playlist; // on exporte la fonction

function get_last_playlist_id(id_user){
    const query = `SELECT max(id) as idmax FROM ${config.database_playlists.mysqlPlaylist} WHERE id_user = ?`;
    const data = [id_user];

    return new Promise((resolve, reject) => {
        db.db_playlists.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.get_last_playlist_id = get_last_playlist_id;

//add_video_on_playlist(1,"test");

function delete_video_on_playlist(id_playlist,id_video){
    db.db_playlists.query(
        `DELETE FROM ${config.database_playlists.mysqlAppartenir} WHERE id_playlist=? and id_video=? `,
        [id_playlist,id_video],
        (error,result)=>{
            if(error){
                console.log(error);
            } 
        }
    );
}
module.exports.delete_video_on_playlist = delete_video_on_playlist;

function delete_playlist(id_playlist){

    db.db_playlists.query(
        `DELETE FROM ${config.database_playlists.mysqlAppartenir} WHERE id_playlist=?  `,
        [id_playlist],
        (error,result)=>{
            if(error){
                console.log(error);
            }
        }
    );

    db.db_playlists.query(
        `DELETE FROM ${config.database_playlists.mysqlPlaylist} WHERE id=?  `,
        [id_playlist],
        (error,result)=>{
            if(error){
                console.log(error);
            }
        }
    );
}
module.exports.delete_playlist = delete_playlist;

function get_nb_video_by_user_and_categories (id_user, categories){

    let text =`(`;
    let data = [];
    for (let i=0; i<categories.length-1; i++){
        text = text + `?,`;
        data.push(categories[i]);
    }

    text = text + `?)`;
    data.push(categories[categories.length-1]);
    data.push(id_user);

    const query = `SELECT COUNT(id) AS nb FROM ${config.database_playlists.mysqlVideo} INNER JOIN ${config.database_playlists.mysqlAppartenir} `+
    `ON ${config.database_playlists.mysqlAppartenir}.id_video = ${config.database_playlists.mysqlVideo}.id WHERE category IN ` + text +
        `AND id_playlist IN ( SELECT id FROM ${config.database_playlists.mysqlPlaylist} WHERE id_user= ?)`;

    return new Promise((resolve, reject) => {
        db.db_playlists.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0]);
        });
    });

}

module.exports.get_nb_video_by_user_and_categories = get_nb_video_by_user_and_categories;


