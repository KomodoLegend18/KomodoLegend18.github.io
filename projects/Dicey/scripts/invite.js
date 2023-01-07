var role

var profileData = JSON.parse(localStorage.getItem("dicey2_profileData"))

var localDatabase

var host_username
var host_pfp
var host_chatID
var host_inviteID

var client_username
var client_pfp
var client_chatID

var fetched_card
var fetched_character
var fetched_chatfx

SideLog("system",`Fetching items database...`)
GETDatabase().then(responseData => {
    SideLog("system",`Successfully fetched items database.`)
    localDatabase = responseData.response[0]
    console.log(localDatabase)
}).catch(err => {
    console.log(err)
})
function host_invite(){
    console.log(profileData)
    role = "host"
    host_username = profileData[0].Username
    host_pfp = profileData[0].Avatar
    SideLog("system",`Welcome, ${host_username}!`)

    invitation();
    function invitation() {
        SideLog("system",`[1/5] Sending Chat Entity...`)
        console.log("[1/5.H]SENDING INVITATION...")
        let embeds = JSON.parse(`{
            "description": "${host_username} is looking for a challenger",
            "color": 15597654,
            "author": {
                "name": "${host_username}",
                "icon_url": "${host_pfp}"
            }
        }`)
        POST(true,embeds).then(responseData =>{
            console.log(responseData)
            host_chatID=responseData.response[0].id

            user_infocard();
        }).catch(err =>{
            console.log(err)
        })
        // ==================================
    }
    function user_infocard(){
        SideLog("system",`[2/5] Sending Invite Entity...`)
        console.log("[2/5.H]SENDING INFOCARD...")
        let embeds = JSON.parse(`{
            "description": "loading ${host_username}'s info...",
            "color": 15597654,
            "author": {
                "name": "[System]",
                "icon_url": "${host_pfp}"
            }
        }`)
        POST(true,embeds).then(responseData => {
            console.log(responseData)
            host_inviteID=responseData.response[0].id

            update_infocard();
        }).catch(err =>{
            console.log(err)
        })
        // ==================================
    }
    function update_infocard(){
        SideLog("system",`[3/5] Updating Invite Entity...`)
        console.log("[3/5.H]SENDING UPDATED INFOCARD...")
        let embeds = JSON.parse(`{
            "description": "\`\`\`] Waiting for player\`\`\`\\nGame data:\\n",
            "color": 15597654,
            "author": {
                "name": "${host_username}",
                "icon_url": "${host_pfp}"
            },
            "fields": [
                {
                    "name": "invite_gate",
                    "value": "${host_inviteID}",
                    "inline": true
                },
                {
                  "name": "chat_gate",
                  "value": "${host_chatID}",
                  "inline": true
                },
                {
                  "name": "card(s) ID",
                  "value": "${profileData[0].ActiveItems.Cards}",
                  "inline": true
                },
                {
                  "name": "character ID",
                  "value": "${profileData[0].ActiveItems.Character}",
                  "inline": true
                },
                {
                  "name": "chatfx ID",
                  "value": "${profileData[0].ActiveItems.ChatFX}",
                  "inline": true
                }
            ]
        }`)
        PATCH(host_inviteID,embeds).then(responseData => {
            console.log(responseData)
            // host_inviteID = JSON.parse(request.responseText).embeds[0].fields[0].value
            SideLog("system",`[4/5] Waiting for Player...`)
            waiting_challenger();
        }).catch(err =>{
            console.log(err)
        })
    }

    function waiting_challenger(){ 
        GET(host_inviteID).then(responseData => {
            if(responseData.response[0].embeds[0].fields[1].value!=host_chatID){
                // Enemy Avatar
                client_pfp = responseData.response[0].embeds[0].author.icon_url
                // Enemy Username
                client_username = responseData.response[0].embeds[0].author.name
                // Enemy ChatID
                client_chatID = responseData.response[0].embeds[0].fields[1].value
                // Enemy Card(s)
                fetched_card = responseData.response[0].embeds[0].fields[2].value
                // Enemy Character
                fetched_character = responseData.response[0].embeds[0].fields[3].value
                // Enemy ChatFX
                fetched_chatfx = responseData.response[0].embeds[0].fields[4].value
                UpdateBattleCharacterDisplay();
                ChatSync();
                if (client_chatID!=host_chatID&&client_chatID!=undefined&&client_chatID!=`||`){
                    startgame();
                }
            }else {
                setTimeout(function () {
                    console.log("[4/5.H]WAITING...")
                    waiting_challenger()
                }, 3500); 
            }
        }).catch(err => {
            console.log(err)
        })
        const startgame = () => {
            let embeds = JSON.parse(`{
                "description": "\`\`\`] Connection established, Game in-progress...\`\`\`",
                "color": 15597654,
                "author": {
                    "name": "${client_username}",
                    "icon_url": "${client_pfp}"
                },
                "fields": [
                    {
                        "name": "Game Turns:",
                        "value": "Loading...",
                        "inline": false
                    },
                    {
                        "name": "${host_username} rolled:",
                        "value": "||???||",
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
                console.log(responseData)
                SideLog("system",`[5/5] ${client_username} Joined the Game`)
                console.log("[5/5.H]SUCCESSFULLY HOOKED OPPONENT's ID...")
                console.log(`
                    [Host]
                    Username:
                    ${host_username}
                    PfP:
                    ${host_pfp}
                    ChatID:
                    ${host_chatID}
                    InviteID:
                    ${host_inviteID}

                    [Client]
                    Username:
                    ${client_username}
                    PfP:
                    ${client_pfp}
                    ChatID:
                    ${client_chatID}

                    the enemy is using:
                    Card(s): ${fetched_card}
                    Character: ${fetched_character}
                    ChatFX: ${fetched_chatfx}
                `);

                // Continue to game logic here ()
                setTimeout(function () { // initiate turn checking
                    CanAction=true
                    WaitTurns();
                    SideLog("system",`Your turn!`);
                    document.getElementById("alertParent").innerHTML = `<div id="turnAlertContainer">
                    <div id="turnAlertLabel">Your Turn</div>
                    </div>`
                }, 1000); 
            }).catch(err =>{
                console.log(err)
            })
        }
    }
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function invite_join(){
    role = "client"
    client_username = profileData[0].Username
    client_pfp = profileData[0].Avatar
    SideLog("system",`Welcome, ${client_username}!`)

    invitation_read();
    function invitation_read(){
        SideLog("system",`[1/3] Reading Invite...`)
        console.log("[1/3.C]READING INVITATION...")
        GET(host_inviteID).then(responseData =>{
            host_username = responseData.response[0].embeds[0].author.name
            host_pfp = responseData.response[0].embeds[0].author.icon_url
            host_chatID = responseData.response[0].embeds[0].fields[1].value

            // Enemy Card(s)
            fetched_card = responseData.response[0].embeds[0].fields[2].value
            // Enemy Character
            fetched_character = responseData.response[0].embeds[0].fields[3].value
            // Enemy ChatFX
            fetched_chatfx = responseData.response[0].embeds[0].fields[4].value

            console.log(`
            [Host]
            Username:   ${host_username}
            PfP:        ${host_pfp}
            ChatID:     ${host_chatID}
            InviteID:   ${host_inviteID}

            [Client]
            Username:   ${client_username}
            PfP:        ${client_pfp}
            ChatID:     ${client_chatID}

            the enemy is using:
                Card(s): ${fetched_card}
                Character: ${fetched_character}
                ChatFX: ${fetched_chatfx}
            `)

            invitation_join()
            UpdateBattleCharacterDisplay()
        }).catch(err =>{
            console.log(err)
        })                    
    }
    function invitation_join() {
        SideLog("system",`[2/3] Creating Chat Entity...`)
        console.log("[2/3.C]JOINING INVITATION...")
        let embeds = JSON.parse(`{
            "description": "${client_username} accepted ${host_username}'s challenge",
            "color": 15597654,
            "author": {
                "name": "${client_username}",
                "icon_url": "${client_pfp}"
            }
        }`)

        POST(true,embeds).then(responseData => {
            console.log(responseData)
            client_chatID = responseData.response[0].id

            console.log(`
            [Host]
            Username:   ${host_username}
            PfP:        ${host_pfp}
            ChatID:     ${host_chatID}
            InviteID:   ${host_inviteID}

            [Client]
            Username:   ${client_username}
            PfP:        ${client_pfp}
            ChatID:     ${client_chatID}
            `)

            update_invitation();
        }).catch(err => {
            console.log(err)
        })
        // ==================================
    }
    function update_invitation(){
        SideLog("system",`[3/3] Sending Data to ${host_username}...`)
        console.log("[3/3.C]SENDING UPDATED INVITATION...")
        let embeds = JSON.parse(`{
            "description": "\`\`\`] Awaiting response...\`\`\`\\nGame data:\\n",
            "color": 15597654,
            "author": {
                "name": "${client_username}",
                "icon_url": "${client_pfp}"
            },
            "fields": [
                {
                    "name": "invite_gate",
                    "value": "${host_inviteID}",
                    "inline": true
                },
                {
                    "name": "chat_gate",
                    "value": "${client_chatID}",
                    "inline": true
                },
                {
                  "name": "card(s) ID",
                  "value": "${profileData[0].ActiveItems.Cards}",
                  "inline": true
                },
                {
                  "name": "character ID",
                  "value": "${profileData[0].ActiveItems.Character}",
                  "inline": true
                },
                {
                  "name": "chatfx ID",
                  "value": "${profileData[0].ActiveItems.ChatFX}",
                  "inline": true
                }
            ]
        }`)
        PATCH(host_inviteID,embeds).then(responseData => {
            console.log(responseData)
            console.log(`
            [Host]
            Username:   ${host_username}
            PfP:        ${host_pfp}
            ChatID:     ${host_chatID}
            InviteID:   ${host_inviteID}

            [Client]
            Username:   ${client_username}
            PfP:        ${client_pfp}
            ChatID:     ${client_chatID}
        `)

            // Continue to game logic ()
            ChatSync()
            setTimeout(function () { // initiate turn checking
                CanAction=false
                WaitTurns();
            }, 1000); 
        }).catch(err => {
            console.log(err)
        })
        // chat_get()
    }
}