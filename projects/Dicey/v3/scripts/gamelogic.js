var canAttack
var hostRoll
var gameStatus

const UpdateBattleCharacterDisplay = () => {
    // Load Items Database
    GETDatabase().then(responseData => {
        console.log("Database",responseData)
        if(role == "host"){
            document.getElementById("chara_name").innerText = responseData.response[0].characterData[versusPlayerData[1].charID].name
            document.getElementById("chara_bg").style = `background-image: url(${responseData.response[0].characterData[versusPlayerData[1].charID].background});`
            document.getElementById("chara_illust").src = responseData.response[0].characterData[versusPlayerData[1].charID].art

            document.getElementById("self_chara_name").innerText = responseData.response[0].characterData[versusPlayerData[0].charID].name
        } else {
            document.getElementById("chara_name").innerText = responseData.response[0].characterData[versusPlayerData[0].charID].name
            document.getElementById("chara_bg").style = `background-image: url(${responseData.response[0].characterData[versusPlayerData[0].charID].background});`
            document.getElementById("chara_illust").src = responseData.response[0].characterData[versusPlayerData[0].charID].art
            
            document.getElementById("self_chara_name").innerText = responseData.response[0].characterData[versusPlayerData[1].charID].name
        }
        document.getElementById("blind").remove()
    }).catch(err => {
        setTimeout(UpdateBattleCharacterDisplay(),5000)
        console.log(err,"Retrying...")
    })
}

