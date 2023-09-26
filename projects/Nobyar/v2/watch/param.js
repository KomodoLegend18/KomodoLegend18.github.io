const queryString = window.location.search;
// console.log(queryString);
const urlParams = new URLSearchParams(queryString);

let URLfromHost
let syncTime


if (urlParams.has('id')==true){
    var watchID = urlParams.get('id')    

    console.log(watchID);
    watchJoin(watchID);
} else if (urlParams.has('id')==false){
    var watchID = urlParams.get('id')

    // host_invite()
}

function watchJoin(watchID){
    console.warn("Join");
    discordWebhook("GET",`${webhookurl}/messages/${watchID}?${new Date().getTime()}`,true).then(response=>{
        let resp = response.response[0]
        let respEmbed = resp.embeds[0]

        // When the last time host update
        const numRegex = Number(respEmbed.fields[0].value.match(/\d+/g)[0])
        // Time diff between host and client
        let localtime = new Date().getTime()/1000
        let lastUpdate = localtime-numRegex
        console.log(numRegex,localtime,lastUpdate,`${Math.round(lastUpdate/60)} minutes ago`);

        URLfromHost = respEmbed.fields[1].value.replace(/`/g, '');
        syncTime = Number(respEmbed.fields[2].value)

        player.src = URLfromHost

        console.log(syncTime+Number(lastUpdate));
        // debugger

        // setInterval(() => {
        //     watchJoin(watchID)
        // }, 5000);
    })
}

function sync(){
    discordWebhook("GET",`${webhookurl}/messages/${watchID}?${new Date().getTime()}`,true).then(response=>{
        let resp = response.response[0]
        let respEmbed = resp.embeds[0]

        // When the last time host update
        const numRegex = Number(respEmbed.fields[0].value.match(/\d+/g)[0])
        // Time diff between host and client
        let localtime = new Date().getTime()/1000
        let lastUpdate = localtime-numRegex
        console.log(numRegex,localtime,lastUpdate,`${Math.round(lastUpdate/60)} minutes ago`);

        URLfromHost = respEmbed.fields[1].value.replace(/`/g, '');
        syncTime = Number(respEmbed.fields[2].value)

        player.currentTime = syncTime+lastUpdate

        console.log(syncTime+Number(lastUpdate));
        // debugger

        // setInterval(() => {
        //     watchJoin(watchID)
        // }, 5000);
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