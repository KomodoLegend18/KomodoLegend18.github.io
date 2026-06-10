import { clientRequest } from "../../modules/xhr.js";
import { mediaPlayer as mediaPlayerV2 } from "../../modules/mediaPlayer/mediaPlayerV2.js";


const defaultData = {
    fwc26CompID:17,
    fwc26SeasonID:285023,
    fwc26StageID:289273,
    noFlagElem:`<svg width="50" height="50" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.72417 0.540045C9.9072 0.486627 10.1017 0.486652 10.2847 0.540117L19.2804 3.16794C19.7069 3.29252 20 3.68353 20 4.12782V9.51684C20 15.6116 16.0996 21.0224 10.3174 22.949C10.1123 23.0173 9.89046 23.0173 9.68528 22.949C3.90157 21.0224 0 15.6105 0 9.51435V4.12782C0 3.68344 0.293257 3.29236 0.719847 3.16787L9.72417 0.540045ZM2 4.8777V9.51435C2 14.6376 5.20889 19.1982 10.0013 20.9414C14.7922 19.1982 18 14.6388 18 9.51684V4.8775L10.0042 2.54175L2 4.8777Z" fill="#101E3F"></path></svg>`,
    langParam:"&language=",
    langFallback:"en",
    userLang:`${navigator.language.length > 2 ? navigator.language.slice(0, 2) : navigator.language}`,
    dateFormatFull:new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZoneName: "short",
        hour12: false,
        weekday: "long"
    }),
    dateFormatTime:new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
        hour12: true
    }),
    matchCategoryElem:{
        upcoming:document.querySelector("#upcoming"),
        live:document.querySelector("#live"),
        past:document.querySelector("#past")
    },
    interval: 1*1000,
    update: 10*1000,
    countStartMin: 48*60*60*1000,
    testCountStart: 874517936
}
let sysVar = {
    geo:[],
    broadcaster:[]

}
const API = {
    matches:`https://api.fifa.com/api/v3/calendar/matches?count=110&idSeason=${defaultData.fwc26SeasonID}`,
    match:`https://api.fifa.com/api/v3/calendar/`,
    flag:`https://api.fifa.com/api/v3/picture/flags-sq-4/`,
    tvChannel:`https://api.fifa.com/api/v3/watch/season/${defaultData.fwc26SeasonID}/`,
    fifageo:`https://api.fifa.com/api/geo/esigeo.json`,
    timeline:`https://api.fifa.com/api/v3/timelines/`
}

// calendar valid filter param => idTeam&idCompetition&idSeason&idStage
// const matchSearchFromTo = "https://api.fifa.com/api/v3/calendar/matches?from=2022-12-17T00%3A00%3A00Z&to=2022-12-19T23%3A59%3A59Z&language=id&count=500"
// const competitionAPI = "https://api.fifa.com/api/v3/competitions/17?language=id"
// const seasonAPI = "https://api.fifa.com/api/v3/seasons/9twbg4nxdgan7uvdgt08lo5ck?language=id"
// player status 1 = on, 2 = off
// fwc22 = https://www.fifa.com/id/match-centre/competition/17/season/255711?date=2022-12-18&tab=competitionMatches&prev=competition

// const matchAPI = "https://api.fifa.com/api/v3/calendar/"
// const teamsPages = "https://cxm-api.fifa.com/fifaplusweb/api/getAllTeamPages/285023?locale=id"
// const teamNextMatch = "https://api.fifa.com/api/v3/calendar/nextmatches?language=id&numberOfNextMatches=3&numberOfPreviousMatches=0&idTeam=43911&idCompetition=17&idSeason=285023&idStage=289273&idGroup=289275"
// const teamStandings = "https://api.fifa.com/api/v3/calendar/17/285023/289273/standing?language=id&count=200"

loadMatches();
const t = setInterval(() => {
    timestamp()
}, defaultData.interval);

const u = setInterval(() => {
    loadMatches(true)
}, defaultData.update);

setTimeout(() => {
    // matchCheck(document.querySelectorAll(".match")[1])
}, 5000);

// async function matchCheck(elem) {
//     if (elem.className==="match") {
//         const matchID = elem.dataset.id
//         let matchData = await clientRequest({
//             method: "GET",
//             cors:false,
//             url:`${API.match}${matchID}`,
//             async: true,
//             respType : "json"
//         })
//         console.warn(matchData);
//     } else {
//         throw new Error("element is not match element");
//     }
// }

