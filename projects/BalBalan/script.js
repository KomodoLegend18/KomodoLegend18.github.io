// // start function
// // Update() 
// function Update(){
//     getLiveScore().then(responseData => {
//         let liveMatch = responseData.response[0].data.match
//         if (liveMatch.length==0){ // if no match found
//             console.log(`There's currently no live matches`)
//             getUpcomingMatch().then(responseData => {
//                 console.log(responseData)
//                 counter = counter+1
//                 let upcomingMatch = responseData
//                 let epochTime = new Date().getTime() / 1000

//                 let firstMatch = upcomingMatch[0]
//                 let firstMatchDate = new Date(`${firstMatch.date},${firstMatch.time}`)
//                 firstMatchDate.setHours(firstMatchDate.getHours()+timeOffset)
//                 let firstMatchLocation = firstMatch.location
//                 let firstMatchRound = firstMatch.round
                
//                 let secondMatch = upcomingMatch[1]
//                 let secondMatchDate = new Date(`${secondMatch.date},${secondMatch.time}`)
//                 secondMatchDate.setHours(secondMatchDate.getHours()+timeOffset)
//                 let secondMatchLocation = secondMatch.location
//                 let secondMatchRound = secondMatch.round

//                 for (let i = 0; i < upcomingMatch.length; i++){
//                     let Match = upcomingMatch[i]

//                     let MatchID = Match.id

                    

//                     let homeName = Match.home_name
//                     let home_id = Match.home_id
//                     let awayName = Match.away_name
//                     let away_id = Match.away_id
//                     let MatchLocation = Match.location
//                     let MatchRound = Match.round
                    
//                     const upcomingMatchElement = document.createElement(`div`);
//                     upcomingMatchElement.style = `background-color: gray; width: 100%; height: 35%; overflow: hidden; margin-bottom: 10px;`
//                     let upcomingElement = `
//                     <div id="home_team" style="background-color: rgb(193, 208, 255); width: 33.33%; float: left; display: block;overflow: hidden;">
//                     <div id="home_name" style="width: 100%; text-align: center;">
//                         <h1>${homeName}</h1>
//                     </div>
//                     <div style="background-color: rgba(255, 166, 0, 0); text-align: center; height: 100%;">
//                         <img style="width: 75%; object-fit: contain;" src="https://livescore-api.com/api-client/countries/flag.json?team_id=${home_id}&key=demo_key&secret=demo_secret" alt="Home Team" srcset="">
//                     </div>
//                     </div>
//                     <div id="match_info" style="background-color: rgb(226, 226, 226); width: 33.33%; height: 100%; float: left; display: flex;flex-direction:column;">
//                         <div style="width: 100%; text-align: center;flex:0.3;">
//                             <h4>${MatchID}</h4>
//                         </div>
//                         <div style="height: 100%; background-color: rgba(255, 166, 0, 0);flex:1; text-align: center;">
//                             <div>
//                                 <h2>${MatchDate_Formated} (GMT+8)</h2>
//                             </div>
//                         </div>
//                     </div>
//                     <div id="away_team" style="background-color: rgb(255, 215, 142); width: 33.33%; float: left; display: block;overflow: hidden;">
//                         <div id="away_name" style="width: 100%; text-align: center;">
//                             <h1>${awayName}</h1>
//                         </div>
//                         <div style="background-color: rgba(255, 166, 0, 0); text-align: center; height: 100%;">
//                             <img style="width: 75%; object-fit: contain;" src="https://livescore-api.com/api-client/countries/flag.json?team_id=${away_id}&key=demo_key&secret=demo_secret" alt="Away Team" srcset="">
//                         </div>
//                     </div>
//                     `
//                     upcomingMatchElement.innerHTML = upcomingElement
//                     if (upcomingMatch[0].id!=prevUpcoming&&prevUpcoming==``){
//                         // console.log(MatchID)
//                         console.log(`${upcomingMatch[0].id}\n${prevUpcoming}`)
//                         console.log(`created upcoming element`)
//                         document.querySelector("body > div.upcoming").appendChild(upcomingMatchElement);
//                     } else if (upcomingMatch[0].id!=prevUpcoming&&prevUpcoming!=``){
//                         console.log(prevUpcoming)
//                         console.log(`update upcoming element`)
//                         document.querySelector("body > div.upcoming").children[i].remove()
//                         // upcomingMatchElement.innerHTML = ``
//                         document.querySelector("body > div.upcoming").appendChild(upcomingMatchElement)
                        
