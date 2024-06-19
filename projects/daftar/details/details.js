"use strict";

import { MALClient } from "../../modules/MAL.js";
import { AnimeScheduleClient } from "../../modules/aniSched.js";
import { AnimeStatClient } from "../../modules/aniStat.js";
import { clientRequest } from "../../modules/xhr.js";

const urlParams = new URLSearchParams(window.location.search);
const checkParam = urlParams.has("id")
if (checkParam) {
    MALClient.detail(urlParams.get("id"),"anime").then(resp=>{
        detailDisplay(resp);
    }).catch(err=>{
        console.error(err);
        // redirect2MAL()
    })
}else{
    console.log(checkParam);
    redirect2MAL()
}
function redirect2MAL(id) {
    if (!id) {
        window.location.href = "https://myanimelist.net"
    }else{
        window.open(`https://myanimelist.net/anime/${id}`,"_blank")
    }
}
function formatDuration(seconds) {
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Create a formatted string
    let formattedTime = "";

    if (hours > 0) {
        formattedTime += `${hours} hour${hours !== 1 ? 's' : ''}, `;
    }

    if (minutes > 0 || hours > 0) { // include minutes if there are hours
        formattedTime += `${minutes} minute${minutes !== 1 ? 's' : ''}, `;
    }

    formattedTime += `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;

    return formattedTime;
}
function formatDate(date) {
    if (date===0) {
        return "???"
    }
    let time = new Date(date);
    let formatted = time.toLocaleDateString("en-US",{year: 'numeric', month: 'short', day: 'numeric'})
    let timestamp = time.getTime()
    let output = {
        formatted:formatted,
        timestamp:timestamp
    }
    return output
}
function formatRelativeDate(startTimestamp,endTimestamp) {
    let startDate = new Date(startTimestamp);
    let endDate = new Date(endTimestamp);

    // Calculate differences
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    // Adjust for negative values
    if (days < 0) {
        months--;
        days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    // Build the result string
    let result = [];
    if (years >= 1) {
        result.push(`${years} year${years !== 1 ? 's' : ''}`);
    }
    if (months >= 1) {
        result.push(`${months} month${months !== 1 ? 's' : ''}`);
    }
    if (days >= 1 || result.length === 0) { // Include days if there are no larger units
        result.push(`${days} day${days !== 1 ? 's' : ''}`);
    }

    return result.join(', ');
}
function formatAgeRating(input) {
    if (input==="g") {
        return "G - All Ages"
    }else if (input==="pg") {
        return "PG - Children"
    }else if (input==="pg_13") {
        return "PG13 - Teens 13 and Older"
    }else if (input==="r") {
        return "R17+ - Violence and Profanity"
    }else if (input==="r+") {
        return "R+ - Profanity and Mild Nudity"
    }else if (input==="rx") {
        return "Rx - Hentai"
    }else{
        throw `${input} is an Invalid input`
    }
}
function createHistoryChart(node){
    google.charts.load('current',{packages:['corechart']});

    // Set Data
    let meanarr

    // if (Array.isArray(node.nobyar.mean_history) && node.nobyar.mean_history.length > 0) {
    //     // console.log(node.nobyar.mean_history);
    //     meanarr = node.nobyar.mean_history;
    //     google.charts.setOnLoadCallback(drawChart);
    // } else {
    //     getAnimeScoreHistory(node.id).then((response) => {
    //         let ratingData = response.anime.eps
    //         console.log(ratingData);
    //         meanarr = []
    //         for (let i = 1; i < ratingData.length; i++) {
    //             meanarr.push({
    //                 timestamp: ratingData[i].created_at,
    //                 mean: ratingData[i].malRating,
    //             });
    //             console.log(meanarr);

    //             if (i==ratingData.length-1){
    //                 google.charts.setOnLoadCallback(drawChart);
    //             }  
    //         }

    //         // Create the Score History section
    //         const scoreHistorySection = document.createElement("div");
    //         scoreHistorySection.className = "entry_details_section";
    //         scoreHistorySection.innerHTML = `
    //             <h2>Score History</h2>
    //             <div id="myChart"></div>
    //         `;
    //         document.querySelector("#entry_details_container").appendChild(scoreHistorySection);
    //     })
    //     .catch((error) => {
    //         console.error("Error fetching score history:", error);
    //     });
    // }
    AnimeStatClient.entry({query:node.id}).then((response) => {
        let ratingData = response.data.anime.eps
        
        // console.log(ratingData);
        meanarr = []
        for (let i = 1; i < ratingData.length; i++) {
            meanarr.push({
                timestamp: ratingData[i].created_at,
                mean: ratingData[i].malRating,
            });
            // console.log(meanarr);

            if (i==ratingData.length-1){
                google.charts.setOnLoadCallback(drawChart);
            }  
        }

        // Create the Score History section
        const scoreHistorySection = document.createElement("div");
        // scoreHistorySection.style = "padding:0;"
        // scoreHistorySection.className = "entry_details_section";
        scoreHistorySection.innerHTML = `
            <h2><a href="https://anime-stats.net/anime/show/${node.id}" target="_blank" style="text-decoration:underline; color:white;">Score History</a><span class="material-symbols-outlined">
            open_in_new
            </span></h2>
            <div id="historyChart"></div>
        `;
        document.querySelector("#center").appendChild(scoreHistorySection);
    })
    .catch((error) => {
        console.groupCollapsed(`[Score History] Error getting score history for (${node.id}) ${node.title}`)
        console.error(error);
        console.groupEnd()
    });
      

    function drawChart() {
    var label = [['Date', 'Score', {'type': 'string', 'role': 'style'}]]
    var maxMean = -Infinity; // Initialize to a very low value
    var maxMeanIndex = -1;

    // Find the maximum mean and its index
    for (let i = 0; i < meanarr.length; i++) {
        let mean = meanarr[i].mean;
        if (mean > maxMean) {
            maxMean = mean;
            maxMeanIndex = i;
        }
    }

    // Populate the label array with data and styles
    for (let i = 0; i < meanarr.length; i++) {
        let currDate = new Date(meanarr[i].timestamp);
        let mean = meanarr[i].mean;
        let style = i === maxMeanIndex ? 'point { size: 18; shape-type: star; fill-color: #FFD700; }' : '';
        label.push([currDate, mean, style]);
    }

    var data = google.visualization.arrayToDataTable(label);
    // Set Options
    var options = {
    theme:"maximized",
    lineWidth: 5,
    pointSize: 8,
    colors: ['#fff'],
    backgroundColor: { fill:'transparent' },
    hAxis: {
        title:'Timestamp',
        slantedText: false,
        format:'MMM d, y',
        maxAlternation: 2,
        textStyle:{color: '#FFF'},
	    titleTextStyle:{color: '#FFF'}
    },
    vAxis: {
        title:'Score',
        textStyle:{color: '#FFF'},
        titleTextStyle:{color: '#FFF'},
            gridlines: {color: '#787878'}
    },
    legend:'none'
    };
    // Draw
    
    var chart = new google.visualization.LineChart(document.getElementById('historyChart'));
    chart.draw(data, options);
    }
}
function detailDisplay(data) {
    console.log(data);

    // Poster
    try {
        const poster = document.createElement("img")
        poster.src = data.main_picture.large
        poster.alt = `Poster of ${data.title}`
        document.querySelector("#poster").appendChild(poster)
    } catch (error) {
        console.warn(error);
    }

    // Title
    try {
        document.querySelector("#title").innerHTML = `<span class="material-symbols-outlined">
        open_in_new
    </span><a target="_blank" href="https://myanimelist.net/anime/${data.id}">${data.title}</a>`
    } catch (error) {
        console.warn(error);
    }

    // Score
    try {
        document.querySelector("#score").innerHTML = `${data.mean?data.mean:"???"}`
    } catch (error) {
        console.warn(error);
    }

    // Rank
    try {
        document.querySelector("#overview > div:nth-child(2) > div:nth-child(2) > div.stats-number").innerHTML = `#${data.rank?data.rank:"???"}`
    } catch (error) {
        console.warn(error);
    }

    // Popularity
    try {
        document.querySelector("#overview > div:nth-child(2) > div:nth-child(3) > div.stats-number").innerHTML = `#${data.popularity?data.popularity:"???"}`
    } catch (error) {
        console.warn(error);
    }

    // Members
    try {
        document.querySelector("#overview > div:nth-child(2) > div:nth-child(4) > div.stats-number").innerHTML = `${data.statistics.num_list_users?data.statistics.num_list_users:"???"}`
    } catch (error) {
        console.warn(error);
    }

    // Type
    try {
        document.querySelector("#overview > div:nth-child(2) > div:nth-child(5) > div.stats-number").innerHTML = `${data.media_type?data.media_type:"???"}`
        document.querySelector("#overview > div:nth-child(2) > div:nth-child(5) > div.stats-number").style = `text-transform:uppercase;`
    } catch (error) {
        console.warn(error);
    }

    // Season
    try {
        document.querySelector("#overview > div:nth-child(2) > div:nth-child(6) > div.stats-number").innerHTML = `${data.start_season.season?data.start_season.season:"???"} ${data.start_season.year?data.start_season.year:"???"}`
    } catch (error) {
        console.warn(error);
    }

    // Source
    try {
        document.querySelector("#overview > div:nth-child(2) > div:nth-child(7) > div.stats-number").innerHTML = `${data.source?data.source:"???"}`
    } catch (error) {
        console.warn(error);
    }

    // Episodes
    try {
        document.querySelector("#overview > div:nth-child(3) > div:nth-child(1) > div.data-value").innerHTML = `${data.num_episodes?data.num_episodes:"???"}`
    } catch (error) {
        console.warn(error);
    }

    // Duration
    try {
        document.querySelector("#overview > div:nth-child(3) > div:nth-child(2) > div.data-value").innerHTML = `${formatDuration(data.average_episode_duration?data.average_episode_duration:0)}<br><br>(*Total: ${formatDuration(data.average_episode_duration?data.average_episode_duration*data.num_episodes:0)})<h5>*including opening and ending</h5>`
    } catch (error) {
        console.warn(error);
    }

    // Status
    try {
        document.querySelector("#overview > div:nth-child(3) > div:nth-child(3) > div.data-value").innerHTML = `${data.status?data.status.replace(/_/g, " "):"???"}`
        document.querySelector("#overview > div:nth-child(3) > div:nth-child(3) > div.data-value").style = `text-transform:capitalize;`
    } catch (error) {
        console.warn(error);
    }

    // Aired
    try {
        document.querySelector("#overview > div:nth-child(3) > div:nth-child(4) > div.data-value").innerHTML = `${formatDate(data.start_date?data.start_date:0).formatted} - ${formatDate(data.end_date?data.end_date:0).formatted} (${formatRelativeDate(data.start_date,data.end_date)})`
    } catch (error) {
        console.warn(error);
    }

    // Broadcast
    try {
        document.querySelector("#overview > div:nth-child(3) > div:nth-child(5) > div.data-value").innerHTML = `${data.broadcast.day_of_the_week?data.broadcast.day_of_the_week:"???"}, ${data.broadcast.start_time ? data.broadcast.start_time + " JST" : ""} `
        document.querySelector("#overview > div:nth-child(3) > div:nth-child(5) > div.data-value").style = `text-transform:capitalize;`
    } catch (error) {
        console.warn(error);
    }

    // Producers
    try {
        AnimeStatClient.entry({query:data.id}).then(resp=>{
            let t = resp.data.anime.producers
            document.querySelector("#overview > div:nth-child(3) > div:nth-child(6) > div.data-value").innerHTML = `${t.map(item=>item.name).join(", ")}`
            
            console.log(t);
        }).catch(err=>{
            console.warn(err);
        })
    } catch (error) {
        console.warn(error);
    }
    
    // Studios
    try {
        document.querySelector("#overview > div:nth-child(3) > div:nth-child(7) > div.data-value").innerHTML = `${data.studios.map(id=>id.name).join(', ')}`
    } catch (error) {
        console.warn(error);
    }

    // Age Rating
    try {
        document.querySelector("#overview > div:nth-child(3) > div:nth-child(8) > div.data-value").innerHTML = `${formatAgeRating(data.rating)}`
    } catch (error) {
        console.warn(error);
    }

    // Background info
    try {
        document.querySelector("#background-info").innerText = `${data.background?data.background:""}`
    } catch (error) {
        console.warn(error);
    }

    // Synopsis
    try {
        document.querySelector("#synopsis").innerText = `${data.synopsis?data.synopsis:"Synopsis not found"}`
    } catch (error) {
        console.warn(error);
    }
    
    // Score History
    try {
        createHistoryChart(data)
    } catch (error) {
        console.warn(error);
    }

    // Recommendation
    try {
        if (data.recommendations.length!=0) {
            data.recommendations.forEach(item => {
                console.log(item);
                const elem = document.createElement("div");
                elem.className = "rec_item";
                elem.innerHTML = `
                <div class="rec_item_poster">
                <img src="${item.node.main_picture.medium}" alt="Poster of ${item.node.title}" srcset="">
            </div>
            <div class="rec_item_title">${item.node.title}</div>
            <div class="rec_item_users">
                <span>${item.num_recommendations}</span>
                <span class="material-symbols-outlined">
                    group
                </span>
            </div>
                `;
                elem.addEventListener("click",function(){
                    redirect2MAL(item.node.id)
                })
                document.querySelector("#recommendation").appendChild(elem);
            });
        }else{
            const elem = document.createElement("div");
                elem.id = "rec_none";
                elem.innerHTML = `There's no recommendations for this entry yet.
                `;
                document.querySelector("#recommendation").appendChild(elem);
        }
    } catch (error) {
        console.warn(error);
    }
}
