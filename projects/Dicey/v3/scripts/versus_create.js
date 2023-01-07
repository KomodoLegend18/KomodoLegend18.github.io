var role

var profile_data = JSON.parse(localStorage.getItem("diceyV3_save"))

var localDatabase

var versus_id

var host_username
var host_pfp

var client_username
var client_pfp

// SideLog("system",`Fetching items database...`)
// GETDatabase().then(responseData => {
//     SideLog("system",`Successfully fetched items database.`)
//     localDatabase = responseData.response[0]
//     console.log(localDatabase)
// }).catch(err => {
//     console.log(err)
// })

// #1 "Host" created versus room
function versus_create(){
    role = "host"
    storeVersusPlayer()

    SideLog("system",`Creating versus room...`)
    
    let embeds = [
        {
            "description": "\`\`\`] Waiting for player\`\`\`\\nGame data:\\n",
            "color": 15597654,
            "author": {
                "name": "${host_username"
            },
            "fields": [
                {
                    "name": "versus id",
                    "value": "loading...",
                    "inline": false
                },
                {
                  "name": "Player 1",
                  "value": "*Waiting for other player.*",
                  "inline": true
                },
                {
                  "name": "Player 2",
                  "value": "*-*",
                  "inline": true
                }
            ]
        },
        {
            "description": `\`\`\`${versusPlayerData[0].username} Joined the room.\`\`\``,
            "color": 15597654,
            "author": {
                "name": "Player 1"
            },
            "thumbnail": {
                "url": `${versusPlayerData[0].avatar}`
            },
            "fields": [
                {
                    "name": "Username",
                    "value": `${versusPlayerData[0].username}`,
                    "inline": true
                },
                {
                    "name": "Title",
                    "value": `${versusPlayerData[0].title}`,
                    "inline": true
                },
                {
                  "name": "Character id",
                  "value": `${versusPlayerData[0].charID}`,
                  "inline": false
                },
                {
                  "name": "Chat Fx",
                  "value": `${versusPlayerData[0].chatFX}`,
                  "inline": false
                },
                {
                  "name": "Chat ID",
                  "value": `${versusPlayerData[0].chatID}`,
                  "inline": false
                }
            ]
        },
        {
            "description": `\`\`\`Waiting for player...\`\`\``,
            "color": 15597654,
            "author": {
                "name": "Player 2"
            },
            "fields": [
                {
                    "name": "Username",
                    "value": `${versusPlayerData[1].username}`,
                    "inline": true
                },
                {
                    "name": "Title",
                    "value": `${versusPlayerData[1].title}`,
                    "inline": true
                },
                {
                  "name": "Character id",
                  "value": `${versusPlayerData[1].charID}`,
                  "inline": false
                },
                {
                  "name": "Chat Fx",
                  "value": `${versusPlayerData[1].chatFX}`,
                  "inline": false
                },
                {
                  "name": "Chat ID",
                  "value": `${versusPlayerData[1].chatID}`,
                  "inline": false
                }
            ]
        }
    ]
    // console.log(embeds)
    POST(true,embeds).then(responseData =>{
        console.log("POST",responseData)
        versus_id=responseData.response[0].id

        let chat_embed = [
            {
                "description": `${versusPlayerData[0].username} Joined the room`,
                "color": 15597654,
                "author": {
                    "name": `${versusPlayerData[0].username}`,
                    "icon_url":`${versusPlayerData[0].avatar}`
                }
            }
        ]
        POST(true,chat_embed).then(responseData => {
            versusPlayerData[0].chatID = responseData.response[0].id
            
            SideLog("system",versus_id)

            embeds[0].fields[0].value = versus_id
            embeds[1].fields[4].value = versusPlayerData[0].chatID

            console.log("CHAT POST",responseData)
            console.log(embeds)
            PATCH(versus_id ,embeds).then(responseData => {
                console.log("PATCH",responseData)
                SideLog("system",`Successfully created room.\n\nWaiting for other player...`)

                versus_create_wait()
            }).catch(err =>{
                console.error(err)
            })
        }).catch(err => {
            console.error(err)
        })
        
        function versus_create_wait(){
            GET(versus_id).then(responseData => {
                console.log(responseData.response[0].embeds[2].description)
                if (responseData.response[0].embeds[0].fields[2].value=="*Ready!*"){
                    console.warn("GET",responseData)
                    versusPlayerData[1].username = 
                    responseData.response[0].embeds[2].fields[0].value
                    versusPlayerData[1].avatar = 
                    responseData.response[0].embeds[2].thumbnail.url
                    versusPlayerData[1].charID = 
                    responseData.response[0].embeds[2].fields[2].value
                    versusPlayerData[1].title = 
                    responseData.response[0].embeds[2].fields[1].value
                    versusPlayerData[1].chatFX = 
                    responseData.response[0].embeds[2].fields[3].value
                    versusPlayerData[1].chatID = 
                    responseData.response[0].embeds[2].fields[4].value
        
                    embeds[0].description = "\`\`\`] Connection established, Starting Game...\`\`\`"
                    embeds[0].author.name = versusPlayerData[0].username
                    embeds[0].fields[1].value = "*Ready!*"
                    embeds[0].fields[2].value = "*Ready!*"
                    console.warn("Embeds",embeds)

                    embeds[2].description = `\`\`\`${versusPlayerData[1].username} Joined the room.\`\`\``
                    embeds[2].fields[0].value = versusPlayerData[1].username
                    embeds[2].fields[1].value = versusPlayerData[1].title
                    embeds[2].fields[2].value = versusPlayerData[1].charID
                    embeds[2].fields[3].value = versusPlayerData[1].chatFX
                    embeds[2].fields[4].value = versusPlayerData[1].chatID

                    embeds.splice(1,2)
                    // console.log(embeds)

                    PATCH(versus_id ,embeds).then(responseData => {
                        console.log("PATCH",responseData)
                        console.warn("Successfully stored player data",versusPlayerData)
                        SideLog("system",`Connection established.\nGame ready to start!`)

                        ChatSync()
                        UpdateBattleCharacterDisplay()
                        updateHPBar();
                        

                        canAttack = false
                        gameStatus = "running"
                        turnsChecker()
                    }).catch(err =>{
                        console.error(err)
                    })
                } else {
                    // console.error(responseData)
                    setTimeout(() => {
                        versus_create_wait()
                    }, 3000);
                }
            }).catch(err => {
                console.log(err)
            })
        }
        // user_infocard();
    }).catch(err =>{
        console.log(err)
    })
}
// #2. "Client" joins versus room
function versus_join(){
    role = "client"
    storeVersusPlayer()
    GET(versus_id).then(responseData => {
        console.log(responseData)
        versusPlayerData[0].username = responseData.response[0].embeds[1].fields[0].value
        versusPlayerData[0].avatar = responseData.response[0].embeds[1].thumbnail.url
        versusPlayerData[0].charID = responseData.response[0].embeds[1].fields[2].value
        versusPlayerData[0].title = responseData.response[0].embeds[1].fields[1].value
        versusPlayerData[0].chatFX = responseData.response[0].embeds[1].fields[3].value
        versusPlayerData[0].chatID = responseData.response[0].embeds[1].fields[4].value


        let embeds = [
            {
                "description": "\`\`\`] Waiting for player\`\`\`",
                "color": 15597654,
                "author": {
                    "name": "${host_username"
                },
                "fields": [
                    {
                        "name": "versus id",
                        "value": `${versus_id}`,
                        "inline": false
                    },
                    {
                      "name": "Player 1",
                      "value": "*Loading...*",
                      "inline": true
                    },
                    {
                      "name": "Player 2",
                      "value": "*Ready!*",
                      "inline": true
                    }
                ]
            },
            {
                "description": `\`\`\`${versusPlayerData[0].username} Joined the room.\`\`\``,
                "color": 15597654,
                "author": {
                    "name": "Player 1"
                },
                "thumbnail": {
                    "url": `${versusPlayerData[0].avatar}`
                },
                "fields": [
                    {
                        "name": "Username",
                        "value": `${versusPlayerData[0].username}`,
                        "inline": true
                    },
                    {
                        "name": "Title",
                        "value": `${versusPlayerData[0].title}`,
                        "inline": true
                    },
                    {
                      "name": "Character id",
                      "value": `${versusPlayerData[0].charID}`,
                      "inline": false
                    },
                    {
                      "name": "Chat Fx",
                      "value": `${versusPlayerData[0].chatFX}`,
                      "inline": false
                    },
                    {
                      "name": "Chat ID",
                      "value": `${versusPlayerData[0].chatID}`,
                      "inline": false
                    }
                ]
            },
            {
                "description": `\`\`\`${versusPlayerData[1].username} Joined the room.\`\`\``,
                "color": 15597654,
                "author": {
                    "name": "Player 2"
                },
                "thumbnail": {
                    "url": `${versusPlayerData[1].avatar}`
                },
                "fields": [
                    {
                        "name": "Username",
                        "value": `${versusPlayerData[1].username}`,
                        "inline": true
                    },
                    {
                        "name": "Title",
                        "value": `${versusPlayerData[1].title}`,
                        "inline": true
                    },
                    {
                      "name": "Character id",
                      "value": `${versusPlayerData[1].charID}`,
                      "inline": false
                    },
                    {
                      "name": "Chat Fx",
                      "value": `${versusPlayerData[1].chatFX}`,
                      "inline": false
                    },
                    {
                      "name": "Chat ID",
                      "value": `${versusPlayerData[1].chatID}`,
                      "inline": false
                    }
                ]
            }
        ]
        let chat_embed = [
            {
                "description": `${versusPlayerData[0].username} Joined the room`,
                "color": 15597654,
                "author": {
                    "name": `${versusPlayerData[1].username}`,
                    "icon_url":`${versusPlayerData[1].avatar}`
                }
            }
        ]
        POST(true,chat_embed).then(responseData => {
            versusPlayerData[1].chatID = responseData.response[0].id
            
            SideLog("system",versus_id)

            embeds[2].fields[4].value = versusPlayerData[1].chatID

            console.log("CHAT POST",responseData)
            console.log(embeds)

            PATCH(versus_id ,embeds).then(responseData => {
                console.log(responseData)
                console.warn("Successfully stored player data",versusPlayerData)
                SideLog("system",`Connection established, waiting for host...`)

                ChatSync()
                UpdateBattleCharacterDisplay()
                updateHPBar();

                canAttack = false
                gameStatus = "running"
                turnsChecker()
            }).catch(err =>{
                console.log(err)
            })
        }).catch(err => {
            console.error(err)
        })
    }).catch(err => {
        console.error("[error occured, either embed doesn't exist or game has already started]\n",err)
        SideLog("error",`Error occured, either embed doesn't exist or game has already started`)
    })
    console.log(versusPlayerData)
    SideLog("system",`Welcome, ${versusPlayerData[1].username}!\nAttempting to connect to host`)

}