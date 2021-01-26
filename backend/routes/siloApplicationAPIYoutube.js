const {google} = require('googleapis');

const youtube = google.youtube({
    version: 'v3',
    //auth: 'AIzaSyA8DIAt8tsy5fNaFxFphQ5yrQnBg_bGV_M'
    auth: 'AIzaSyA7j7AVow_SnFb4th76YCb5aUeRQyql1RQ'
});


//ne peut récupérer que les 50 premiers résultats ... sinon passer par un token
//vérifier les vidéos des channels ...
async function searchByKeyword(query, nb_results){
    let donnees_video = await youtube.search.list({
        part: 'id,snippet',
        order: 'relevance',
        maxResults: nb_results,
        q: query,
    }).then(res => {

        videos =[];

        for(let item of res.data.items) {
            if(item.id.kind === 'youtube#channel'){
                videos.push({title: item.snippet.title,
                    image: item.snippet.thumbnails.high.url,
                    description: item.snippet.description,
                    channelTitle: item.snippet.channelTitle,
                    videoId: item.id.channelId,
                    url: "https://www.youtube.com/embed/" + item.id.channelId})
            }else if(item.id.kind === 'youtube#video'){
                videos.push({title: item.snippet.title,
                    image: item.snippet.thumbnails.high.url,
                    description: item.snippet.description,
                    channelTitle: item.snippet.channelTitle,
                    videoId: item.id.videoId,
                    url: "https://www.youtube.com/embed/" + item.id.videoId})
            }else {
                console.log("un autre type de vidéo ... : " + item.id);
            }

        }

        return videos;

    }).catch(error => {
        console.error(error);
    });

    return donnees_video;
}

module.exports.searchByKeyword = searchByKeyword;

async function all_video_categories(){
    let categories = await youtube.videoCategories.list({
        part: 'id,snippet',
        regionCode: 'FR',
        hl : 'FR'
    }).then(res => {

        let categories_list = []
        for (let item of res.data.items){
            categories_list.push({id :item.id, mot :item.snippet.title});
        }

        return categories_list;

    }).catch(error => {
        console.error(error);
    });

    return categories;
}

module.exports.all_video_categories = all_video_categories;

async function get_category_by_id(id){
    let category_name = await youtube.videoCategories.list({
        part: 'id,snippet',
        id: id,
        hl: 'FR'
    }).then(res => {

        return res.data.items[0].snippet.title;

    }).catch(error => {
        console.error(error);
    });

    return category_name;
}

module.exports.get_category_by_id = get_category_by_id;

async function get_video_category(id){
    let category_id = await youtube.videos.list({
        part: 'id,snippet',
        id : id
    }).then(res => {

        return res.data.items[0].snippet.categoryId;

    }).catch(error => {
        console.error(error);
    });

    return category_id;
}


module.exports.get_video_category = get_video_category;

async function searchByPage(query, token_next_page, nb_results){
    let res_token = await youtube.search.list({
        part: 'id,snippet',
        pageToken: token_next_page,
        maxResults: nb_results,
        q: query,
    }).then(res => {

        videos =[];

        for(let item of res.data.items) {
            videos.push({title: item.snippet.title,
                image: item.snippet.thumbnails.high.url,
                description: item.snippet.description,
                channelTitle: item.snippet.channelTitle,
                videoId: item.id.videoId})
        }

        return(res.nextPageToken);

    }).catch(error => {
        console.error(error);
    });

    return res_token;
}

