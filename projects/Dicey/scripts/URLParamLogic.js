const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);



if (urlParams.has('InviteID')==true){
    var URLParamInviteID = urlParams.get('InviteID')
    host_inviteID = URLParamInviteID
    SideLog("system",`Joined: ${host_inviteID}`)
    // const log_enemyID_history = document.createElement("div");
    // log_enemyID_history.setAttribute(`class`, `log_history`);
    // log_enemyID_history.setAttribute(`id`,`log_system`)

    
    // log_enemyID_history.textContent=`Loaded EnemyID: ${host_inviteID} from URL`
    // document.getElementById("log_display").appendChild(log_enemyID_history)
    // document.getElementById("log_display").scrollTop=document.getElementById("log_display").scrollHeight

    console.log(host_inviteID);
    invite_join();
} else if (urlParams.has('InviteID')==false){
    var URLParamInviteID = urlParams.get('InviteID')
    const log_enemyID_history = document.createElement("div");
    log_enemyID_history.setAttribute(`class`, `log_history`);
    log_enemyID_history.setAttribute(`id`,`log_system`)

    host_invite()
}

if (urlParams.has('username')==true){
    var URLParamUsername = urlParams.get('username')
    const log_username_history = document.createElement("div");
    log_username_history.setAttribute(`class`, `log_history`);
    log_username_history.setAttribute(`id`,`log_system`)
    log_username_history.textContent=`Hello, ${URLParamUsername}!`
    document.getElementById("log_display").appendChild(log_username_history)
    document.getElementById("log_display").scrollTop=document.getElementById("log_display").scrollHeight

    console.log(URLParamUsername);
}

        

        
if (urlParams.has('pfp')==true){
    var URLParamPic = urlParams.get('pfp')
    const log_pfp_history = document.createElement("div");
    log_pfp_history.setAttribute(`class`, `log_history`);
    log_pfp_history.setAttribute(`id`,`log_system`)
    log_pfp_history.innerHTML=`<img width="50%" src="${URLParamPic}">`
    document.getElementById("log_display").appendChild(log_pfp_history)
    document.getElementById("log_display").scrollTop=document.getElementById("log_display").scrollHeight

    
    console.log(URLParamPic);
}
        
function URLParam2Var(role){
    if (role=="host"){
        host_username = localStorage.getItem("dicey2_Username")
        host_pfp = localStorage.getItem("dicey2_Avatar")
        console.log("Host")
    }
}