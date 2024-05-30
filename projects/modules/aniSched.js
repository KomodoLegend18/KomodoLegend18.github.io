"use strict";
import { userData } from "../daftar/scripts/functions.js";
import { clientRequest } from "./xhr.js";

const anischedkey = "VKOt1Smvx4iS2yMlFbnYPloEpQiNFU";
const anischedAPI = "https://animeschedule.net/api/v3"

export const AnimeScheduleClient = {
    searchByMALID: async function (options = {}) {
        try {
            let { 
                page = 1,
                id,
                result = []
            } = options;

            // Check if Ids exist
            if (!id) {
                // console.warn("ID Input:\n",id);
                id = userData.load("DaFTAR").map((item) => item.id).map((id) => "mal-ids=" + id).join("&");
            } else if(Array.isArray(id)){
                // console.warn("ID Input:\n",id);
                id = id.map(id => `mal-ids=${id}`).join('&');                
                    // console.error(error);
            } else {
                console.warn("ID Input:\n",id);   
            }

            const url = encodeURIComponent(
                `${anischedAPI}/anime?page=${page}&mt=any&${id}`
            );
            const headers = {
                Authorization: "Bearer " + anischedkey,
            };
            const resp = await clientRequest({
                method: "GET",
                url: url,
                cors: true,
                headers: headers,
                respType: "json",
            })
            resp.anime.forEach(item => {
                // console.log(item);
                result.push(item)
            });
            // if result total amount is more than 18 in current page
            if (resp.totalAmount > 18 * page) {
                // debugger;
                return await AnimeScheduleClient.searchByMALID({ page: page + 1,id:id,result:result});
            } else {
                // console.log(resp);

                return result
            }
        } catch (err) {
            // console.error(err);
            throw err
        }
    },
    checkSchedule: async function (type) {
        function timetableParameter() {
            let currentDate = new Date();
            let year = currentDate.getFullYear();

            let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            currentDate.setHours(0, 0, 0, 0);

            // https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
            // https://stackoverflow.com/a/6117889
            function getWeekNumber(d) {
                // Copy date so don't modify original
                d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
                // Set to nearest Thursday: current date + 4 - current day number
                // Make Sunday's day number 7
                d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
                // Get first day of year
                var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
                // Calculate full weeks to nearest Thursday
                var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
                // Return week number
                return weekNo;
            }
            return `tz=${timezone}&year=${year}&week=${getWeekNumber(currentDate)}`;
        }
        const reqURL = encodeURIComponent(
            `${anischedAPI}/timetables/raw?${timetableParameter()}`
        );
        const reqHeaders = {
            Authorization: `Bearer ${anischedkey}`,
        };
        try {
            const resp = await clientRequest({
                method: "GET",
                url: reqURL,
                cors: true,
                headers: reqHeaders,
                respType: "json",
            })
            // console.warn("animeSchedule response:",resp);
            // filter donghua entries
            const filtered = resp.filter((item) => item.donghua === false);
            // filter unaired entries
            const unaired = filtered.filter(
                (item) => item.airingStatus === "unaired"
            );
            // filter entries by day
            const sortbyDay = filtered.reduce((acc, item) => {
                const date = new Date(item.episodeDate);
                const day = date.getDay(); // Sunday first
                if (!acc[day]) {
                    acc[day] = [];
                }
                acc[day].push(item);
                return acc;
            }, []);
            // return data based on requested type
            if (type==="all") {
                return resp
            } else if(type==="noDonghua"){
                return filtered
            } else if(type==="unaired"){
                return unaired
            } else if(type==="week"){
                return sortbyDay
            } else {
                return sortbyDay[new Date().getDay()];
            }
        } catch (error) {
            let jsonErr
            // check if error type is json
            try {
                JSON.parse(error)
                jsonErr = true
            } catch (error) {
                jsonErr = false
            }
            if (jsonErr) {
                throw `[checkSchedule] error:${JSON.parse(error).data.status}`
            }else{
                // if its not json, throw whatever it is
                throw error
            }
        }
    },
    route: async function (route) {
        try {
            if (!route) throw `route not defined`
            const url = encodeURIComponent(
                `${anischedAPI}/anime/${route}`
            );
            const headers = {
                Authorization: `Bearer ${anischedkey}`,
            };
            const resp = await clientRequest({
                method: "GET",
                url: url,
                cors: true,
                headers: headers,
                respType: "json",
            })
            return resp
        } catch (error) {
            throw error
        }
    }
};