const config = require('./config');
const db = require ('./mysqlConnect');

function add_cookie(token, expiration_date){
    const query =`INSERT INTO ${config.database_cookies.mysqlCookie} (token, expiration_date) VALUES (?, ?)`;
    const data = [token, expiration_date];

    return new Promise((resolve, reject) => {
        db.db_cookies.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });

}
module.exports.add_cookie = add_cookie;

function token_is_good(token){
    const query = `
        SELECT COUNT(id) AS nb FROM ${config.database_cookies.mysqlCookie} WHERE token= ?`;
    const data = [token];

    return new Promise((resolve, reject) => {
        db.db_cookies.query(query, data, (err, rows) => {
            if (err) return reject(err);
            let res= true;
            if(rows[0].nb!==0){
                res=false;
            }
            resolve(res);
        });
    });
}
module.exports.token_is_good = token_is_good; // on exporte la fonction


