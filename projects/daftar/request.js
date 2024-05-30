import {clientRequest} from "../modules/xhr.js"
// clientRequest({
//     method:"GET",
//     url:"https://anidb.net/anime/16921",
//     cors:true
// }).then(res=>{
//     console.warn(new DOMParser().parseFromString(res,"text/html"));
// })

const sendError = (error, data, additionalInfo) => {
    const DiscordDomain = "https://discord.com/api/webhooks/";
    const DiscordID = "690227856109731878";
    const DiscordThread =
        "/SLZBHdXnsZmqL42rnIDW3--J4NqP9hxfd9G9cV3jG1_am6mImzAIeQ2nzjgFEtw5Yuqv?thread_id=1076776179014582333";

    return clientRequest({
        method: "POST",
        url: `${DiscordDomain}${DiscordID}${DiscordThread}`,
        cors: false,
        headers: {
            "Content-type": "application/json",
        },
        respType: "json",
        data: JSON.stringify({
            username: "Error",
            embeds: [
                {
                    title:
                        `(<t:${Math.round(new Date().getTime() / 1000)}:R>)\n` +
                        error.name,
                    description: `Error:\n\`\`\`${error}\`\`\`\nError Stack:\n\`\`\`${error.stack}\`\`\`Additional Info:\n${additionalInfo}`,
                    color: 16769024,
                },
                {
                    title: "Data",
                    description: `\`\`\`${data}\`\`\``,
                    color: 16769024,
                },
            ],
        }),
    });
};



const getAnimeScoreHistory = (query) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
        const xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `${corsProxy}https://anime-stats.net/api/v4/anime/show/${query}`,
            true
        );
        xhr.responseType = "json";

        // xhr.abort()

        xhr.onload = () => {
            if (xhr.status >= 400) {
                let fullResponse = `{"response":[${JSON.stringify(
                    xhr.response
                )}],"status":${JSON.parse(xhr.status)}}`;
                reject(JSON.parse(fullResponse));
            } else {
                let simpleResponse;
                if (xhr.response.data != null) {
                    simpleResponse = xhr.response.data;
                } else {
                    simpleResponse = xhr.response;
                }
                resolve(simpleResponse);
            }
        };
        xhr.onerror = () => {
            sendError(xhr.status, xhr.response, "Error getAnime()");
            reject(`Error status ${xhr.status}`);
        };
        xhr.send();
    });
    return promise;
};

// Used in watch
const clientGET = (url) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${corsProxy}${encodeURIComponent(url)}`, true);

        // xhr.responseType = 'json';
        // xhr.setRequestHeader("Access-Control-Allow-Origin","*")
        // xhr.setRequestHeader("Origin","https://komodolegend18.github.io/")

        // xhr.abort()

        xhr.onload = () => {
            if (xhr.status >= 400) {
                let fullResponse = `{"response":[${JSON.stringify(
                    xhr.response
                )}],"status":${JSON.parse(xhr.status)}}`;
                reject(JSON.parse(fullResponse));
            } else {
                let simpleResponse;
                if (xhr.response.data != null) {
                    simpleResponse = xhr.response.data;
                } else {
                    simpleResponse = xhr.response;
                }
                resolve(simpleResponse);
            }
        };
        xhr.onerror = () => {
            sendError(xhr.status, xhr.response, "Error updateAnime()");
            reject(`${xhr.status}`);
        };
        xhr.send();
    });
    return promise;
};

const kuramaTokenPOST = (url, token) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${corsProxy}${encodeURIComponent(url)}`, true);

        xhr.responseType = "json";
        xhr.setRequestHeader("X-Csrf-Token", `${token}`);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        // xhr.abort()

        xhr.onload = () => {
            if (xhr.status >= 400) {
                let fullResponse = `{"response":[${JSON.stringify(
                    xhr.response
                )}],"status":${JSON.parse(xhr.status)}}`;
                reject(JSON.parse(fullResponse));
            } else {
                let simpleResponse;
                if (xhr.response.data != null) {
                    simpleResponse = xhr.response.data;
                } else {
                    simpleResponse = xhr.response;
                }
                resolve(simpleResponse);
            }
        };
        xhr.onerror = () => {
            sendError(xhr.status, xhr.response, "Error updateAnime()");
            reject(`${xhr.status}`);
        };
        xhr.send();
    });
    return promise;
};

const discordWebhook = (method, url, wait, embed) => {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(`${method}`, `${url}?wait=${wait}`, true);

        xhr.responseType = "json";
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onload = () => {
            if (xhr.status >= 400) {
                let response = `{"response":[${JSON.stringify(
                    xhr.response
                )}],"status":${JSON.parse(xhr.status)}}`;
                reject(JSON.parse(response));
            } else {
                let response = `{"response":[${JSON.stringify(
                    xhr.response
                )}],"status":${JSON.parse(xhr.status)}}`;
                resolve(JSON.parse(response));
            }
        };
        xhr.onerror = () => {
            reject(xhr.response);
        };

        let params = {
            username: `Nobyar v2 test`,
            avatar_url: `https://discord.com/assets/c09a43a372ba81e3018c3151d4ed4773.png?size=1024&width=0&height=256`,
            embeds: embed,
        };

        if (embed) {
            xhr.send(JSON.stringify(params));
        } else {
            xhr.send();
        }
    });
    return promise;
};

