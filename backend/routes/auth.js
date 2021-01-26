const sessionJwt = require ('./sessionJWT');

// ici, on récupère le contenu du cookie de session JWT.
// celui-ci contient le userId mais également des informations
// concernant sa date d'expiration.
function getSession (req) {
    return sessionJwt.decodeSessionCookie(req);
}
module.exports.getSession = getSession;


// cette fonction ajoute le cookie de session au headers du
// message qui sera renvoyé à Angular. Si le cookie actuel
// est "vieux", on en recrée ici un nouveau.
function setSessionCookie (req, res, session, applicationId) {
    sessionJwt.createSessionCookie(req, res, session, applicationId);
}
module.exports.setSessionCookie = setSessionCookie;


// fonction pour récupérer le userId provenant du cookie
// de session. Si ce dernier n'existe pas, on renvoie
// l'ID -1.
function getUserId(session) {
    if (typeof session.userId === 'undefined') return -1;
    return session.userId;
}
module.exports.getUserId = getUserId;

function deconnexion(res) {
    sessionJwt.createBadSessionCookie(res);
}
module.exports.deconnexion= deconnexion;
