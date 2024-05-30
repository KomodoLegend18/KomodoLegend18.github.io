"use strict";
// Import xhr module
import { clientRequest } from "./xhr.js";

const malkey = "a5f40eba77d1d8f6e092d31aa2780f74"; //REMIND ME TO MAKE THIS A USER INPUT INSTEAD

const fields = {
    anime: "nsfw=true&fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,num_favorites,nsfw,created_at,updated_at,media_type,status,genres,pictures,background,related_anime,related_manga,recommendations,num_episodes,start_season,broadcast,source,average_episode_duration,rating,studios,statistics,opening_themes,ending_themes",
    manga: "nsfw=true&fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,num_favorites,nsfw,created_at,updated_at,media_type,status,genres,pictures,background,related_anime,related_manga,recommendations"
}

// MAL related request
export const MALClient = {
    search: async function (query) {
        try {
            const url = encodeURIComponent(
                `https://api.myanimelist.net/v2/anime?q=${query}&${fields.anime}`
            );
            const headers = {
                "X-MAL-CLIENT-ID": malkey,
            };
            const resp = await clientRequest({
                method: "GET",
                url: url,
                cors: true,
                headers: headers,
                respType: "json",
            });
            return resp
        } catch (error) {
            if (JSON.parse(error)) {
                let err = JSON.parse(error)
                if(err.data.status>=400){
                    throw `[MALClient] ${err.data.status} | ${err.data.result.error}\n${err.data.result.message}`
                }
                // console.error(err.data.status);
                // throw new Error(err)
            } else {
                throw new Error(error)
            }
        }
    },
    page: async function (id, type) {
        try {
            const url = 
                type === "anime"
                    ? `https://myanimelist.net/anime/${id}`
                    : `https://myanimelist.net/manga/${id}`;
            const resp = await clientRequest({
                method: "GET",
                url: url,
                respType: "text",
                cors: true,
            });
            return resp
        } catch (error) {
            if (JSON.parse(error)) {
                let err = JSON.parse(error)
                if(err.data.status>=400){
                    throw `[MALClient] ${err.data.status} | ${err.data.result.error}\n${err.data.result.message}`
                }
                // console.error(err.data.status);
                // throw new Error(err)
            } else {
                throw new Error(error)
            }
        }
    },
    detail: function (id, type) {
        // change to async
        try {
            const url =
                type === "anime"
                    ? encodeURIComponent(
                          `https://api.myanimelist.net/v2/anime/${id}?${fields.anime}`
                      )
                    : encodeURIComponent(
                          `https://api.myanimelist.net/v2/manga/${id}?${fields.manga}`
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
    user: async function (parameters){
        try {
            const {
                username,
                limit = 100,
                status = "watching",
                sort = "list_updated_at"
            } = parameters

            if (username==null){
                throw "username is Null"
            } else if(limit<=0||limit>1000){
                throw "limit must be between 1-1000"
            }

            const url = encodeURIComponent(
                `https://api.myanimelist.net/v2/users/${username}/animelist?limit=${limit}&status=${status}&sort=${sort}&${fields.anime}`
            );
            const headers = {
                "X-MAL-CLIENT-ID": malkey,
            };

            const resp = await clientRequest({
                method: "GET",
                url: url,
                cors: true,
                headers: headers,
                respType: "json",
            });
            return resp
        } catch (error) {
            if (JSON.parse(error)) {
                let err = JSON.parse(error)
                if(err.data.status>=400){
                    throw `[MALClient] ${err.data.status} | ${err.data.result.error}\n${err.data.result.message}`
                }
                // console.error(err.data.status);
                // throw new Error(err)
            } else {
                throw new Error(error)
            }
        }
    }
};