//                     }
//                     // else {
//                     //     console.log(`removed upcoming element`)
//                     //     document.querySelector("body > div.live").children[i].remove()
//                     // }
//                 } 
                


//                 let upcomingEmbed = JSON.parse(`{
//                     "title": "Upcoming Matches",
//                     "description": "\\nSynced: <t:${Math.round(epochTime)}:R>",
//                     "color": 16692992,
//                     "fields": [
//                         {
//                         "name": "${firstMatch.home_name} Vs. ${firstMatch.away_name}",
//                         "value": "<t:${Math.round(firstMatchDate.getTime()/1000)}:F>[<t:${Math.round(firstMatchDate.getTime()/1000)}:R>]\`\`\`Round: ${firstMatchRound}\\nLocation: ${firstMatchLocation}\`\`\`",
//                         "inline": true
//                         },
//                         {
//                         "name": "${secondMatch.home_name} Vs. ${secondMatch.away_name}",
//                         "value": "<t:${Math.round(secondMatchDate.getTime()/1000)}:F>[<t:${Math.round(secondMatchDate.getTime()/1000)}:R>]\`\`\`Round: ${secondMatchRound}\\nLocation: ${secondMatchLocation}\`\`\`",
//                         "inline": true
//                         }
//                     ],
//                     "author": {
//                         "name": "FIFA World Cup"
//                     },
//                     "footer": {
//                         "text": "# of sync: ${counter}x | time offset: +${timeOffset}"
//                     },
//                     "thumbnail": {
//                         "url": "https://digitalhub.fifa.com/transform/3a170b69-b0b5-4d0c-bca0-85880a60ea1a/World-Cup-logo-landscape-on-dark?io=transform:fill&quality=75"
//                     }
//                     }`)
//                 console.log(upcomingMatch)
//                 embedAll.push(upcomingEmbed)
//                 sendEmbed()
//             }).catch(err => {
//                 console.error(err)
//             })
//         } else { // if match found
//             for (i = 0; i < liveMatch.length; i++){ // iterate all live matches
//                 let homeName = liveMatch[i].home_name
//                 let homeID = liveMatch[i].home_id
//                 let awayName = liveMatch[i].away_name
//                 let awayID = liveMatch[i].away_id
//                 let scoreData = liveMatch[i].score
//                 let timeData = liveMatch[i].time
//                 let locationData = liveMatch[i].location
//                 let scheduleStart = liveMatch[i].scheduled 
//                 let matchStatus = liveMatch[i].status
//                 let matchEvents = liveMatch[i].events
//                 let matchCommentaryID = new URLSearchParams(matchEvents).get(`id`)


//                 const liveMatchElement = document.createElement(`div`);
//                 liveMatchElement.style = `background-color: gray; width: 100%; height: 35%; overflow: hidden; margin-bottom: 10px;`
//                 let liveElement = `
//                 <div id="home_team" style="background-color: rgb(193, 208, 255); width: 33.33%; float: left; display: block;overflow: hidden;">
//                 <div id="home_name" style="width: 100%; text-align: center;">
//                     <h1>${homeName}</h1>
//                 </div>
//                 <div style="background-color: rgba(255, 166, 0, 0); text-align: center; height: 100%;">
//                     <img style="width: 75%; object-fit: contain;" src="https://livescore-api.com/api-client/countries/flag.json?team_id=${homeID}&key=demo_key&secret=demo_secret" alt="Home Team" srcset="">
//                 </div>
//                 </div>
//                 <div id="match_info" style="background-color: rgb(226, 226, 226); width: 33.33%; height: 100%; float: left; display: flex;flex-direction:column;">
//                 <div style="width: 100%; text-align: center;flex:0.3;">
//                     <h4>${timeData}</h4>
//                 </div>
//                 <div style="height: 100%; background-color: rgba(255, 166, 0, 0);flex:1; text-align: center;">
//                     <div>
//                         <h2>${scoreData}</h2>
//                     </div>
//                 </div>
//                 </div>
//                 <div id="away_team" style="background-color: rgb(255, 215, 142); width: 33.33%; float: left; display: block;overflow: hidden;">
//                 <div id="away_name" style="width: 100%; text-align: center;">
//                     <h1>${awayName}</h1>
//                 </div>
//                 <div style="background-color: rgba(255, 166, 0, 0); text-align: center; height: 100%;">
//                     <img style="width: 75%; object-fit: contain;" src="https://livescore-api.com/api-client/countries/flag.json?team_id=${awayID}&key=demo_key&secret=demo_secret" alt="Away Team" srcset="">
//                 </div>
//                 </div>
//                 `
//                 liveMatchElement.innerHTML = liveElement

