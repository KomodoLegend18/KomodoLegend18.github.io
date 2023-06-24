if (URLWebhook!=""){
    console.log(URLWebhook)
    // debugger
    updateWebhook()

} else {
    console.warn(`WEBHOOK URL is empty, unable to send embed`)
}
function updateWebhook(){
    getFifaCalendar().then(responseData => {
        let liveMatch = []
        let upcomingMatch = []
        let pastMatch = []
        for (let i = 0; i < responseData.length; i++){
            // match upcoming
            if (responseData[i].MatchStatus==1){
                upcomingMatch.push(responseData[i])
            }
            // match live
            if (responseData[i].MatchStatus==3||responseData[i].MatchStatus==12){
                liveMatch.push(responseData[i])
                let IdCompetition = responseData[i].IdCompetition
                let IdSeason = responseData[i].IdSeason
                let IdStage = responseData[i].IdStage
                let IdMatch = responseData[i].IdMatch
                getFifaLive(IdCompetition,IdSeason,IdStage,IdMatch).then(responseData => {
                    // console.log(responseData)
                    liveMatch[liveMatch.length-1].MatchTime = responseData.MatchTime
                })
            }
            // match ended
            if (responseData[i].MatchStatus==0){
                pastMatch.push(responseData[i])
            }
        }
        console.log(`Live Matches:`,liveMatch)
        console.log(`Upcoming Matches:`,upcomingMatch)
        if (upcomingMatch.length>25){
            upcomingMatch.length = 25
        }
        pastMatch.reverse()
        if (pastMatch.length>2){
            pastMatch.length = 2
        }
        setTimeout(function(){
            liveEmbed(liveMatch,upcomingMatch,pastMatch)
        },2000)
        // upcomingEmbed(upcomingMatch)

        console.log(`API Response:`,responseData)
    }).catch(err => {
        console.log(err,`\nRetrying...`)
        setTimeout(function(){
            updateWebhook()
        },updateInterval)
    })
        
    // ===============================
        // getLiveScore().then(responseData => {
        //     let liveMatch = responseData
        //     if (liveMatch.length==0){ // no live match
        //         console.warn(`No Live Matches Found`)
        //         getUpcomingMatch().then(responseData => {
        //             // console.log(responseData)
        //             liveEmbed(liveMatch,responseData)
        //             // upcomingEmbed(responseData)
        //         })
        //     } else { // live match found
        //         console.warn(`Live Matches Found`)
        //         console.log(responseData)
        //         getUpcomingMatch().then(responseData => {
        //             // console.log(responseData)
        //             liveEmbed(liveMatch,responseData)
        //             // upcomingEmbed(responseData)
        //         })
        //     }
        // }).catch(err => {
        //     console.warn(err+`\nUnable to get live scores\nRetrying in ${updateInterval/1000} second(s)`)
        //     setTimeout(function(){
        //         updateWebhook()
        //     },updateInterval)
        // })
}