function Attack(index){
    if (index==0&&canAttack==true&&gameStatus=="running"){
        console.log("rolling dice")
        let roll = Math.floor((Math.random() * 6) + 1);
        SideLog("system",`You rolled ${roll}`)
        if (role=="host"){
            hostRoll = roll
        }
        GameTurns(roll);
    }
}
function processAttack(hostRoll,clientRoll){
    // Number(hostRoll);
    // Number(clientRoll);
    console.log(versusPlayerData[0].HP)
    console.log(versusPlayerData[1].HP)
    console.log(hostRoll)
    console.log(clientRoll)
    if (hostRoll>clientRoll){
        versusPlayerData[1].HP = versusPlayerData[1].HP - hostRoll
        SideLog("system",`Host attacking!\n${hostRoll} vs ${clientRoll}`)
        if (role=="host"){
            gameChecker()
            hurtAnim(true);
            updateHPBar();
        } else if (role=="client"){
            hurtAnim(false);
            updateHPBar();
        }
    } else if (clientRoll>hostRoll){
        versusPlayerData[0].HP = versusPlayerData[0].HP - clientRoll
        SideLog("system",`Client attacking!\n${hostRoll} vs ${clientRoll}`)
        if (role=="client"){
            hurtAnim(true);
            updateHPBar();
        } else if(role=="host"){
            gameChecker()
            hurtAnim(false);
            updateHPBar();
        }
    } else if (hostRoll==clientRoll){
        SideLog("system",`DRAW!\n${hostRoll} vs ${clientRoll}`)
        updateHPBar();
    }
}
function updateHPBar(){
    if (role=="host"){
        document.getElementById("main_content_enemyhp_bar").style.width = `${versusPlayerData[1].HP}%`
        document.getElementById("main_content_enemyhp_damage").style.width = `${versusPlayerData[1].HP}%`

        document.getElementById("main_content_playerhp_bar").style.width = `${versusPlayerData[0].HP}%`
        document.getElementById("main_content_playerhp_damage").style.width = `${versusPlayerData[0].HP}%`
    } else {
        document.getElementById("main_content_enemyhp_bar").style.width = `${versusPlayerData[0].HP}%`
        document.getElementById("main_content_enemyhp_damage").style.width = `${versusPlayerData[0].HP}%`

        document.getElementById("main_content_playerhp_bar").style.width = `${versusPlayerData[1].HP}%`
        document.getElementById("main_content_playerhp_damage").style.width = `${versusPlayerData[1].HP}%`
    }
}
function GameTurns(roll){
    let embed = [
        {
            "description": "\`\`\`] Game in-progress...\`\`\`\\nGame data:\\n",
            "color": 15597654,
            "author": {
                "name": "-"
            },
            "fields": [
                {
                    "name": "versus id",
                    "value": versus_id,
                    "inline": false
                },
                {
                  "name": "Player 1",
                  "value": "*-*",
                  "inline": true
                },
                {
                  "name": "Player 2",
                  "value": "*-*",
                  "inline": true
                }
            ]
        }
    ]
    if (role=="host"&&canAttack==true){
        embed[0].author.name = `${versusPlayerData[1].username}`
        // embed[0].fields[0].value = `${versus_id}`
        embed[0].fields[1].value = `||${roll}||`
        canAttack = false
        PATCH(versus_id,embed)
    } else if (role=="client"&&canAttack==true){
        canAttack = false
        GET(versus_id).then(responseData => {
            let hostRoll = responseData.response[0].embeds[0].fields[1].value
            embed[0].author.name = `${versusPlayerData[0].username}`
            embed[0].fields[1].value = `${hostRoll}`
            embed[0].fields[2].value = `||${roll}||`
            canAttack = false

            hostRoll = hostRoll.replace("||","")
            hostRoll = hostRoll.replace("||","")
            hostRoll = parseInt(hostRoll)
            console.log(hostRoll,roll)
            processAttack(hostRoll,roll);
            PATCH(versus_id,embed)
        })
    } else {
        canAttack = false
        SideLog("system","Unable to attack, its not your turn yet")
    }
}
function turnsChecker(){
    if (canAttack==false){
        GET(versus_id).then(responseData => {
            if (responseData.response[0].embeds[0].description=="```Game Ended```"){
                console.log("game ended")
            }
            
            let turn = responseData.response[0].embeds[0].author.name


            if (role=="host"&&turn==versusPlayerData[0].username){
                document.getElementById("alertParent").innerHTML = `<div id="turnAlertContainer">
                <div id="turnAlertLabel">Your Turn</div>
                </div>`


                let clientRoll = responseData.response[0].embeds[0].fields[2].value
                clientRoll = clientRoll.replace("||","")
                clientRoll = clientRoll.replace("||","")
                clientRoll = parseInt(clientRoll)

                processAttack(hostRoll,clientRoll);
                SideLog("system","Your turn!")
                canAttack = true
            } else if (role=="client"&&turn==versusPlayerData[1].username){
                document.getElementById("alertParent").innerHTML = `<div id="turnAlertContainer">
                <div id="turnAlertLabel">Your Turn</div>
                </div>`
                SideLog("system","Your turn!")
                canAttack = true
            }
                // if (role=="host"&&turn=="Processing..."){
                //     let hostRoll = responseData.response[0].embeds[0].fields[1].value
                //     hostRoll = hostRoll.replace("||","")
                //     hostRoll = hostRoll.replace("||","")
                //     let clientRoll = responseData.response[0].embeds[0].fields[2].value
                //     clientRoll = clientRoll.replace("||","")
                //     clientRoll = clientRoll.replace("||","")
                //     console.log(hostRoll,clientRoll)
                //     processAttack(hostRoll,clientRoll);
            
                //     let embed = [
                //         {
                //             "description": "\`\`\`] Game in-progress...\`\`\`\\nGame data:\\n",
                //             "color": 15597654,
                //             "author": {
                //                 "name": versusPlayerData[0].username
                //             },
                //             "fields": [
                //                 {
                //                     "name": "versus id",
                //                     "value": versus_id,
                //                     "inline": false
                //                 },
                //                 {
                //                     "name": "Player 1",
                //                     "value": "*-*",
                //                     "inline": true
                //                 },
                //                 {
                //                     "name": "Player 2",
                //                     "value": "*-*",
                //                     "inline": true
                //                 }
                //             ]
                //         }
                //     ]
                //     PATCH(versus_id,embed)
                // } else if (role=="client"&&turn=="Processing..."){
                //     let hostRoll = responseData.response[0].embeds[0].fields[1].value
                //     hostRoll = hostRoll.replace("||","")
                //     hostRoll = hostRoll.replace("||","")
                //     let clientRoll = responseData.response[0].embeds[0].fields[2].value
                //     clientRoll = clientRoll.replace("||","")
                //     clientRoll = clientRoll.replace("||","")
                //     console.log(hostRoll,clientRoll)
                //     processAttack(hostRoll,clientRoll);
                // }
            
            
            // console.log("Turn Check",responseData)
        })
    }
    setTimeout(() => {
        // console.log("check turns")
        turnsChecker()
    }, 3000);
    // return canAttack
}
function gameChecker(){
    let embed = [
        {
            "description": "-",
            "color": 15597654,
            "author": {
                "name": "Game ended"
            },
            "thumbnail": {
                "url":"-"
            }
        }
    ]
    if (role=="host"&&gameStatus=="running"){
        if (versusPlayerData[0].HP<=0){
            versusPlayerData[0].HP = 0
            updateHPBar()
            document.getElementById("alertParent").innerHTML = `<div id="turnAlertContainer">
                <div id="turnAlertLabel">Game over</div>
            </div>`
            embed[0].description = `**${versusPlayerData[1].username} Wins!**`
            embed[0].thumbnail.url = versusPlayerData[1].avatar
            gameStatus="ended"
            PATCH(versus_id,embed)
            console.error("Game over")
        } else if (versusPlayerData[1].HP<=0){
            versusPlayerData[1].HP = 0
            updateHPBar()
            document.getElementById("alertParent").innerHTML = `<div id="turnAlertContainer">
                <div id="turnAlertLabel">Game over</div>
            </div>`
            embed[0].description = `**${versusPlayerData[0].username} Wins!**`
            embed[0].thumbnail.url = versusPlayerData[0].avatar
            gameStatus="ended"
            PATCH(versus_id,embed)
            console.error("Game over")
            SideLog("error",`Game ended\n${versusPlayerData[0].username}:${versusPlayerData[0].HP}HP\n${versusPlayerData[1].username}:${versusPlayerData[1].HP}HP`)
        }
    }
    setTimeout(() => {
        if (gameStatus=="running"){
            console.log("End game check")
            gameChecker()  
        }
    }, 1000);
}
function hurtAnim(canShake){
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
    } else {
        return
    }
}

