const siloAPIYoutube = require('./siloApplicationAPIYoutube');
const siloAnnonces = require('./siloApplicationAnnonces');
const siloUtilisateur = require('./siloApplicationUtilisateur');
const siloPlaylist = require('./siloApplicationPlaylist')
const {sendError, sendMessage} = require ("./message");
const auth = require ('./auth');

async function print_advertisement_by_user(id_entreprise, res) {

    return await siloAnnonces.get_advertisement_by_user(id_entreprise).then((value)=>{
        sendMessage(res, value);
        return value;
    });
}
module.exports.print_advertisement_by_user = print_advertisement_by_user;

async function get_all_keywords(res){
    return await siloAnnonces.get_all_keywords().then((value)=>{
        sendMessage(res, value);
        return value;
    })
}
module.exports.get_all_keywords = get_all_keywords;


async function create_new_advertisement(id_entreprise, mots_cles, nom, photo, genre, agemin, agemax,
                                        datedeb, datefin, res){
    return await siloAnnonces.add_advertisement_and_keywords(id_entreprise, mots_cles, nom, photo, genre, agemin, agemax,
        datedeb, datefin)
}
module.exports.create_new_advertisement = create_new_advertisement;

async function get_advertisement_and_keywords(id_ciblage,res){

    let result = await siloAnnonces.get_keywords_and_advertisement(id_ciblage);

    let keywords_names=[];
    for(let keyword of result[1]){
        let name = await siloAPIYoutube.get_category_by_id(keyword);
        keywords_names.push({id : keyword, name: name})
    }

    result[1] = keywords_names;
    sendMessage(res, result);

}
module.exports.get_advertisement_and_keywords = get_advertisement_and_keywords;

async function delete_advertisement(id_ciblage, res){
    return await siloAnnonces.delete_advertisement(id_ciblage)
}
module.exports.delete_advertisement = delete_advertisement;

async function modify_advertisement(id_ciblage, nom, photo, genre, agemin, agemax, datedeb, datefin, res){
    return await siloAnnonces.modify_advertisement_name_photo(id_ciblage, nom, photo)
}
module.exports.modify_advertisement = modify_advertisement;


//API YOUTUBE
async function get_categories_api(res){
    sendMessage (res, await siloAPIYoutube.all_video_categories() );
}
module.exports.get_categories_api = get_categories_api;

async function get_category_by_id(id, res){
    sendMessage(res, await siloAPIYoutube.get_category_by_id(id));
}
module.exports.get_category_by_id = get_category_by_id;


async function number_people_targetting_for_an_ad(ids_ad,res){

    let nb_people = [];
    for(let id_ad of ids_ad){
        infos_targetting = await siloAnnonces.get_ad_by_id(id_ad);

        let keywords = await siloAnnonces.get_key_words_by_targetting(id_ad);

        let categories = [];
        for (let keyword of keywords){
            categories.push(keyword.id_motcle);
        }

        nb_people.push(await number_people_targetting(infos_targetting.agemin, infos_targetting.agemax, infos_targetting.genre, categories));
    }

    sendMessage(res, nb_people);
}
module.exports.number_people_targetting_for_an_ad = number_people_targetting_for_an_ad;

async function number_people_targetting(age_min, age_max, gender, categories) {

    let date_max = new Date();
    date_max.setFullYear(date_max.getFullYear()-age_min);

    let date_min = new Date();
    date_min.setFullYear(date_min.getFullYear()-age_max);

    let id_people;
    if(gender === 'indifferent'){
        id_people = await siloUtilisateur.get_people_by_age(date_min,date_max);
    } else {
        id_people = await siloUtilisateur.get_people_by_age_and_gender(date_min,date_max,gender);
    }

    let nb_people =0;
    for (let id of id_people){

        let nb_video = await siloPlaylist.get_nb_video_by_user_and_categories(id.id, categories);

        if (nb_video.nb>0){
            nb_people = nb_people +1;
        }
    }

    return nb_people;
}

async function number_people(age_min, age_max, gender, categories, res) {
    let nb_people = await number_people_targetting(age_min, age_max, gender, categories);
    sendMessage(res, nb_people);
}

module.exports.number_people= number_people;

async function getCompanyName(id, res) {
    let name = await siloUtilisateur.get_name_by_id (id, 2);
    sendMessage(res, name);
}

module.exports.getCompanyName= getCompanyName;

async function connect_company(email, mdp, res, req) {
    let user_exist = await siloUtilisateur.verify_email_address(email,2);
    if (user_exist){
        let user_id = await siloUtilisateur.get_user_by_email_mdp(email, mdp, 2);
        if (user_id === -1){
            sendError(res,'Erreur dans le login ou le mot de passe');
        }else{
            auth.setSessionCookie(req, res, {userId:user_id}, 2);
            sendMessage(res,{applicationId: 2, userId: user_id});
        }
    } else{
        sendError(res,'Erreur dans le login ou le mot de passe');
    }
}

module.exports.connect_company = connect_company;