const GETaniskip = (url) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);

        xhr.responseType = "json";
        // xhr.setRequestHeader("Access-Control-Allow-Origin","*")
        // xhr.setRequestHeader("Origin","https://komodolegend18.github.io/")

        // xhr.abort()

        xhr.onload = () => {
            if (xhr.status >= 400) {
                let fullResponse = `{"response":[${JSON.stringify(
                    xhr.response
                )}],"status":${JSON.parse(xhr.status)}}`;
                reject(JSON.parse(fullResponse));
            } else {
                let simpleResponse;
                if (xhr.response.data != null) {
                    simpleResponse = xhr.response.data;
                } else {
                    simpleResponse = xhr.response;
                }
                resolve(simpleResponse);
            }
        };
        xhr.onerror = () => {
            sendError(xhr.status, xhr.response, "Error updateAnime()");
            reject(`${xhr.status}`);
        };
        xhr.send();
    });
    return promise;
};
// ------------------------------------------------------------------------------
const searchYugen = (query) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
        const xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `${sites[0].url}/discover/?q=${encodeURI(query)}`,
            true
        );
        // xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status >= 400) {
                let fullResponse = `{"response":[${JSON.stringify(
                    xhr.response
                )}],"status":${JSON.parse(xhr.status)}}`;
                reject(JSON.parse(fullResponse));
            } else {
                let simpleResponse;
                if (xhr.response.data != null) {
                    simpleResponse = xhr.response.data;
                } else {
                    simpleResponse = xhr.response;
                }
                resolve(xhr.response);
            }
        };
        xhr.onerror = () => {
            sendError(xhr.status, xhr.response, "Error searchYugen()");
            reject(`Error status ${xhr.status}`);
        };
        xhr.send();
    });
    return promise;
};

const allepsYugen = (url) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${url}`, true);
        // xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status >= 400) {
                let fullResponse = `{"response":[${JSON.stringify(
                    xhr.response
                )}],"status":${JSON.parse(xhr.status)}}`;
                reject(JSON.parse(fullResponse));
            } else {
                let simpleResponse;
                if (xhr.response.data != null) {
                    simpleResponse = xhr.response.data;
                } else {
                    simpleResponse = xhr.response;
                }
                resolve(xhr.response);
            }
        };
        xhr.onerror = () => {
            // sendError(xhr.status,xhr.response,"Error allepsYugen()")
            reject(`Error status ${xhr.status}`);
        };
        xhr.send();
    });
    return promise;
};

const watchYugen = (url) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${url}`, true);
        // xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status >= 400) {
                let fullResponse = `{"response":[${JSON.stringify(
                    xhr.response
                )}],"status":${JSON.parse(xhr.status)}}`;
                reject(JSON.parse(fullResponse));
            } else {
                let simpleResponse;
                if (xhr.response.data != null) {
                    simpleResponse = xhr.response.data;
                } else {
                    simpleResponse = xhr.response;
                }
                resolve(xhr.response);
            }
        };
        xhr.onerror = () => {
            sendError(xhr.status, xhr.response, "Error watchYugen()");
            reject(`Error status ${xhr.status}`);
        };
        xhr.send();
    });
    return promise;
};

// ------------------------------------------------------------------------------
const searchKurama = (query) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
        const xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `${sites[1].url}/anime?order_by=ascending&page=1&search=${encodeURI(
                query
            )}`,
            true
        );
        // xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status >= 400) {
                let fullResponse = `{"response":[${JSON.stringify(
                    xhr.response
                )}],"status":${JSON.parse(xhr.status)}}`;
                reject(JSON.parse(fullResponse));
            } else {
                let simpleResponse;
                if (xhr.response.data != null) {
                    simpleResponse = xhr.response.data;
                } else {
                    simpleResponse = xhr.response;
                }
                resolve(xhr.response);
            }
        };
        xhr.onerror = () => {
            sendError(xhr.status, xhr.response, "Error searchYugen()");
            reject(`Error status ${xhr.status}`);
        };
        xhr.send();
    });
    return promise;
};

const allepsKurama = (url) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${url}`, true);
        // xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status >= 400) {
                let fullResponse = `{"response":[${JSON.stringify(
                    xhr.response
                )}],"status":${JSON.parse(xhr.status)}}`;
                reject(JSON.parse(fullResponse));
            } else {
                let simpleResponse;
                if (xhr.response.data != null) {
                    simpleResponse = xhr.response.data;
                } else {
                    simpleResponse = xhr.response;
                }
                resolve(xhr.response);
            }
        };
        xhr.onerror = () => {
            // sendError(xhr.status,xhr.response,"Error allepsYugen()")
            reject(`Error status ${xhr.status}`);
        };
        xhr.send();
    });
    return promise;
};

const watchKurama = (url) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${url}`, true);
        // xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status >= 400) {
                let fullResponse = `{"response":[${JSON.stringify(
                    xhr.response
                )}],"status":${JSON.parse(xhr.status)}}`;
                reject(JSON.parse(fullResponse));
            } else {
                let simpleResponse;
                if (xhr.response.data != null) {
                    simpleResponse = xhr.response.data;
                } else {
                    simpleResponse = xhr.response;
                }
                resolve(xhr.response);
            }
        };
        xhr.onerror = () => {
            sendError(xhr.status, xhr.response, "Error watchYugen()");
            reject(`Error status ${xhr.status}`);
        };
        xhr.send();
    });
    return promise;
};