// const WaitTurns = () => {
//     if (CanAction==false){
//         GET(versus_id).then(responseData => {
//             if (responseData.response[0].embeds[0].description=="```Game ended```"){
//                 return
//             } else {
//                 let turnPhase = responseData.response[0].embeds[0].author.name
//                 // console.log(`turn: ${turnPhase}`)
//                 if (role=="host"){
//                     if(turnPhase==versusPlayerData[0].username){
//                         client_roll = responseData.response[0].embeds[0].fields[2].value
//                         ProcessAttack(host_roll,client_roll)
//                         setTimeout(function () {
//                             if (gameIsRunning==1){
//                                 document.getElementById("alertParent").innerHTML = `<div id="turnAlertContainer">
//                                 <div id="turnAlertLabel">Your Turn</div>
//                                 </div>`
//                                 SideLog("system",`Your turn!`);
//                                 CanAction = true
//                             }
//                         }, 1500);
//                     }
//                 } else if (role=="client"){
//                     if(turnPhase==client_username){
//                         host_roll = responseData.response[0].embeds[0].fields[1].value
        

//                         document.getElementById("alertParent").innerHTML = `<div id="turnAlertContainer">
//                         <div id="turnAlertLabel">Your Turn</div>
//                         </div>`
//                         SideLog("system",`Your turn!`);
//                         CanAction = true
//                     }
//                 }
//             }
//         }).catch(err => {
//             console.log(err)
//             CanAction = false
//             console.log("Retrying...")
//         })
//     }
//     // console.log("CanAction: "+CanAction)
//     if (gameIsRunning==1){
//         // console.log("Loop Wait Turn")
//         setTimeout(function () {
//             WaitTurns();
//         }, 5000); 
//     }
// }