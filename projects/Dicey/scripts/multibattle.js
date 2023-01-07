var CanAction
var gameIsRunning = 1

var host_roll
var host_HP = 100
var host_prevHP

var client_roll
var client_HP = 100
var client_prevHP

const UpdateBattleCharacterDisplay = () => {
    // Load Items Database
    GETDatabase().then(responseData => {
        localDatabase = responseData.response[0]
        console.log(localDatabase)

        // Update Name
        let name = localDatabase.characterData[fetched_character].name
        document.getElementById("chara_name").innerText = name
        // Update Character Background
        let background = localDatabase.characterData[fetched_character].background
        document.getElementById("chara_bg").style = `background-image: url(${background});`
        // Update Character Art
        let art = localDatabase.characterData[fetched_character].art
        document.getElementById("chara_illust").src = art

        // Update Name
        let selfName = localDatabase.characterData[profileData[0].ActiveItems.Character].name
        document.getElementById("self_chara_name").innerText = selfName
    }).catch(err => {
        setTimeout(UpdateCharacterDisplay(),5000)
        console.log(err)
    })
}



// i added this incase theres more type of attack added in the future
const Attack = (index) =>{
    if (index==0&&CanAction==true){
        console.log("rolling dice")
        let roll = Math.floor((Math.random() * 6) + 1);
        GameTurns(roll);
    }
}


const GameTurns = (RollNum) => {
    if (role=="host"&&CanAction==true){
        host_roll = RollNum
        let embeds = JSON.parse(`{
            "description": "GameTurns();",
            "color": 15597654,
            "author": {
                "name": "${host_username}",
                "icon_url": "${host_pfp}"
            },
            "fields": [
                {
                    "name": "Game Turns:",
                    "value": "${client_username}",
                    "inline": false
                },
                {
                    "name": "${host_username} rolled:",
                    "value": "${host_roll}",
                    "inline": true
                },
                {
                    "name": "${client_username} rolled:",
                    "value": "||???||",
                    "inline": true
                }
            ]
        }`)
        PATCH(host_inviteID,embeds).then(responseData => {
            SideLog("system",`You rolled ${host_roll}`)
            // ChatBubble(host_pfp,`[System] Rolled ${host_roll}`)
            CanAction=false
        }).catch(err => {
            console.log(err)
        })
    } else if (role=="client"&&CanAction==true){
        client_roll = RollNum
        let embeds = JSON.parse(`{
            "description": "GameTurns();",
            "color": 15597654,
            "author": {
                "name": "${host_username}",
                "icon_url": "${host_pfp}"
            },
            "fields": [
                {
                    "name": "Game Turns:",
                    "value": "${host_username}",
                    "inline": false
                },
                {
                    "name": "${host_username} rolled:",
                    "value": "${host_roll}",
                    "inline": true
                },
                {
                    "name": "${client_username} rolled:",
                    "value": "${client_roll}",
                    "inline": true
                }
            ]
        }`)
        PATCH(host_inviteID,embeds).then(responseData => {
            SideLog("system",`You rolled ${client_roll}`)
            // ChatBubble(client_pfp,`[System] Rolled ${client_roll}`)
            CanAction=false

            ProcessAttack(host_roll,client_roll)
        }).catch(err => {
            console.log(err)
        })
    }
}


