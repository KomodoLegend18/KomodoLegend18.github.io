export const config = {
    resetLS: () => {
        resetLocalstorage();
    }
};
export const string = {
    anime:"nsfw=true&fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,num_favorites,nsfw,created_at,updated_at,media_type,status,genres,pictures,background,related_anime,related_manga,recommendations,num_episodes,start_season,broadcast,source,average_episode_duration,rating,studios,statistics,opening_themes,ending_themes",
    manga:"nsfw=true&fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,num_favorites,nsfw,created_at,updated_at,media_type,status,genres,pictures,background,related_anime,related_manga,recommendations",
    corsProxy:"https://corsmirror.com/v1?url="
}

const sites = [
    {
        "url":"https://yugenanime.tv"
    },
    {
        "url":"https://kuramanime.net"
    },
    {
        "url":"https://zoro.to"
    }
]

// note: doesnt return if there is query
// const cors_proxy = "https://corsmirror.com/v1?url="
// const cors_proxy = "https://cors-anywhere.herokuapp.com/"



const errMSG = {
    "URL":"Entry does not have valid URL",
}

function resetLocalstorage(){
    // if (confirm("RESETTING NOBYAR DATA\nAre you SURE?")) {
        localStorage.removeItem("nobyarV2");
        // debugger
        location.reload()
    // }
}