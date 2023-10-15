const queryString = window.location.search;
// console.log(queryString);
const urlParams = new URLSearchParams(queryString);

var watchID
var watchURL

var URLfromHost
var hostTimestamp
var hostStatus
var syncTime

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

    miscContainer.querySelector("input").remove()
    miscContainer.querySelector("p:nth-child(2)").remove()
} else if (urlParams.has('id')==false){
    // When host, auto send data every 10s
    setInterval(initAutoSend,10000)
}

function initAutoSend(){
    if(posted==true){
        // console.log(player.paused);
        console.log("> Auto send data");
        if(player.paused){
            hostSend("Paused")
        }else if(player.ended){
            hostSend("Ended")
        }else{
            hostSend("Playing")
        }
    }
    // host_invite()
}

function watchJoin(watchID,watchURL){
    console.warn("Join");
    discordWebhook("GET",`${watchURL}/messages/${watchID}?${new Date().getTime()}`,true).then(response=>{
        console.groupCollapsed("[join connection]")
        let resp = response.response[0]
        let respEmbed = resp.embeds
        console.log("discord response",respEmbed);

        // When the last time host update
        hostTimestamp = Number(respEmbed[0].fields[0].value.match(/\d+/g)[0])
        // Time diff between host and client
        // let localTimestamp = Math.round(new Date().getTime()/1000)
        // let lastUpdate = localTimestamp-hostTimestamp
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
                player.load()
            } else {
                player.src = URLfromHost[0].url
                player.load()
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
            let resp = response.response[0]
            let respEmbed = resp.embeds
            hostStatus = respEmbed[0].fields[1].value
            // When the last time host update
            hostTimestamp = Number(respEmbed[0].fields[0].value.match(/\d+/g)[0])
            // Time diff between host and client
            let localTimestamp = new Date().getTime()/1000
            let lastUpdate = localTimestamp-hostTimestamp
            // Get available video url from host
            URLfromHost = JSON.parse(respEmbed[1].description.replace(/`/g, ''));
            // Get host video time
            syncTime = Number(respEmbed[0].fields[2].value)
            let frameDiff = Math.round((syncTime+lastUpdate)*24)-Math.round(player.currentTime*24)
            let secondDiff = frameDiff/24

            console.groupCollapsed(`[sync] 🟢 Success Getting data | ${frameDiff}f/${secondDiff}s`)
            console.log(respEmbed);
            console.log(hostStatus);            
            console.log(hostTimestamp,localTimestamp,lastUpdate,`${Math.round(lastUpdate/60)} minutes ago`);
            console.log(URLfromHost);
    
            if(hostStatus=="Playing"){
                // document.title = `${frameDiff}f / ${secondDiff}s diff`
                let frameDiffThreshold = 24*5
                let secondOffset = 0
                if(player.readyState==4){
                    // togglePlay("Playing")
                    if (frameDiff>=frameDiffThreshold*2){
                        player.currentTime = syncTime+lastUpdate+(secondOffset/24)
                        togglePlay("Playing")
                        console.warn(`${frameDiff}f / ${secondDiff}s difference, Skipping ahead...`);
                    }else if(frameDiff>=24){
                        togglePlay("Playing")
                    }
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
        }).catch(err=>{
            console.groupCollapsed(`[sync] 🔴 Failed Getting data (${err.message})`)
            console.trace(err)
            console.groupEnd()
        })
    }
}

function syncSpeedUp() {
    if (urlParams.has('id')==true&&hostStatus=="Playing"&&sync_setting.value=="true"){
        let localTimestamp = Date.now()/1000
        let lastUpdate = localTimestamp-hostTimestamp
        let targetPlayerTime = syncTime+lastUpdate
        let frameDiff = Math.round((syncTime+lastUpdate)*24)-Math.round(player.currentTime*24)
        let secondDiff = frameDiff/24

        // console.log(player.currentTime,targetPlayerTime);
        if(player.currentTime>=targetPlayerTime){
            player.playbackRate = 1
            player.currentTime = targetPlayerTime
        }else if(frameDiff>24){
            // player.playbackRate = 2
            console.warn(`${frameDiff}f / ${secondDiff}s difference, Speed up!`);
            if(player.buffered.length>0){
                // console.groupCollapsed("Buffer")
                for (let i = 0; i < player.buffered.length; i++) {
                    let recentBufferStart = player.buffered.start(i)
                    let recentBufferEnd = player.buffered.end(i)
                    // console.warn("Buffer Distance:\n",i,`Start: ${recentBufferStart}`,`End: ${recentBufferEnd}`);
                    if(player.currentTime>=recentBufferStart&&player.currentTime<=recentBufferEnd){
                        let bufferDist = Math.round(recentBufferEnd-player.currentTime)
                        console.log(`buffer index ${i} is the closest: ${player.currentTime} => ${bufferDist}s`,recentBufferStart,recentBufferEnd);
                        console.warn(bufferDist);
                        if(bufferDist>=55){
                            console.log("x2");
                            player.playbackRate = 2
                        }else if(bufferDist<35){
                            console.log("too slow, skip");
                            player.playbackRate = 1
                            player.currentTime = targetPlayerTime
                        }else if(bufferDist<55){
                            console.log("x1.5");
                            player.playbackRate = 1.5
                        }
                    }
                }
                // console.groupEnd()
            }
        }
        document.title = `${frameDiff}f / ${secondDiff}s diff`
    }
}
function autoSync(watchID,watchURL){
    // console.log(sync_setting.value);
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