const WaitTurns = () => {
    if (CanAction==false){
        GET(host_inviteID).then(responseData => {
            if (responseData.response[0].embeds[0].description=="```Game ended```"){
                return
            } else {
                let turnPhase = responseData.response[0].embeds[0].fields[0].value
                // console.log(`turn: ${turnPhase}`)
                if (role=="host"){
                    if(turnPhase==host_username){
                        client_roll = responseData.response[0].embeds[0].fields[2].value
                        ProcessAttack(host_roll,client_roll)
                        setTimeout(function () {
                            if (gameIsRunning==1){
                                document.getElementById("alertParent").innerHTML = `<div id="turnAlertContainer">
                                <div id="turnAlertLabel">Your Turn</div>
                                </div>`
                                SideLog("system",`Your turn!`);
                                CanAction = true
                            }
                        }, 1500);
                    }
                } else if (role=="client"){
                    if(turnPhase==client_username){
                        host_roll = responseData.response[0].embeds[0].fields[1].value
        

                        document.getElementById("alertParent").innerHTML = `<div id="turnAlertContainer">
                        <div id="turnAlertLabel">Your Turn</div>
                        </div>`
                        SideLog("system",`Your turn!`);
                        CanAction = true
                    }
                }
            }
        }).catch(err => {
            console.log(err)
            CanAction = false
            console.log("Retrying...")
        })
    }
    // console.log("CanAction: "+CanAction)
    if (gameIsRunning==1){
        // console.log("Loop Wait Turn")
        setTimeout(function () {
            WaitTurns();
        }, 5000); 
    }
}
const hurtAnim = (canShake) => {
    let hurt_rng = Math.floor((Math.random() * 2) + 1);
    let charaIllust = document.getElementById("chara_illust")
    let charaBG = document.getElementById("chara_bg")

    let audio = new Audio('../assets/IMPACT_Generic_03_mono.wav');
    audio.mozPreservesPitch = false;
    audio.playbackRate=hurt_rng
    audio.play();

    if (canShake==true){
        if (charaIllust.src=="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/1200px-HD_transparent_picture.png"){
            charaBG.classList.add(`hurt${hurt_rng}`);
            setTimeout(function () {
                charaBG.classList.remove(`hurt1`)
            }, 500);
            setTimeout(function () {
                charaBG.classList.remove(`hurt2`)
            }, 500);
        } else {
            charaIllust.classList.add(`hurt${hurt_rng}`);
            setTimeout(function () {
                charaIllust.classList.remove(`hurt1`)
            }, 500);
            setTimeout(function () {
                charaIllust.classList.remove(`hurt2`)
            }, 500);
        }
    }
}
const ProcessAttack = (HostHand,ClientHand) => {
    SideLog("system",`${host_roll} vs ${client_roll}`)
    // console.log(`${HostHand} Vs. ${ClientHand}`)
    if (HostHand>ClientHand) {
        client_prevHP = client_HP
        client_HP = client_HP-HostHand
        if (role=="host"){
            hurtAnim(true);
            updateHPBar()
        } else {
            hurtAnim(false);
            updateHPBar()
        }
    } else if (ClientHand>HostHand) {
        host_prevHP = host_HP
        host_HP = host_HP-ClientHand
        if (role=="client"){
            hurtAnim(true);
            updateHPBar()
        } else {
            hurtAnim(false);
            updateHPBar()
        }
    } else if (HostHand==ClientHand){
        SideLog("system",`DRAW!\n${host_roll} vs ${client_roll}`)
        updateHPBar()
    }

    if (host_HP<=0){
        if (role=="host"){
            let embeds = JSON.parse(`{
                "description": "\`\`\`Game ended\`\`\`",
                "color": 16761344,
                "fields": [
                    {
                        "name": "Winner 👑",
                        "value": "${client_username}",
                        "inline": false
                    }
                ],
                "thumbnail": {
                    "url": "${client_pfp}"
                }
            }`)
            PATCH(host_inviteID,embeds).then(responseData => {
                SideLog("system",`${client_username} Win!`)
                host_HP = 0
                CanAction = false
                gameIsRunning = 0
                updateHPBar()
            }).catch(err => {
                console.log(err)
            })
        } else if (role=="client"){
            SideLog("system",`${client_username} Win!`)
            host_HP = 0
            CanAction = false
            gameIsRunning = 0
            updateHPBar()
        }
        console.log("game ended")
    } else if (client_HP<=0){
        if (role=="host"){
            let embeds = JSON.parse(`{
                "description": "\`\`\`Game ended\`\`\`",
                "color": 16761344,
                "fields": [
                    {
                        "name": "Winner 👑",
                        "value": "${host_username}",
                        "inline": false
                    }
                ],
                "thumbnail": {
                    "url": "${host_pfp}"
                }
            }`)
            PATCH(host_inviteID,embeds).then(responseData => {
                SideLog("system",`${host_username} Win!`)
                client_HP = 0
                CanAction = false
                gameIsRunning = 0
                updateHPBar()
            }).catch(err => {
                console.log(err)
            })
        } else if (role=="client"){
            SideLog("system",`${host_username} Win!`)
            client_HP = 0
            CanAction = false
            gameIsRunning = 0
            updateHPBar()
        }
        console.log("game ended")
    }
}

const updateHPBar = () => {
    if (role=="host"){
        document.getElementById("main_content_enemyhp_bar").style.width = `${client_HP}%`
        document.getElementById("main_content_enemyhp_damage").style.width = `${client_HP}%`

        document.getElementById("main_content_playerhp_bar").style.width = `${host_HP}%`
        document.getElementById("main_content_playerhp_damage").style.width = `${host_HP}%`
    } else if (role=="client"){
        document.getElementById("main_content_enemyhp_bar").style.width = `${host_HP}%`
        document.getElementById("main_content_enemyhp_damage").style.width = `${host_HP}%`

        document.getElementById("main_content_playerhp_bar").style.width = `${client_HP}%`
        document.getElementById("main_content_playerhp_damage").style.width = `${client_HP}%`
    }
}
//     let timestamp
//     let timestamp_old
//     console.log("[4]WAITING...")       
//     let xmlHttp = new XMLHttpRequest();
//     xmlHttp.open( "GET", `https://discord.com/api/webhooks/871795497881440278/PGB-ytcBMwXtz27-t_2EMkz7MT8VtYGrucuDIR_etDDKTqq5FMnZj_iJeDSH0qlgOFez/messages/${host_inviteID}?${new Date().getTime()}`, false ); // false for synchronous request 
//     xmlHttp.setRequestHeader('Content-type', 'application/json');
//     xmlHttp.send();
//     timestamp_old = timestamp
//     timestamp = JSON.parse(xmlHttp.responseText).edited_timestamp
//     if (timestamp!=timestamp_old){
//         console.log(`
//             ${role}

//             oTimestamp: ${timestamp_old}
//             Timestamp:  ${timestamp}

//             [Host]
//             Username:   ${host_username}
//             PfP:        ${host_pfp}
//             ChatID:     ${host_chatID}
//             InviteID:   ${host_inviteID}

//             [Client]
//             Username:   ${client_username}
//             PfP:        ${client_pfp}
//             ChatID:     ${client_chatID}
//             InviteID:   ${client_inviteID}
//         `)
//         clearInterval(waiting);
//         turnstatus="go"
//     }
//     let waiting=setInterval(WaitTurns,1500)
// }

// function battle_turn(){
//     if (role=="host"){
//         if (turnstatus=="go"){

//         } else if (turnstatus=="wait"){
//             WaitTurns();
//         }
//     } else if (role=="client"){
//         if (turnstatus=="go"){

//         } else if (turnstatus=="wait"){
//             WaitTurns();
//         }
//     }
// }