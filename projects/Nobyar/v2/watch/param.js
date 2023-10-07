const queryString = window.location.search;
// console.log(queryString);
const urlParams = new URLSearchParams(queryString);

let URLfromHost
let syncTime

if (urlParams.has('id')==true){
    var watchID = urlParams.get('id')    

    setInterval(() => {
        sync()
    }, 6000);
    console.log(watchID);
    watchJoin(watchID);
} else if (urlParams.has('id')==false){

    // host_invite()
}

function watchJoin(watchID){
    console.warn("Join");
    discordWebhook("GET",`${webhookurl}/messages/${watchID}?${new Date().getTime()}`,true).then(response=>{
        let resp = response.response[0]
        let respEmbed = resp.embeds
        console.log(respEmbed);

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
                player.autoplay = true
                // player.muted = true
            } else {
                player.src = URLfromHost[0].url
                player.autoplay = true
                // player.muted = true
            }
            quality_button.appendChild(option);
        }

        console.log(syncTime+lastUpdate);
        // debugger

        // setInterval(() => {
        //     watchJoin(watchID)
        // }, 5000);
    })
}

function sync(){
    console.log("> Syncing...");
    discordWebhook("GET",`${webhookurl}/messages/${watchID}?${new Date().getTime()}`,true).then(response=>{
        let resp = response.response[0]
        let respEmbed = resp.embeds
        console.log(respEmbed);

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

        if(respEmbed[0].fields[1].value=="Playing"){
            // player.play()
            player.currentTime = syncTime+lastUpdate
            togglePlay("Playing")
            console.log("Playing",syncTime+lastUpdate);
        }else if(respEmbed[0].fields[1].value=="Paused"){
            player.currentTime = syncTime
            togglePlay("Paused")
            console.log("Paused",syncTime);
        }else if(respEmbed[0].fields[1].value=="Ended"){
            player.currentTime = player.duration
            buffer_overlay.style["display"] = "grid"
            progress_status.innerHTML = `Data Ended`
            console.log("Ended",player.duration);
        }

        console.log("Playing",syncTime+lastUpdate);
        // debugger

    })
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