async function timelineEvent(matchID) {
    let events = await clientRequest({
            method: "GET",
            cors:false,
            url:`${API.timeline}${matchID}`,
            async: true,
            respType : "json"
    })
    // console.log(events);
    
    return events;
}
function timestamp() {
    let matches
    if (document.querySelectorAll("#upcoming > .match").length > 0) {
        matches = document.querySelectorAll("#upcoming > .match")
        matches.forEach(elem => {
            let dateElem = elem.querySelector("[data-date]")
            let date = new Date(dateElem.dataset.date).getTime()
            let now = Date.now();
            let timer = date-now;
            // console.log(date,timer,formatTimer(timer));
            if (timer<=defaultData.countStartMin&&timer>0) {
                let countdownElem = elem.querySelector(".score")
                countdownElem.innerText = formatCountdownTimer(timer)
                countdownElem.title = defaultData.dateFormatTime.format(date)
            } else if (timer<0) {
                removeMatchElem(elem)
            }
        });
    }
    function formatCountdownTimer(timer) {
        const totalSeconds = Math.floor(timer / 1000);
        // console.warn(totalSeconds);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
}

async function getChannels(matchID) {
    if (sysVar.geo.length==0) {
        sysVar.geo = await clientRequest({
            method: "GET",
            cors:true,
            url:`${API.fifageo}`,
            async: true,
            respType : "json"
        })
    }
    // console.log(statuses.geo[0].CountryCode);
    
    if (sysVar.broadcaster.length==0) {
        sysVar.broadcaster = await clientRequest({
                method: "GET",
                cors:false,
                url:`${API.tvChannel}${sysVar.geo[0].CountryCode}`,
                async: true,
                respType : "json"
        });
    }
    const tvChannels = sysVar.broadcaster;
    // console.log(tvChannels);
    // console.log(tvChannels.Matches.find(item => item.IdMatch === "400021443"));
    if (matchID) {
        return tvChannels.Matches.find(item => item.IdMatch === `${matchID}`)
    } else {
        return tvChannels
    }
}

async function loadMatches(update) {
    const upcomingElem = defaultData.matchCategoryElem.upcoming;
    const liveElem = defaultData.matchCategoryElem.live;
    const pastElem = defaultData.matchCategoryElem.past;

    let matches;

    try {
        matches = await requestMatches(`${API.matches}${defaultData.langParam}${defaultData.userLang}`);
    } catch (error) {
        console.warn(error);
        matches = await requestMatches();
    }
    console.log(matches);
    
    sysVar.broadcaster = await getChannels();
    // console.log(sys.broadcaster.Matches);
    if (update) {
        removeMatchElem()
    }
    for (let i = 0; i < matches.length; i++) {
        if (matches[i].MatchStatus===1) {
            let matchEl = createMatchElem(matches[i], upcomingElem);
        } else if (matches[i].MatchStatus===3) {
            let matchEl = createMatchElem(matches[i], liveElem);
        } else if (matches[i].MatchStatus===0) {
            let matchEl = createMatchElem(matches[i], pastElem);
        } else {
            console.error("Status Error"+matches[i]);   
        }
    }
}

async function requestMatches(url) {
    if (!url) {
        url = `${API.matches}${defaultData.langParam}${defaultData.langFallback}`
    }
    const resp = await clientRequest({
            method: "GET",
            cors:false,
            url:url,
            async: true,
            respType : "json"
    });

    if (!resp || !resp.Results) {
        throw new Error(`Invalid response for language: ${defaultData.userLang}`);
    }

    return resp.Results
}

async function dataInit(data) {
    let valid = {
        Match:{
            ID:data.IdMatch,
            Broadcaster:[],
            Date:{
                raw:data.Date,
                formatFull:defaultData.dateFormatFull.format(new Date(data.Date)),
                formatTime:defaultData.dateFormatTime.format(new Date(data.Date))
            },
            Time:"0'",
            Stage:"",
            Group:"",
            Number:"",
            Event:[],
            Status:0
        },
        Home:{
            name:"",
            abr:"",
            flag:"",
            score:0
        },
        Away:{
            name:"",
            abr:"",
            flag:"",
            score:0
        },
        Stadium:{
            name:"",
            city:""
        }
    }
    if (data.MatchStatus) {
        valid.Match.Status = data.MatchStatus
    }

    if (data.Home) {
        valid.Home.name = data.Home.TeamName[0].Description
        valid.Home.abr = data.Home.Abbreviation
        valid.Home.flag = `<div class="flag"><img src="${API.flag}${data.Home.Abbreviation}" alt="${valid.Home.name} Flag" srcset=""></div>`
        if (data.Home.Score) {
            valid.Home.score = data.Home.Score
        }
    } else if(!data.Home){
        valid.Home.name = data.PlaceHolderA
        valid.Home.abr = data.PlaceHolderA
        valid.Home.flag = `<div class="flag">${defaultData.noFlagElem}</div>`
    }
    if (data.Away){
        valid.Away.name = data.Away.TeamName[0].Description
        valid.Away.abr = data.Away.Abbreviation
        valid.Away.flag = `<div class="flag"><img src="${API.flag}${data.Away.Abbreviation}" alt="${valid.Away.name} Flag" srcset=""></div>`
        if (data.Away.Score) {
            valid.Away.score = data.Away.Score
        }
    }else if(!data.Away){
        valid.Away.name = data.PlaceHolderB
        valid.Away.abr = data.PlaceHolderB
        valid.Away.flag = `<div class="flag">${defaultData.noFlagElem}</div>`
    }

    if (data.Stadium) {
        valid.Stadium.name = data.Stadium.Name[0].Description;
        valid.Stadium.city = data.Stadium.CityName[0].Description;
    }

    if (data.MatchTime) {
        valid.Match.Time = data.MatchTime;
    }

    if (data.StageName.length>0) {
        valid.Match.Stage = data.StageName[0].Description;
    }

    if (data.GroupName.length>0) {
        valid.Match.Group = data.GroupName[0].Description;
    }

    if (data.MatchNumber) {
        valid.Match.Number = data.MatchNumber;
    }

    const broadcastSource = await getChannels(valid.Match.ID)
    if (broadcastSource) {
        valid.Match.Broadcaster = broadcastSource.Sources
    }

    if (valid.Match.Status===3) {
        const events = await timelineEvent(valid.Match.ID)
        if (events.Event.length>0) {
            console.log(events);
            valid.Match.Event = events.Event
        }
    }
    // console.log(valid);
    
    return valid;
}

async function createMatchElem(data,targetParent) {
    // console.log(data);
    const matchData = await dataInit(data);
    // console.log(matchData);
    const matchElem = document.createElement("div");
    matchElem.className="match";
    matchElem.dataset.id=matchData.Match.ID

    if (targetParent===defaultData.matchCategoryElem.upcoming) {
        matchElem.innerHTML=`<div class="date" data-date="${matchData.Match.Date.raw}">${matchData.Match.Date.formatFull}<br>${matchData.Stadium.name}, ${matchData.Stadium.city}</div>
        <div class="mainInfo">
            ${matchData.Home.flag}
            <div class="center">
                <div class="matchnum">#${matchData.Match.Number}<br>${matchData.Match.Stage} ${matchData.Match.Group}
                </div>
                <div class="score">${matchData.Match.Date.formatTime}</div>
            </div>
            ${matchData.Away.flag}
            <div class="home">${matchData.Home.name}</div>
            <div class="footer">
                <div class="tvChannel"></div>
            </div>
            <div class="away">${matchData.Away.name}</div>
        </div>`
        
    }
    if(targetParent===defaultData.matchCategoryElem.live){
        matchElem.innerHTML=`<div class="date" data-date="${matchData.Match.Date.raw}">${matchData.Match.Date.formatFull}<br>${matchData.Stadium.name}, ${matchData.Stadium.city}</div>
        <div class="mainInfo">
            ${matchData.Home.flag}
            <div class="center">
                <div class="time">${matchData.Match.Stage} ${matchData.Match.Group} • #${matchData.Match.Number}<br>${matchData.Match.Time}</div>
                <div class="score">${matchData.Home.score} - ${matchData.Away.score}</div>
            </div>
            ${matchData.Away.flag}
            <div class="home">${matchData.Home.name}</div>
            <div class="footer">
                <div class="tvChannel"></div>
            </div>
            <div class="away">${matchData.Away.name}</div>
            <div class="timeline">${matchData.Match.Event[matchData.Match.Event.length-1].EventDescription[0].Description}</div>
        </div>`
    }
    
    targetParent.appendChild(matchElem)
    timestamp()

    for (let i = 0; i < matchData.Match.Broadcaster.length; i++) {
        const tv = document.createElement("a");
        tv.innerText = `${matchData.Match.Broadcaster[i].Name}\n`
        tv.href = matchData.Match.Broadcaster[i].TvChannelUrl
        matchElem.querySelector(".tvChannel").appendChild(tv)
    }

    return matchElem
}
async function removeMatchElem(elem) {
    if (elem) {
        elem.remove()
    } else {
        document.querySelectorAll(".match").forEach(element => {
            element.remove()
        });
    }
}