function liveEmbed(liveData,upcomingData,pastData){
    // let liveMatch = liveData
    // console.log(`liveData:`,liveMatch)
    if(liveData.length!=0){
        let data = liveData
        console.log(data)
        for (let i = 0; i < data.length; i++){
            let IdCompetition = data[i].IdCompetition
            let IdSeason = data[i].IdSeason
            let IdStage = data[i].IdStage
            let IdMatch = data[i].IdMatch
            getFifaLiveEvent(IdCompetition,IdSeason,IdStage,IdMatch).then(responseData => {
                console.warn(responseData)
                let eventData = responseData
                let comment
                if (eventData.length==0){ // if no event / match not started
                    let commentRNG = Math.floor((Math.random() * 2) + 1);
                    if (commentRNG==1){
                        comment = `...`
                    } else if(commentRNG==2){
                        let refRNG = Math.floor((Math.random() * data[i].Officials.length-1) + 0)
                        comment = `Today's match ${data[i].Officials[refRNG].TypeLocalized[0].Description} is ${data[i].Officials[refRNG].Name[0].Description}`
                    }
                } else { // if there's event / match started
                    if (eventData[eventData.length-1].EventDescription.length!=0){
                        comment = eventData[eventData.length-1].EventDescription[0].Description
                    } else if (eventData[eventData.length-1].TypeLocalized.length!=0){
                        comment = `${eventData[eventData.length-1].TypeLocalized[0].Description}...`
                    } else {
                        comment = `...`
                    }
                }

                console.log(data[i])
                let homeName
                let awayName
                if (data[i].Home!=null){
                    homeName = data[i].Home.TeamName[0].Description
                } else if (data[i].Home==null){
                    homeName = data[i].PlaceHolderA
                }
                if (data[i].Away!=null){
                    awayName = data[i].Away.TeamName[0].Description
                } else if (data[i].Away==null){
                    awayName = data[i].PlaceHolderB
                }
                let matchScore = `${data[i].Home.Score} - ${data[i].Away.Score}`
                let matchPenaltyScore = `${data[i].HomeTeamPenaltyScore} - ${data[i].AwayTeamPenaltyScore}`
                let matchLocation = data[i].Stadium.Name[0].Description
                let stageName = data[i].StageName[0].Description
                let matchTime = data[i].MatchTime
                // console.log(matchTime)
                let matchDates = new Date(`${data[i].Date}`)
                
                let currentTime = new Date().getTime() / 1000
                let embedData = JSON.parse(`{
                    "title": "Live Matches",
                    "url": "https://www.fifa.com/fifaplus/en/match-centre/match/${data[i].IdCompetition}/${data[i].IdSeason}/${data[i].IdStage}/${data[i].IdMatch}",
                    "description": "Synced: <t:${Math.round(currentTime)}:R>\`\`\`${stageName}\`\`\`\`${matchLocation}\`\\n<t:${Math.round(matchDates.getTime()/1000)}:R>",
                    "color": 16646220,
                    "fields": [
                    {
                        "name": "Time",
                        "value": "\`${matchTime}\`",
                        "inline": true
                    },
                    {
                        "name": "${homeName} Vs. ${awayName}",
                        "value": "\`${matchScore}\`\\nPenalty\\n\`${matchPenaltyScore}\`",
                        "inline": true
                    },
                    {
                        "name": "Match Event",
                        "value": "🎙: \`${comment}\`",
                        "inline": false
                    }
                    ],
                    "author": {
                    "name": "FIFA World Cup"
                    },
                    "thumbnail": {
                    "url": "https://digitalhub.fifa.com/transform/3a170b69-b0b5-4d0c-bca0-85880a60ea1a/World-Cup-logo-landscape-on-dark?io=transform:fill&quality=75"
                    }
                }`)
                embedAll.push(embedData)
                if (upcomingData.length>=2){
                    upcomingData.length = 2
                }
            })
            
            // getLiveCommentary(matchCommentaryID).then(responseData => {
            //     // console.log(responseData)
            //     if (responseData.response[0].data.commentary.length!=0){
            //         let commentText = responseData.response[0].data.commentary[0].text
            //         embedData.fields[2].value = `:microphone2:: ${commentText}`
            //         // console.log(commentText)
            //         if (matchStatus==`FINISHED`){
            //             embedData.description = ``
            //             embedData.title = `Match Finished`
            //             embedData.color = `7368816`
            //         }
            //         console.log(embedAll)
            //     }
            // }).catch(err => {
            //     console.error(err)
            // })
        }
    } else if (liveData.length==0){
        let data = pastData
        data.reverse()
        console.log(`Past Match:`,data)
        for (let i = 0; i < data.length; i++){
            // console.log(data[i])
            let homeName
            let awayName
            if (data[i].Home!=null){
                homeName = data[i].Home.TeamName[0].Description
            } else if (data[i].Home==null){
                homeName = data[i].PlaceHolderA
            }
            if (data[i].Away!=null){
                awayName = data[i].Away.TeamName[0].Description
            } else if (data[i].Away==null){
                awayName = data[i].PlaceHolderB
            }
            let matchScore = `${data[i].Home.Score} - ${data[i].Away.Score}`
            let matchPenaltyScore = `${data[i].HomeTeamPenaltyScore} - ${data[i].AwayTeamPenaltyScore}`
            let matchLocation = data[i].Stadium.Name[0].Description
            let stageName = data[i].StageName[0].Description
            let matchTime = data[i].MatchTime
            // console.log(matchTime)
            let matchWinner
            if (data[i].Home.IdTeam==data[i].Winner){
                matchWinner = `https://api.fifa.com/api/v3/picture/flags-sq-4/${data[i].Home.Abbreviation}`
            } else if(data[i].Away.IdTeam==data[i].Winner){
                matchWinner = `https://api.fifa.com/api/v3/picture/flags-sq-4/${data[i].Away.Abbreviation}`
            } else {
                matchWinner = `https://digitalhub.fifa.com/transform/3a170b69-b0b5-4d0c-bca0-85880a60ea1a/World-Cup-logo-landscape-on-dark?io=transform:fill&quality=75`
            }
            let matchDates = new Date(`${data[i].Date}`)

            
            let embedData = JSON.parse(`{
                "title": "Past Matches",
                "url": "https://www.fifa.com/fifaplus/en/match-centre/match/${data[i].IdCompetition}/${data[i].IdSeason}/${data[i].IdStage}/${data[i].IdMatch}",
                "description": "\`\`\`${stageName}\`\`\`\`${matchLocation}\`\\n<t:${Math.round(matchDates.getTime()/1000)}:R>",
                "color": 8947848,
                "fields": [
                {
                    "name": "${homeName} Vs. ${awayName}",
                    "value": "\`${matchScore}\`",
                    "inline": true
                },
                {
                    "name": "Penalty",
                    "value": "\`${matchPenaltyScore}\`",
                    "inline": true
                }
                ],
                "author": {
                "name": "FIFA World Cup"
                },
                "thumbnail": {
                "url": "${matchWinner}"
                }
            }`)
            embedAll.push(embedData)
        }
    }
    
    console.log(`All embed:`,embedAll)
    setTimeout(function(){
        upcomingEmbed(upcomingData)
    },2000)
}
function upcomingEmbed(Data){
    console.warn(Data)
    if (Data.length!=0){
    counter = counter+1
    let upcomingMatch = Data
    let currentTime = new Date().getTime() / 1000
    
    for(i = 0; i < Data.length; i++){
        let matchDates = new Date(`${upcomingMatch[i].Date}`)     
        let matchLocation = upcomingMatch[i].Stadium.Name[0].Description
        let matchRound = upcomingMatch[i].StageName[0].Description
        let matchHome
        let matchAway
        if (upcomingMatch[i].Home!=null){
            matchHome = upcomingMatch[i].Home.TeamName[0].Description
        } else if (upcomingMatch[i].Home==null){
            matchHome = upcomingMatch[i].PlaceHolderA
        }
        if (upcomingMatch[i].Away!=null){
            matchAway = upcomingMatch[i].Away.TeamName[0].Description
        } else if (upcomingMatch[i].Away==null){
            matchAway = upcomingMatch[i].PlaceHolderB
        }

        let field = JSON.parse(`{
            "name": "${matchHome} Vs. ${matchAway}",
            "value": "\`\`\`${matchRound}\`\`\`\`${matchLocation}\`\\n<t:${Math.round(matchDates.getTime()/1000)}:F>[<t:${Math.round(matchDates.getTime()/1000)}:R>]\\n[More info...](https://www.fifa.com/fifaplus/en/match-centre/match/${upcomingMatch[i].IdCompetition}/${upcomingMatch[i].IdSeason}/${upcomingMatch[i].IdStage}/${upcomingMatch[i].IdMatch} 'Open match info in browser')",
            "inline": true
        }`)
        // console.log(field)
        fieldsAll.push(field)
    }
    addUpcomingEmbed()
    function addUpcomingEmbed(){
        let upcomingEmbed = JSON.parse(`{
            "title": "Upcoming Matches",
            "url": "https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/qatar2022/scores-fixtures",
            "description": "\\nSynced: <t:${Math.round(currentTime)}:R>",
            "color": 16692992,
            "fields": ${JSON.stringify(fieldsAll)},
            "author": {
                "name": "FIFA World Cup"
            },
            "footer": {
                "text": "v.2 | # of sync: ${counter}x"
            },
            "thumbnail": {
                "url": "https://digitalhub.fifa.com/transform/3a170b69-b0b5-4d0c-bca0-85880a60ea1a/World-Cup-logo-landscape-on-dark?io=transform:fill&quality=75"
            }
        }`)
        console.debug(`Upcoming match:\n`,upcomingMatch)
        embedAll.push(upcomingEmbed)
        sendWebhook()
    }
    } else if (Data.length==0){
        sendWebhook()
    }
}
function sendWebhook(){
    // console.warn(prevEmbed)
    if (saveData[0].Settings.prevPost==""){
        POST(true,embedAll).then(responseData => {
            console.debug(`🔰 Webhook posted\n`,`response:\n`,responseData)
            saveData[0].Settings.prevPost = responseData.response[0].id
            embedAll.length = 0
            fieldsAll.length = 0
        }).catch(err => {
            console.error(err)
        })
    } else if (saveData[0].Settings.prevPost!=""){
        PATCH(saveData[0].Settings.prevPost,embedAll).then(responseData => {
            console.debug(`Webhook response:\n`,responseData,`\nWebhook updated 👍`)
            saveData[0].Settings.prevPost = responseData.response[0].id
            embedAll.length = 0
            fieldsAll.length = 0
        }).catch(err => {
            console.error(err)
        })
    }
    localStorage.setItem("balbalan_save",JSON.stringify(saveData))
    setTimeout(updateWebhook,updateInterval)
}