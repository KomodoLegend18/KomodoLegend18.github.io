import { clientRequest } from "./xhr.js";

const url = "https://anime-stats.net/api/v4/anime/show/"
export const AnimeStatClient = {
    entry: async function (options = {}){
        try {
            let {
                query
            } = options

            if (!query) {
                throw `Query invalid: ${query}`
            }

            let resp = await clientRequest({
                url:url+query,
                cors:true,
                respType:"json"
            })
            console.warn(resp);
            return resp
        } catch (error) {
            console.error(error);
            return error
        }
    }
}
    // const promise = new Promise((resolve, reject) => {
        // console.warn(query)
        // const xhr = new XMLHttpRequest();
        // xhr.open(
        //     "GET",
        //     `${string.corsProxy}https://anime-stats.net/api/v4/anime/show/${query}`,
        //     true
        // );
        // xhr.responseType = "json";

        // xhr.abort()

        // xhr.onload = () => {
        //     if (xhr.status >= 400) {
        //         let fullResponse = `{"response":[${JSON.stringify(
        //             xhr.response
        //         )}],"status":${JSON.parse(xhr.status)}}`;
        //         reject(JSON.parse(fullResponse));
        //     } else {
        //         let simpleResponse;
        //         if (xhr.response.data != null) {
        //             simpleResponse = xhr.response.data;
        //         } else {
        //             simpleResponse = xhr.response;
        //         }
        //         resolve(simpleResponse);
        //     }
        // };
        // xhr.onerror = () => {
        //     sendError(xhr.status, xhr.response, "Error getAnime()");
        //     reject(`Error status ${xhr.status}`);
        // };
        // xhr.send();
    // });
    // return resp;
// };