// updateUpcoming()
updater()
function updater(){
    getFifaCalendar().then(responseData => {
        
        for (let i = 0; i < responseData.length; i++){
            let data = responseData[i]
            if (data.MatchStatus==1){
                removeUpcoming().then(responseData => {
                    console.log(responseData)
                    createElement(data,data.MatchStatus).then(responseData => {
                        console.log(responseData)
                    })
                })
            } else if (data.MatchStatus==3||data.MatchStatus==12){
                console.log(`Live Match:`,data)
                getFifaLive(data.IdCompetition,data.IdSeason,data.IdStage,data.IdMatch).then(responseData => {
                    let liveData = responseData
                    console.log(responseData)
                    removeLive().then(responseData => {
                        console.log(responseData)
                        createElement(data,data.MatchStatus,liveData.MatchTime).then(responseData => {
                            console.log(responseData)
                        })
                    })
                })
                
            }
        }
        setTimeout(function(){
            updater()
        },updateInterval)
    }).catch(err => {
        console.log(err,`\nRetrying...`)
        setTimeout(function(){
            updater()
        },updateInterval)
    })
}


// updateUpcoming()
function updateUpcoming(){
    removeUpcoming().then(responseData => {
        // console.log(responseData)
        getUpcomingMatch().then(responseData => {
            // console.log(responseData)
            let upcomingMatch = responseData
            for (i = 0; i < upcomingMatch.length; i++){
                createElement(upcomingMatch[i]).then(responseData => {
                    console.log(responseData)
                })
            }
            setTimeout(updateUpcoming,siteUpcomingInterval)
        }).catch(err => {
            console.warn(err+`\nUnable to get upcoming matches\nRetrying in ${updateInterval/1000} second(s)`)
            setTimeout(function(){
                updateUpcoming()
            },updateInterval)
        })
    })
}
// updateLive()
function updateLive(){
    removeLive().then(responseData => {
        // console.log(responseData)
        getLiveScore().then(responseData => {
            if (responseData.length==0){
                console.warn(`No live match found\nRetrying in ${siteLiveInterval/1000}s`)
                setTimeout(updateLive,siteLiveInterval)
            } else {
                // console.log(responseData)
                let liveMatch = responseData
                for (i = 0; i < liveMatch.length; i++){
                    createLive(liveMatch[i]).then(responseData => {
                        console.log(responseData)
                    })
                }
                setTimeout(updateLive,siteLiveInterval)
            }
        }).catch(err => {
            console.warn(err+`\nUnable to get live matches\nRetrying in ${updateInterval/1000} second(s)`)
            setTimeout(function(){
                
            },updateInterval)
        })
    })
}
