const getAnime = (type,parameter) => {
    const promise = new Promise((resolve, reject) => {
        console.warn(type,parameter)
        if (type==`title`){
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `https://corsproxy.io/?https://api.myanimelist.net/v2/anime?q=${parameter}&nsfw=true&limit=10&fields=id,title,main_picture,alternative_titles,synopsis,genres,mean,num_episodes,broadcast,created_at,updated_at,start_date,broadcast,status`, true);
            xhr.responseType = 'json';
            xhr.setRequestHeader("X-MAL-CLIENT-ID", key) // Add Client ID header with "key" value provided by user


            xhr.onload = () =>{
                if (xhr.status>=400){
                    let fullResponse = `{"response":[${JSON.stringify(xhr.response)}],"status":${JSON.parse(xhr.status)}}`
                    reject(JSON.parse(fullResponse))
                } else {
                    let simpleResponse
                    if (xhr.response.data!=null){
                        simpleResponse = xhr.response.data
                    } else {
                        simpleResponse = xhr.response
                    }
                    resolve(simpleResponse);
                }
            };
            xhr.onerror = () =>{
                reject(`Error status ${xhr.status}`)
            };
            xhr.send()
        } else if (type==`id`) {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `https://corsproxy.io/?https://api.myanimelist.net/v2/anime/${parameter}?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics`, true);
            xhr.responseType = 'json';
            xhr.setRequestHeader("X-MAL-CLIENT-ID", key) // Add Client ID header with "key" value provided by user


            xhr.onload = () =>{
                if (xhr.status>=400){
                    let fullResponse = `{"response":[${JSON.stringify(xhr.response)}],"status":${JSON.parse(xhr.status)}}`
                    reject(JSON.parse(fullResponse))
                } else {
                    let simpleResponse
                    if (xhr.response.data!=null){
                        simpleResponse = xhr.response.data
                    } else {
                        simpleResponse = xhr.response
                    }
                    resolve(simpleResponse);
                }
            };
            xhr.onerror = () =>{
                reject(`Error status ${xhr.status}`)
            };
            xhr.send()
        }
    });
    return promise;
}
