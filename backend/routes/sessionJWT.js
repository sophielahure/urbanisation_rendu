const sessionJWT = require ('jsonwebtoken');
const fs = require ('fs');
const siloCookies = require('./siloCookies');

// renvoie un nouveau token JWT
function createSessionJWT (userId, applicationId) {
    const RSA_PRIVATE_KEY = fs.readFileSync('./routes/keys/jwtRS256.key');

    const jwtToken = sessionJWT.sign(
        {
            userId: userId,
            applicationId: applicationId,
            midExp: Math.floor(Date.now() / 1000) + 1800 // validité: 30mn
        },
        RSA_PRIVATE_KEY,
        {
            algorithm: 'RS256',
            expiresIn: '1h' // champ exp: validité 1h
    });

    return jwtToken;
}


// crée un cookie de session JWT (Si le JWT de la requête est encore valide,
// on l'utilise, sinon on en recrée un nouveau)
function createSessionCookie(req, res, payload, applicationId) {
    // on regarde si le payload contient les champs userId et midExp. Si c'est le
    // cas, c'est qu'on a reçu dans la request un cookie. On va donc vérifier si
    // ce cookie est encore valide ou non : si la date actuelle est inférieure à
    // midExp, alors le cookie est encore valide et on peut le renvoyer. Sinon,
    // on doit recalculer un nouveau cookie.
    let jwtToken = '';
    if ((typeof payload.userId !== 'undefined') && false &&
        (typeof payload.midExp !== 'undefined') &&
        (Math.floor(Date.now() / 1000) <= payload.midExp)) {
        jwtToken = req.cookies.SESSIONID;
    }
    else {
        // on crée un nouveau cookie
        jwtToken = createSessionJWT(payload.userId, applicationId);
    }

    // on renvoie le cookie au client
    // on met le secure à false afin de pouvoir utiliser http plutôt que https
    res.cookie('SESSIONID', jwtToken, {});
}
module.exports.createSessionCookie = createSessionCookie;


// décode un cookie de session et renvoie les informations contenues dans ce
// cookie, notamment le userId. Si le cookie n'existe pas, la fonction renvoie
// juste un objet avec un userId égal à -1.
async function decodeSessionCookie(req) {
    // si l'on n'a pas de cookie de session, on renvoie une session avec vide,
    // avec juste un userId à -1

    if (typeof req.cookies.SESSIONID === 'undefined') {
        return { userId: -1 };
    }

    const sessionid = req.cookies.SESSIONID;

    let cookie_session_wrong = await siloCookies.token_is_good(sessionid);

    if(!cookie_session_wrong){
        return {userId: -1};
    }

    // on lit la clef publique
    const RSA_PUBLIC_KEY = fs.readFileSync('./routes/keys/jwtRS256.key.pub');

    // on récupère les données du cookie
    try {
        const token = sessionJWT.verify(
            sessionid,
            RSA_PUBLIC_KEY,
            {algorithm: 'RS256'});

        return token;
    }
    catch (err) {
        return {userId: -1};
    }
}
module.exports.decodeSessionCookie = decodeSessionCookie;

function createSessionJWTExpired () {
    const RSA_PRIVATE_KEY = fs.readFileSync('./routes/keys/jwtRS256.key');
    const jwtToken = sessionJWT.sign(
        {
            userId: '',
            midExp: Math.floor(Date.now() / 1000) + 86400000 // validité: 30mn
        },
        RSA_PRIVATE_KEY,
        {
            algorithm: 'RS256'
        });

    return jwtToken;
}
module.exports.createSessionJWTExpired = createSessionJWTExpired;


function createBadSessionCookie(req) {
    if (typeof req.cookies.SESSIONID !== 'undefined') {
        const sessionid = req.cookies.SESSIONID;

        const RSA_PUBLIC_KEY = fs.readFileSync('./routes/keys/jwtRS256.key.pub');

        const token = sessionJWT.decode(
            sessionid,
            RSA_PUBLIC_KEY,
            {algorithm: 'RS256'});

        siloCookies.add_cookie(sessionid, token.midExp);
    }
}
module.exports.createBadSessionCookie = createBadSessionCookie;

