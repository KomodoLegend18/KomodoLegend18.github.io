var user_data = loadingUserData();

function loadingUserData(){ 
    let data = JSON.parse(localStorage.getItem("nobyarV2"))
    if(data&&data[0]){
        console.warn("Save data found, loading save data...",data[0])
        return data
    }else{
        // Create new empty save data
        let saveArray = [
            {
                "list":[],
                "config":[
                    {
                        "webhook":[]
                    }
                ]
            }
        ]
        // localStorage.setItem("nobyarV2", JSON.stringify(saveArray))
        savingUserData(saveArray,"New save data")
        console.warn("Save data not found, new save data created",saveArray)
        return loadingUserData()
    }
}
function savingUserData(parameter,info){
    if (parameter){
        localStorage.setItem("nobyarV2", JSON.stringify(parameter))
        console.groupCollapsed(`[Save] ${info}`)
        console.log("[Save] Saving...",parameter[0].list,loadingUserData()[0].list)
        console.trace("[Save] Saving...",parameter,loadingUserData())
        console.groupEnd()
    }
}
const searchInput = document.querySelector("#header-section > input[type=text]")
const overlayDim = document.querySelectorAll(".dim")

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
const cors_proxy = "https://corsmirror.com/v1?url="
// const cors_proxy = "https://cors-anywhere.herokuapp.com/"
const mal_field_anime = "nsfw=true&fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,num_favorites,nsfw,created_at,updated_at,media_type,status,genres,pictures,background,related_anime,related_manga,recommendations,num_episodes,start_season,broadcast,source,average_episode_duration,rating,studios,statistics,opening_themes,ending_themes"
const mal_field_manga = "nsfw=true&fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,num_favorites,nsfw,created_at,updated_at,media_type,status,genres,pictures,background,related_anime,related_manga,recommendations"



const errMSG = {
    "URL":"Entry does not have valid URL",
}

function resetLocalstorage(){
    localStorage.removeItem("nobyarV2");
    location.reload()
}