//                 if (document.querySelector("body > div.live").children.length!=liveMatch.length){
//                     console.log(`created live element`)
//                     document.querySelector("body > div.live").appendChild(liveMatchElement);
//                 } else if (document.querySelector("body > div.live").children.length==liveMatch.length){
//                     console.log(`update live element`)
//                     document.querySelector("body > div.live").children[i] = liveElement
//                 } else {
//                     console.log(`removed live element`)
//                     document.querySelector("body > div.live").children[i].remove()
//                 }
                
                
                

//                 // if (matchStatus==`FINISHED`){
//                 //     console.log(finishedField)
//                 //     let pushedFields = {
//                 //         "name": `${homeName} Vs. ${awayName}`,
//                 //         "value": `${scoreData}`
//                 //     }
//                 //     finishedField.push(pushedFields)
//                 //     console.log(finishedField)
//                 //     let finishedEmbed = JSON.parse(`{
//                 //         "title": "Finished Matches",
//                 //         "color": 7368816,
//                 //         "fields": ${finishedField[i]},
//                 //         "author": {
//                 //             "name": "FIFA World Cup"
//                 //         },
//                 //         "thumbnail": {
//                 //             "url": "https://digitalhub.fifa.com/transform/3a170b69-b0b5-4d0c-bca0-85880a60ea1a/World-Cup-logo-landscape-on-dark?io=transform:fill&quality=75"
//                 //         }
//                 //     }`)
//                 //     embedAll.push(finishedEmbed)
//                 // }
                

//                 let epochTime = new Date().getTime() / 1000
//                 let embedData = JSON.parse(`{
//                     "title": "Live Matches",
//                     "description": "\`\`\`Location: ${locationData}\\nMatch Start: ${scheduleStart}\\n\\nMatch Status: ${matchStatus}\`\`\`Synced: <t:${Math.round(epochTime)}:R>",
//                     "color": 16646220,
//                     "fields": [
//                       {
//                         "name": "Time",
//                         "value": "${timeData}",
//                         "inline": true
//                       },
//                       {
//                         "name": "${homeName} Vs. ${awayName}",
//                         "value": "${scoreData}",
//                         "inline": true
//                       },
//                       {
//                         "name": "Commentary",
//                         "value": "Loading...",
//                         "inline": false
//                       }
//                     ],
//                     "author": {
//                       "name": "FIFA World Cup"
//                     },
//                     "thumbnail": {
//                       "url": "https://digitalhub.fifa.com/transform/3a170b69-b0b5-4d0c-bca0-85880a60ea1a/World-Cup-logo-landscape-on-dark?io=transform:fill&quality=75"
//                     }
//                 }`)
                
//                 getLiveCommentary(matchCommentaryID).then(responseData => {
//                     // console.log(responseData)
//                     if (responseData.response[0].data.commentary.length!=0){
//                         let commentText = responseData.response[0].data.commentary[0].text
//                         embedData.fields[2].value = `:microphone2:: ${commentText}`
//                         // console.log(commentText)
//                         if (matchStatus==`FINISHED`){
//                             embedData.description = ``
//                             embedData.title = `Finished Matches`
//                             embedData.color = `7368816`
//                             embedAll.push(embedData)
//                         }
//                     }                    
//                 }).catch(err => {
//                     console.error(err)
//                 })
//                 // embedAll.push(embedData)
                
                
//                 console.log(liveMatch[i])
//                 // console.log(`${i}\n${liveMatch.length}`)
//                 if (i == liveMatch.length-1){ // if done iterating
//                     setTimeout(function(){
//                         getUpcomingMatch().then(responseData => {
//                             counter = counter+1
//                             let timeOffset = 8
//                             let upcomingMatch = responseData.response[0].data.fixtures
        
