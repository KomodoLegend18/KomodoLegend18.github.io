import { string } from "./config.js";

const malkey = "a5f40eba77d1d8f6e092d31aa2780f74"; //REMIND ME TO MAKE THIS A USER INPUT INSTEAD
const anischedkey = "VKOt1Smvx4iS2yMlFbnYPloEpQiNFU";


// Main function for HTTP request
const clientRequest = (options) => {
    const promise = new Promise((resolve, reject) => {
        const {
            method = "GET",
            cors = false,
            url,
            async = true,
            headers,
            respType = "text",
            data,
        } = options;
        // Check method
        if (!["GET", "POST", "PATCH"].includes(method)) {
            reject(
                new Error(
                    "Invalid method. Method must be one of 'GET', 'POST', or 'PATCH'."
                )
            );
        }
        // Check cors
        if (typeof cors !== "boolean") {
            reject(new Error("Invalid cors. Cors must be boolean"));
        }
        // Check url
        if (!url) {
            reject(new Error("URL is not specified."));
        }
        // Check async
        if (typeof async !== "boolean") {
            reject(new Error("Invalid async. Async must be boolean"));
        }
        // Check headers
        if (headers) {
            // console.log(headers);
            if (typeof headers !== "object") {
                reject(new Error("Invalid headers. Headers must be object"));
            }
        }
        // Check respType
        if (!["text", "document", "json"].includes(respType)) {
            reject(
                new Error(
                    "Invalid responseType. type must be one of 'text', 'document', or 'json'."
                )
            );
        }

        const xhr = new XMLHttpRequest();
        if (cors) {
            // removed encodeuricomponent
            // encodeuri now must be provided before requested
            xhr.open(method, string.corsProxy + url, async);
        } else {
            xhr.open(method, url, async);
        }
        xhr.responseType = respType;
        if (headers) {
            for (const key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }
        // xhr.setRequestHeader("Access-Control-Allow-Origin","*")
        // xhr.setRequestHeader("Origin","https://komodolegend18.github.io/")
        // xhr.abort()
        xhr.onload = () => {
            const respHeaders = xhr.getAllResponseHeaders();
            const responseData = {
                data: {
                    result: xhr.response,
                    status: xhr.status,
                },
                input: {
                    method,
                    cors,
                    url,
                    async,
                    headers,
                    respType,
                    data,
                },
                respHeader: {
                    respHeaders,
                },
            };

            if (xhr.status >= 400) {
                console.error(
                    "Don't forget to encodeuricomponent() 😇\n",
                    responseData
                );
                reject(new Error(responseData));
            } else {
                // console.log("Don't forget to encodeuricomponent() 😇\n",responseData);
                resolve(responseData.data.result);
            }
        };
        xhr.onerror = () => {
            const respHeaders = xhr.getAllResponseHeaders();
            const responseData = {
                data: {
                    result: xhr.response,
                    status: xhr.status,
                },
                input: {
                    method,
                    cors,
                    url,
                    async,
                    headers,
                    respType,
                    data,
                },
                respHeader: {
                    respHeaders,
                },
            };
            console.error(
                "Don't forget to encodeuricomponent() 😇\n",
                responseData
            );
            // sendError(new Error("ClientRequest ERROR"),JSON.stringify(responseData),"ClientRequest ERROR")
            reject(new Error(responseData));
        };
        xhr.send(data);
    });
    return promise;
};
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

const AnimeScheduleClient = {
    searchByAllMALID: function (options = {}) {
        const { page = 1 } = options;
        const filteredIDs = loadingUserData()[0]
            .list.filter((item) => item.status === "currently_airing")
            .map((item) => item.id)
            .map((id) => "mal-ids=" + id)
            .join("&");
        const url = encodeURIComponent(
            `https://animeschedule.net/api/v3/anime?page=${page}&mt=any&${filteredIDs}`
        );
        const headers = {
            Authorization: "Bearer " + anischedkey,
        };
        clientRequest({
            method: "GET",
            url: url,
            cors: true,
            headers: headers,
            respType: "json",
        }).then((resp) => {
            // if result total amount is more than 18 in current page
            if (resp.totalAmount > 18 * page) {
                AnimeScheduleClient.searchByAllMALID({ page: page + 1 });
            }
            console.log(resp);
        });
    },
    searchByMALID: function (options = {}) {
        const { id } = options;
        const url = encodeURIComponent(
            `https://animeschedule.net/api/v3/anime?mt=any&mal-ids=${id}`
        );
        console.warn(id);
        const headers = {
            Authorization: "Bearer " + anischedkey,
        };
        clientRequest({
            method: "GET",
            url: url,
            cors: true,
            headers: headers,
            respType: "json",
        }).then((resp) => {
            // if result total amount is more than 18 in current page
            return console.log(resp);
        });
    },
    checkSchedule: function () {
        function getParam() {
            let currentDate = new Date();

            let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            let year = currentDate.getFullYear();

            currentDate.setHours(0, 0, 0, 0);
            currentDate.setDate(
                currentDate.getDate() + 3 - ((currentDate.getDay() + 6) % 7)
            );
            let w = new Date(year, 0, 4);
            let week =
                1 +
                Math.round(
                    ((currentDate.getTime() - w.getTime()) / 86400000 -
                        3 +
                        ((w.getDay() + 6) % 7)) /
                        7
                );

            return `tz=${timezone}&year=${year}&week=${week}`;
        }
        const reqURL = encodeURIComponent(
            `https://animeschedule.net/api/v3/timetables/raw?${getParam()}`
        );
        const reqHeaders = {
            Authorization: "Bearer VKOt1Smvx4iS2yMlFbnYPloEpQiNFU",
        };
        clientRequest({
            method: "GET",
            url: reqURL,
            cors: true,
            headers: reqHeaders,
            respType: "json",
        }).then((resp) => {
            const filtered = resp.filter((item) => item.donghua === false); // Monday first
            const unaired = filtered.filter(
                (item) => item.airingStatus === "unaired"
            );
            const sortbyDay = filtered.reduce((acc, item) => {
                const date = new Date(item.episodeDate);
                const day = date.getDay(); // Sunday first
                if (!acc[day]) {
                    acc[day] = [];
                }
                acc[day].push(item);
                return acc;
            }, []);
            console.log(
                "Full:\n",
                resp,
                "Filtered:\n",
                filtered,
                "Unaired:\n",
                unaired,
                "sorted by day:\n",
                sortbyDay
            );
            return sortbyDay;
        });
    },
    testSlug: function (query) {
        const url = encodeURIComponent(
            `https://animeschedule.net/api/v3/anime/${query}`
        );
        const headers = {
            Authorization: "Bearer VKOt1Smvx4iS2yMlFbnYPloEpQiNFU",
        };
        return clientRequest({
            method: "GET",
            url: url,
            cors: true,
            headers: headers,
            respType: "json",
        });
    },
};

// MAL related request
export const MALClient = {
    search: function (query) {
        const url = encodeURIComponent(
            `https://api.myanimelist.net/v2/anime?q=${query}&${string.anime}`
        );
        const headers = {
            "X-MAL-CLIENT-ID": malkey,
        };

        return clientRequest({
            method: "GET",
            url: url,
            cors: true,
            headers: headers,
            respType: "json",
        });
    },
    page: function (id, type) {
        const url =
            type === "anime"
                ? `https://myanimelist.net/anime/${id}`
                : `https://myanimelist.net/manga/${id}`;

        return clientRequest({
            method: "GET",
            url: url,
            respType: "text",
            cors: true,
        });
    },
    detail: function (id, type) {
        try {
            const url =
                type === "anime"
                    ? encodeURIComponent(
                          `https://api.myanimelist.net/v2/anime/${id}?${string.anime}`
                      )
                    : encodeURIComponent(
                          `https://api.myanimelist.net/v2/manga/${id}?${string.manga}`
                      );
            const headers = {
                "X-Mal-Client-Id": malkey,
            };
            return clientRequest({
                method: "GET",
                url: url,
                cors: true,
                headers: headers,
                respType: "json",
            });
        } catch (error) {
            console.error(error);
        }
    },
};

const getAnimeScoreHistory = (query) => {
    const promise = new Promise((resolve, reject) => {
        // console.warn(query)
        const xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `${string.corsProxy}https://anime-stats.net/api/v4/anime/show/${query}`,
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
        xhr.open("GET", `${string.corsProxy}${encodeURIComponent(url)}`, true);

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
        xhr.open("POST", `${string.corsProxy}${encodeURIComponent(url)}`, true);

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
