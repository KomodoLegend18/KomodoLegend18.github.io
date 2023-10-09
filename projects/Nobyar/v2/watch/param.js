const queryString = window.location.search;
// console.log(queryString);
const urlParams = new URLSearchParams(queryString);

var URLfromHost
var syncTime

var watchID
var watchURL

if (urlParams.has('id')==true){
    watchID = urlParams.get('id')
    watchURL = urlParams.get('url')
    watchJoin(watchID,watchURL);

    setInterval(() => {
        if(sync_setting.value=="true"){
            console.log("> Auto-Syncing...");
            autoSync(watchID,watchURL)
        }
    }, 5000);
    console.log("Connected to ",watchID,watchURL);

    searchInput.classList.add("disabled")
    searchInput.placeholder = "Only host can search anime"
} 


setInterval(initAutoSend,10000)
function initAutoSend(){
    if (urlParams.has('id')==false){
        if(posted==true){
            if (player.paused==false){
                console.log(player.paused);
                console.log("> Auto send data");
                hostSend("Playing")
            }
        }
        // host_invite()
    }
}

function watchJoin(watchID,watchURL){
    console.warn("Join");
    discordWebhook("GET",`${watchURL}/messages/${watchID}?${new Date().getTime()}`,true).then(response=>{
        console.groupCollapsed("[join connection]")
        let resp = response.response[0]
        let respEmbed = resp.embeds
        console.log("discord response",respEmbed);

        // When the last time host update
        const hostTimestamp = Number(respEmbed[0].fields[0].value.match(/\d+/g)[0])
        // Time diff between host and client
        let localTimestamp = Math.round(new Date().getTime()/1000)
        let lastUpdate = localTimestamp-hostTimestamp
        // console.log(hostTimestamp,localTimestamp,lastUpdate,`${Math.round(lastUpdate/60)} minutes ago`);

        // Get available video url from host
        URLfromHost = JSON.parse(respEmbed[1].description.replace(/`/g, ''));
        console.log("video urls",URLfromHost);

        // Get host video time
        syncTime = Number(respEmbed[0].fields[2].value)
        // console.log(syncTime+lastUpdate);

        player.poster = respEmbed[0].image.url

        for (let i = 0; i < URLfromHost.length; i++) {
            const data = URLfromHost[i]
            // Create a new option element
            var option = document.createElement("option");

            // Set the value attribute
            option.value = `${data.url}`;
            
            // Set the text content
            option.textContent = `${data.type}`;

            if (data.type==`${defaultQuality}p`){
                option.selected = true
                player.src = option.value
                // player.muted = true
            } else {
                player.src = URLfromHost[0].url
                // player.autoplay = true
                // player.muted = true
            }
            quality_setting.appendChild(option);
        }

        console.groupEnd()
        // debugger

        // setInterval(() => {
        //     watchJoin(watchID)
        // }, 5000);
    })
}

function sync(watchID,watchURL){
    if(urlParams.has('id')==true){
        discordWebhook("GET",`${watchURL}/messages/${watchID}?${new Date().getTime()}`,true).then(response=>{
            console.groupCollapsed("[sync success]")
            let resp = response.response[0]
            let respEmbed = resp.embeds
            console.log(respEmbed);

            const hostStatus = respEmbed[0].fields[1].value
            console.log(hostStatus);

            // When the last time host update
            const hostTimestamp = Number(respEmbed[0].fields[0].value.match(/\d+/g)[0])
            // Time diff between host and client
            let localTimestamp = Math.round(new Date().getTime()/1000)
            let lastUpdate = localTimestamp-hostTimestamp
            console.log(hostTimestamp,localTimestamp,lastUpdate,`${Math.round(lastUpdate/60)} minutes ago`);
    
            // Get available video url from host
            URLfromHost = JSON.parse(respEmbed[1].description.replace(/`/g, ''));
            console.log(URLfromHost);
    
            // Get host video time
            syncTime = Number(respEmbed[0].fields[2].value)
    
            let frameDiff = Math.round((syncTime+lastUpdate)*24)-Math.round(player.currentTime*24)
    
            let secondDiff = frameDiff/24
    
    
            if(hostStatus=="Playing"){
            console.warn("Frame Diff: ",frameDiff,`${secondDiff} Seconds`);

            document.title = `${frameDiff}f / ${secondDiff}s diff`

            let diffThreshold = 8
            let frameOffset = 4

            // player.play()
            player.autoplay = true
                if (frameDiff>=diffThreshold||frameDiff<=-20){
                    player.currentTime = syncTime+lastUpdate+(frameOffset/24)
                    togglePlay("Playing")
                    console.log("Playing",syncTime+lastUpdate);
                }else{
                    console.warn(`${frameDiff}f / ${secondDiff}s difference, no need to update`);
                }
            }else if(hostStatus=="Paused"){
                player.currentTime = syncTime
                togglePlay("Paused")
                console.log("Paused",syncTime);
            }else if(hostStatus=="Ended"){
                player.currentTime = player.duration
                console.log("Ended",player.duration);
            }
            // debugger
            console.groupEnd()
        })
    }
}
function autoSync(watchID,watchURL){
    // console.log(sync_setting.value);
    
    // console.log("egg");
    sync(watchID,watchURL)
}



// if (urlParams.has('username')==true){
//     var URLParamUsername = urlParams.get('username')
//     const log_username_history = document.createElement("div");
//     log_username_history.setAttribute(`class`, `log_history`);
//     log_username_history.setAttribute(`id`,`log_system`)
//     log_username_history.textContent=`Hello, ${URLParamUsername}!`
//     document.getElementById("log_display").appendChild(log_username_history)
//     document.getElementById("log_display").scrollTop=document.getElementById("log_display").scrollHeight

//     console.log(URLParamUsername);
// }

        

        
// if (urlParams.has('pfp')==true){
//     var URLParamPic = urlParams.get('pfp')
//     const log_pfp_history = document.createElement("div");
//     log_pfp_history.setAttribute(`class`, `log_history`);
//     log_pfp_history.setAttribute(`id`,`log_system`)
//     log_pfp_history.innerHTML=`<img width="50%" src="${URLParamPic}">`
//     document.getElementById("log_display").appendChild(log_pfp_history)
//     document.getElementById("log_display").scrollTop=document.getElementById("log_display").scrollHeight

    
//     console.log(URLParamPic);
// }
        
// function URLParam2Var(role){
//     if (role=="host"){
//         host_username = localStorage.getItem("dicey2_Username")
//         host_pfp = localStorage.getItem("dicey2_Avatar")
//         console.log("Host")
//     }
// }