//                             let firstMatch = upcomingMatch[0]
//                             let firstMatchDate = new Date(`${firstMatch.date},${firstMatch.time}`)
//                             firstMatchDate.setHours(firstMatchDate.getHours()+timeOffset)
//                             let firstMatchLocation = firstMatch.location
//                             let firstMatchRound = firstMatch.round
                            
//                             let secondMatch = upcomingMatch[1]
//                             let secondMatchDate = new Date(`${secondMatch.date},${secondMatch.time}`)
//                             secondMatchDate.setHours(secondMatchDate.getHours()+timeOffset)
//                             let secondMatchLocation = secondMatch.location
//                             let secondMatchRound = secondMatch.round

//                             for (let i = 0; i < upcomingMatch.length; i++){
//                                 let Match = upcomingMatch[i]

//                                 let MatchID = Match.id

//                                 let MatchDate = new Date(`${Match.date},${Match.time}`)
//                                 MatchDate.setHours(MatchDate.getHours()+timeOffset)
//                                 let MatchDate_Formated = `${MatchDate.getDate()} ${monthName[MatchDate.getMonth()]} ${MatchDate.getFullYear()} \n${MatchDate.getHours()}:${(MatchDate.getMinutes()<10?'0':'') + MatchDate.getMinutes()}`

//                                 let homeName = Match.home_name
//                                 let home_id = Match.home_id
//                                 let awayName = Match.away_name
//                                 let away_id = Match.away_id
//                                 let MatchLocation = Match.location
//                                 let MatchRound = Match.round
                                
//                                 const upcomingMatchElement = document.createElement(`div`);
//                                 upcomingMatchElement.style = `background-color: gray; width: 100%; height: 35%; overflow: hidden; margin-bottom: 10px;`
//                                 let upcomingElement = `
//                                 <div id="home_team" style="background-color: rgb(193, 208, 255); width: 33.33%; float: left; display: block;overflow: hidden;">
//                                 <div id="home_name" style="width: 100%; text-align: center;">
//                                     <h1>${homeName}</h1>
//                                 </div>
//                                 <div style="background-color: rgba(255, 166, 0, 0); text-align: center; height: 100%;">
//                                     <img style="width: 75%; object-fit: contain;" src="https://livescore-api.com/api-client/countries/flag.json?team_id=${home_id}&key=demo_key&secret=demo_secret" alt="Home Team" srcset="">
//                                 </div>
//                                 </div>
//                                 <div id="match_info" style="background-color: rgb(226, 226, 226); width: 33.33%; height: 100%; float: left; display: flex;flex-direction:column;">
//                                     <div style="width: 100%; text-align: center;flex:0.3;">
//                                         <h4>${MatchID}</h4>
//                                     </div>
//                                     <div style="height: 100%; background-color: rgba(255, 166, 0, 0);flex:1; text-align: center;">
//                                         <div>
//                                             <h2>${MatchDate_Formated} (GMT+8)</h2>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div id="away_team" style="background-color: rgb(255, 215, 142); width: 33.33%; float: left; display: block;overflow: hidden;">
//                                     <div id="away_name" style="width: 100%; text-align: center;">
//                                         <h1>${awayName}</h1>
//                                     </div>
//                                     <div style="background-color: rgba(255, 166, 0, 0); text-align: center; height: 100%;">
//                                         <img style="width: 75%; object-fit: contain;" src="https://livescore-api.com/api-client/countries/flag.json?team_id=${away_id}&key=demo_key&secret=demo_secret" alt="Away Team" srcset="">
//                                     </div>
//                                 </div>
//                                 `
//                                 upcomingMatchElement.innerHTML = upcomingElement
//                                 if (upcomingMatch[0].id!=prevUpcoming){
//                                     // console.log(MatchID)
//                                     console.log(`${upcomingMatch[0].id}\n${prevUpcoming}`)
//                                     console.log(`created upcoming element`)
//                                     document.querySelector("body > div.upcoming").innerHTML = upcomingMatchElement
//                                 } else if (upcomingMatch[0].id==prevUpcoming){
//                                     console.log(`update upcoming element`)
//                                     upcomingMatchElement.children[i].innerHTML = upcomingElement
//                                 } else {
//                                     console.log(`removed upcoming element`)
//                                     document.querySelector("body > div.live").children[i].remove()
//                                 }
//                             } 
        
