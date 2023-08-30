var malkey = "a5f40eba77d1d8f6e092d31aa2780f74" //REMIND ME TO MAKE THIS A USER INPUT INSTEAD
const sendError = (error,data,additionalInfo) =>{
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        let dcdomain = "https://discord.com/api/webhooks/"
        let dcid = "835374841455443968"
        let dcthread = "/IHdR8hm8AES_l15uwQBIAjnZHmHafkDqXUpr7LX3RSEPcMY5LfpOMcZ0HmT9n25al6GF?thread_id=1076776179014582333"
        xhr.open("POST", `${dcdomain}${dcid}${dcthread}`, true);

        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = () =>{
            if (xhr.status>=400){
                let response = `{"response":[${JSON.stringify(xhr.response)}],"status":${JSON.parse(xhr.status)}}`
                reject(JSON.parse(response))
            } else {
                let response = `{"response":[${JSON.stringify(xhr.response)}],"status":${JSON.parse(xhr.status)}}`
                resolve(JSON.parse(response));
            }
        };
        xhr.onerror = () =>{
            sendError(xhr.status,xhr.response,"Error sending...error???")
            reject(xhr.response)
        };

        let params = {
            username: "Error",
            embeds: [
                {
                  "title": error.name,
                  "description": `\`\`\`${error}\`\`\`\n\`\`\`${error.stack}\`\`\`\n${additionalInfo}`,
                  "color": 16769024,
                },
                {
                    "title": "Data",
                    "description": `\`\`\`${JSON.stringify(data)}\`\`\``,
                    "color": 16769024
                }
            ]
        }
        // console.warn("Sending error log: ",error)
        // xhr.send(JSON.stringify(params))
    });
    return promise;
};
const getAnime = (query) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `https://cors-anywhere.herokuapp.com/api.myanimelist.net/v2/anime?q=${query}&nsfw=true&fields=id,title,main_picture,alternative_titles,synopsis,genres,mean,media_type,num_episodes,broadcast,created_at,updated_at,start_date,broadcast,status,start_season`, true);
            xhr.responseType = 'json';
            xhr.setRequestHeader("X-MAL-CLIENT-ID", malkey) // Add Client ID header with "key" value provided by user

            // xhr.abort()

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
                sendError(xhr.status,xhr.response,"Error getAnime()")
                reject(`Error status ${xhr.status}`)
            };
            xhr.send()
    });
    return promise;
}
const updateAnime = (id) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `https://cors-anywhere.herokuapp.com/api.myanimelist.net/v2/anime/${id}?nsfw=true&fields=id,title,main_picture,alternative_titles,average_episode_duration,synopsis,genres,mean,media_type,num_episodes,broadcast,created_at,updated_at,start_date,broadcast,status,start_season,source,rating,studios`, true);
            xhr.responseType = 'json';
            xhr.setRequestHeader("X-Mal-Client-Id", malkey) // Add Client ID header with "key" value provided by user
            // xhr.setRequestHeader("Access-Control-Allow-Origin","*")
            // xhr.setRequestHeader("Origin","https://komodolegend18.github.io/")

            // xhr.abort()

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
                sendError(xhr.status,xhr.response,"Error updateAnime()")
                reject(`Error status ${xhr.status}, ${xhr.response}`)
            };
            xhr.send()
    });
    return promise;
}

// ------------------------------------------------------------------------------
const searchYugen = (query) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `${sites[0].url}/discover/?q=${encodeURI(query)}`, true);
            // xhr.responseType = 'json';
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
                    resolve(xhr.response);
                }
            };
            xhr.onerror = () =>{
                sendError(xhr.status,xhr.response,"Error searchYugen()")
                reject(`Error status ${xhr.status}`)
            };
            xhr.send()
    });
    return promise;
}

const allepsYugen = (url) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `${url}`, true);
            // xhr.responseType = 'json';
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
                    resolve(xhr.response);
                }
            };
            xhr.onerror = () =>{
                // sendError(xhr.status,xhr.response,"Error allepsYugen()")
                reject(`Error status ${xhr.status}`)
            };
            xhr.send()
    });
    return promise;
}

const watchYugen = (url) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `${url}`, true);
            // xhr.responseType = 'json';
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
                    resolve(xhr.response);
                }
            };
            xhr.onerror = () =>{
                sendError(xhr.status,xhr.response,"Error watchYugen()")
                reject(`Error status ${xhr.status}`)
            };
            xhr.send()
    });
    return promise;
}

// ------------------------------------------------------------------------------
const searchKurama = (query) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `${sites[1].url}/anime?order_by=ascending&page=1&search=${encodeURI(query)}`, true);
            // xhr.responseType = 'json';
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
                    resolve(xhr.response);
                }
            };
            xhr.onerror = () =>{
                sendError(xhr.status,xhr.response,"Error searchYugen()")
                reject(`Error status ${xhr.status}`)
            };
            xhr.send()
    });
    return promise;
}

const allepsKurama = (url) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `${url}`, true);
            // xhr.responseType = 'json';
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
                    resolve(xhr.response);
                }
            };
            xhr.onerror = () =>{
                // sendError(xhr.status,xhr.response,"Error allepsYugen()")
                reject(`Error status ${xhr.status}`)
            };
            xhr.send()
    });
    return promise;
}

const watchKurama = (url) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `${url}`, true);
            // xhr.responseType = 'json';
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
                    resolve(xhr.response);
                }
            };
            xhr.onerror = () =>{
                sendError(xhr.status,xhr.response,"Error watchYugen()")
                reject(`Error status ${xhr.status}`)
            };
            xhr.send()
    });
    return promise;
}