//                             let upcomingEmbed = JSON.parse(`{
//                                 "title": "Upcoming Matches",
//                                 "description": "\\nSynced: <t:${Math.round(epochTime)}:R>",
//                                 "color": 16692992,
//                                 "fields": [
//                                   {
//                                     "name": "${firstMatch.home_name} Vs. ${firstMatch.away_name}",
//                                     "value": "<t:${Math.round(firstMatchDate.getTime()/1000)}:F>[<t:${Math.round(firstMatchDate.getTime()/1000)}:R>]\`\`\`Round: ${firstMatchRound}\\nLocation: ${firstMatchLocation}\`\`\`",
//                                     "inline": true
//                                   },
//                                   {
//                                     "name": "${secondMatch.home_name} Vs. ${secondMatch.away_name}",
//                                     "value": "<t:${Math.round(secondMatchDate.getTime()/1000)}:F>[<t:${Math.round(secondMatchDate.getTime()/1000)}:R>]\`\`\`Round: ${secondMatchRound}\\nLocation: ${secondMatchLocation}\`\`\`",
//                                     "inline": true
//                                   }
//                                 ],
//                                 "author": {
//                                   "name": "FIFA World Cup"
//                                 },
//                                 "footer": {
//                                     "text": "# of sync: ${counter}x | time offset: +${timeOffset}"
//                                 },
//                                 "thumbnail": {
//                                   "url": "https://digitalhub.fifa.com/transform/3a170b69-b0b5-4d0c-bca0-85880a60ea1a/World-Cup-logo-landscape-on-dark?io=transform:fill&quality=75"
//                                 }
//                               }`)
//                             // console.log(upcomingMatch)
//                             embedAll.push(upcomingEmbed)
                            
//                             sendEmbed()
//                         }).catch(err => {
//                             console.error(err)
//                         })
//                     },2000)
//                     // setTimeout(sendEmbed,1000)
//                     // console.log(embedAll)
//                 }
//             }
//         }
//         // console.log(liveMatch)
//     }).catch(err => {
//         setTimeout(Update,5000)
//         console.err(err+`\nRetrying...`)
//     })
//     function sendEmbed(){
//         prevUpcoming = document.querySelector("body > div.upcoming").children[0].children[1].children[0].children[0].innerText
//         if (prevEmbed==null){ // if theres no webhook message found
//             console.log(embedAll)
//             POST(true,embedAll).then(responseData => {
//                 console.log(responseData)
//                 console.warn(`Data Posted`)
//                 prevEmbed = responseData.response[0].id
//                 embedAll.length = 0
//             }).catch(err => {
//                 console.error(err)
//             })
//         } else if (prevEmbed!=null){ // if theres webhook message found
//             PATCH(prevEmbed,embedAll).then(responseData => {
//                 console.log(responseData)
//                 console.warn(`Data Updated`)
//                 prevEmbed = responseData.response[0].id
//                 embedAll.length = 0
//             }).catch(err => {
//                 console.error(err)
//             })
//         }
//         setTimeout(Update,updateInterval) // start again from the top / loop
//     }
// }
loadSave()
function loadSave(){
    if(saveData==null){ // if no save data found
        // Load item
        let profileData = JSON.parse(`[
            {
                "Username":"",
                "Avatar":"",
                "Points":"10000",
                "Settings":{
                    "webhookURL":"",
                    "prevPost":"",
                    "timeOffset":8
                }
            }
        ]`)
        localStorage.setItem("balbalan_save",JSON.stringify(profileData)) // Save into Cache
        saveData = JSON.parse(localStorage.getItem("balbalan_save"))
        console.log("No save data found!\nCreating new save data...\n",saveData)
    }else if (saveData!=null){ // if save data found
        // localStorage.removeItem("dicey2_profileData")
        console.log(`Save data existed\n`,saveData)
        // console.table(saveData)
    }
}
function DeleteSave(){
    localStorage.removeItem("balbalan_save")
    location.reload()
}

function config(){
    // saveData[0].Settings.timeOffset = prompt(`Time Offset`,saveData[0].Settings.timeOffset)
    saveData[0].Settings.webhookURL = prompt(`Webhook URL`,saveData[0].Settings.webhookURL)
    localStorage.setItem("balbalan_save",JSON.stringify(saveData))
    location.reload()
}