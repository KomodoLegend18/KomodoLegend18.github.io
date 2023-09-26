const player = document.querySelector("video")
const netStatus =  document.querySelector("#netStat")
const play_button = document.querySelector("#play-container > span")
const progress_current = document.querySelector("#progress-container > div > p:nth-child(1)")
const progress_status = document.querySelector("#progress-container > div > p:nth-child(2)")
const progress_duration = document.querySelector("#progress-container > div > p:nth-child(3)")
const progress_input = document.querySelector("#progress-container > input")
const progress_bar = document.querySelector("#progress-container > progress")
const mute_button = document.querySelector("#volume-container > span")
const volume_input = document.querySelector("#volume-container > input")
const setting_button = document.querySelector("#controls-container > span:nth-child(1)")
const sync_button = document.querySelector("#controls-container > span:nth-child(2)")
const skip_button = document.querySelector("#controls-container > span:nth-child(3)")
const fullscreen_button = document.querySelector("#fullscreen-container > span")
const buffer_overlay = document.querySelector("#contentEntries > div:nth-child(1) > div:nth-child(2)")

const poster = "https://cdn.discordapp.com/attachments/636600433799856128/1151476930005180446/9B.png"

let posted = false
let postid
const webhookurl = "https://discord.com/api/webhooks/835374841455443968/IHdR8hm8AES_l15uwQBIAjnZHmHafkDqXUpr7LX3RSEPcMY5LfpOMcZ0HmT9n25al6GF"
const embedtest = [
    {
      "title": "body title",
      "description": `body desc`,
      "url": "https://www.google.com",
      "color": 13311,
      "fields": [
        {
          "name": "lastupdate",
          "value": "timestamp"
        },
        {
            "name": "vidurl",
            "value": "url"
        },
        {
            "name": "vidcurrtime",
            "value": "0"
        }
      ],
      "author": {
        "name": "author",
        "url": "https://www.google.com",
        "icon_url": "https://discord.com/assets/c09a43a372ba81e3018c3151d4ed4773.png"
      },
      "footer": {
        "text": "footer",
        "icon_url": "https://www.google.com"
      },
      "timestamp": "2023-09-26T13:12:00.000Z",
      "image": {
        "url": "https://www.google.com"
      },
      "thumbnail": {
        "url": "https://www.google.com"
      }
    }
  ]



watchPageLoad()
function watchPageLoad(){
    setInterval(checkInternet, 1000)
    play_button.addEventListener("click", function(e){
        togglePlay()
        if (player.readyState>=3){
            if (player.paused || player.ended) {
                player.play();

                // if not host
                if(urlParams.has("id")==true){
                    if (syncTime<player.duration){
                        sync()
                    }else{
                        player.currentTime = player.duration
                    }
                }
            } else {
                player.pause();
            }
        }
    })
    progress_input.addEventListener("input", function(e){
        // console.log(e.target.value);
        const seek = e.target.value
        player.currentTime = seek

        updateProgress()
        progress_bar.value = seek + 10
        progress_input.attributes[1].value = `${seek}`
    })
    mute_button.addEventListener("click",function(e){
        if (player.muted){
            mute_button.innerHTML = "volume_up"
            player.muted = false
        } else {
            mute_button.innerHTML = "volume_off"
            player.muted = true
        }
    })
    volume_input.addEventListener("input",function(e){
        const vol = e.target.value
        player.volume = vol
    })
    setting_button.addEventListener("click", function(e){
        const setting_menu = document.querySelector("#contentEntries > div:nth-child(1) > div:nth-child(1)")
        if (setting_menu.style["display"]=="block"){
            setting_menu.style["display"] = "none"
        } else {
            setting_menu.style["display"] = "block"
        }
    })
    sync_button.addEventListener("click", function(e){
        
    })
    skip_button.addEventListener("click", function(e){
        
    })
    fullscreen_button.addEventListener("click", function(e){
        const player_element = document.querySelector("#contentEntries > div:nth-child(1)")
        if (document.fullscreenElement) {
            document.exitFullscreen();
          } else if (document.webkitFullscreenElement) {
            // Need this to support Safari
            document.webkitExitFullscreen();
          } else if (player_element.webkitRequestFullscreen) {
            // Need this to support Safari
            player_element.webkitRequestFullscreen();
          } else {
            player_element.requestFullscreen();
          }
    })

    player.oncanplay = function(){
        // document.querySelector("#progress-container > progress").value = 0 
        // document.querySelector("#progress-container > input").attributes[1].value = `0`
        // document.querySelector("#contentEntries > div:nth-child(3) > button").attributes["data-length"].value = duration
        updateProgress()
        progress_status.innerHTML = `Can play data`
        buffer_overlay.style["display"] = "none"
        player.poster = ""

        console.log("oncanplay");
        // skipOP()
    }
    player.ontimeupdate = function() {
        // console.log(player.currentTime,player.duration);
        updateProgress()
    };

    // Try to load video
    player.onloadstart = function() {
        buffer_overlay.style["display"] = "grid"
        player.poster = poster
        progress_status.innerHTML = `Loading data`
        console.log("onloadstart");
    }
    // Downloading video
    player.onprogress = function() {
        buffer_overlay.style["display"] = "none"
        progress_status.innerHTML = `Downloading data`
        console.log("onprogress");
    }
    // Can't load video
    player.onerror = function() {
        buffer_overlay.style["display"] = "grid"
        player.poster = poster
        progress_status.innerHTML = `No Data`
        console.log("onerror");
    }
    player.onwaiting = function() {
        buffer_overlay.style["display"] = "grid"
        progress_status.innerHTML = `Waiting`
        console.log("onwaiting");
    }
    player.onloadeddata = function() {
        buffer_overlay.style["display"] = "none"
        progress_status.innerHTML = `Data ready`
        console.log("onloadeddata");
    }
    player.onplaying = function() {
        buffer_overlay.style["display"] = "none"
        progress_status.innerHTML = `Playing`

        // if host
        if(urlParams.has("id")==false){
            let embed = embedtest
            embed[0].title = `${player.title}`
            embed[0].url = `https://myanimelist.net/anime/${document.querySelector("#contentEntries > div:nth-child(3) > button").attributes["data-id"].value}`
            embed[0].description = `${progress_current.innerHTML} - ${progress_duration.innerHTML}`
            embed[0].fields[0].name = `Last updated:`
            embed[0].fields[0].value = `<t:${Math.round(new Date().getTime() / 1000)}:R>`
            embed[0].fields[1].name = `Video data`
            embed[0].fields[1].value = `\`\`\`${player.src}\`\`\``
            embed[0].fields[2].name = `Current time`
            embed[0].fields[2].value = `${player.currentTime}`


            console.log(embed);
            if(posted==false){
                discordWebhook("POST",webhookurl,true,embed).then(response => {
                    let resp = response.response[0]
                    postid = resp.id
                    console.log("discord Response",resp.id);
                    posted = true
                })
            } else {
                discordWebhook("PATCH",`${webhookurl}/messages/${postid}`,"true",embed).then(response => {
                    console.log(response);
                })
            }
        }
        console.log("onplaying");
    }
    player.onplay = function() {
        buffer_overlay.style["display"] = "none"
        progress_status.innerHTML = `Play`
        console.log("onplay");
        togglePlay()
    }
    player.onpause = function() {
        buffer_overlay.style["display"] = "none"
        progress_status.innerHTML = `Paused`
        console.log("onpause");
        togglePlay()
    }
    player.onended = function() {
        buffer_overlay.style["display"] = "grid"
        progress_status.innerHTML = `Data Ended`
        console.log("onended");
        togglePlay()
    }
}

function togglePlay(){
    if (player.paused){
        play_button.innerHTML = "play_arrow"
        // player.play()
    } else {
        play_button.innerHTML = "pause"
        // player.pause()
    }
}

function updateProgress(){
    try {
        // Update Player Progress
        // # Progress Bar
        progress_bar.value = player.currentTime
        progress_bar.max = player.duration + 20
        // # Progress Input
        progress_input.attributes[1].value = `${player.currentTime}`
        progress_input.value = player.currentTime
        progress_input.max = player.duration
        // # Progress Text
        progress_current.innerHTML = new Date(player.currentTime*1000).toISOString().substr(11, 8);
        progress_status.innerHTML = `${player.currentTime}/${player.duration}, Frame: ${Math.round(player.currentTime*24)}`
        progress_duration.innerHTML = new Date(player.duration*1000).toISOString().substr(11, 8);
    } catch (error) {
        console.groupCollapsed("[updateProgress]")
        console.error(error);
        console.groupEnd()
    }
}

function checkInternet(){
    // console.log(navigator.onLine);
    if (navigator.onLine){
        netStatus.style.display = "none"
    } else {
        netStatus.style.display = "block"
    }
}

searchInput.addEventListener("focus", function(e){
    // console.log("Dim count: ",document.querySelector("#fadeDim").childElementCount)
    // console.log(e)

    // Prevent multiple dim element
    if(document.querySelector("#fadeDim").childElementCount==0){
        // Create dim element for header and container
        const dimElem = document.createElement("div");
        dimElem.className="dim"
        document.getElementById("fadeDim").appendChild(dimElem);

        // Then look for all element with dim class
        const alldim = document.querySelectorAll(".dim")
            for (i=0;i<alldim.length;i++){
                // Then add eventlistener to those elements
                alldim[i].addEventListener("click", function(e){
                    for(i=0;i<alldim.length;i++){
                        alldim[i].remove()
                    }
                    clearSearch()
                })
            }
    }
    

    if(e.target.value.length>=3){
        document.getElementById("search-result-overlay").style="pointer-events: auto;"
    }
    
    // console.warn("dim applied")
    // console.log(query)
    function clearSearch(){ // Clear search results when executed    
        // document.querySelector("#header-section > input[type=text]").value=""
        const prevresult = document.getElementById("search-result-overlay")
        if(prevresult){
            // prevresult.innerHTML=""
            prevresult.style="pointer-events:none;display:none"
        }
    }
})


let search_timer
searchInput.addEventListener("input", function(e) {
    let query = e.target.value
    if (query.length>=3){ // If query is longer than/equal to 3 characters
        console.log("Search query: ",query.length,`"${query}"`)

        clearTimeout(search_timer);
        search_timer = setTimeout(() => {
            console.log("> Searching: ",query.length,`"${query}"`)
            clientGET(`https://kuramanime.pro/anime?order_by=popular&search=${query}&page=1`).then(response => {
                const html = new DOMParser().parseFromString(response, 'text/html');
                const htmlResult = html.querySelectorAll("#animeList > div")

                const result = document.getElementById("search-result-overlay");
                result.innerHTML = "";
                result.style.pointerEvents = "auto";

                for (let i = 0; i < htmlResult.length; i++) {
                    const url = htmlResult[i].querySelector("a").attributes["href"].value
                    const title = htmlResult[i].querySelector("div > div > h5 > a").innerHTML
                    const type = htmlResult[i].querySelector("div > div > ul > a > li").innerHTML
                    const quality = htmlResult[i].querySelector("div > div > ul > a:nth-child(2) > li").innerHTML
                    const poster = htmlResult[i].querySelector("div > a > div").attributes["data-setbg"].value

                    const items = document.createElement("div");
                    items.id = "items";
                    items.setAttribute("data-index", i);
                    items.innerHTML = `
                        <div id="poster" style="background-image: url(${poster});">
                        <div id="label">Watch</div>
                        </div>
                        <div id="info">
                            <div id="title">${title}</div>
                            <div id="genre">${quality}</div>
                            <div id="details">
                                <div id="type">${type}</div>
                            </div>
                            <div id="synopsis">${url}</div>
                        </div>
                    `;
                    result.appendChild(items);
                    
                    // Add a click event listener to each search result item
                    items.addEventListener("click", function (e) {
                        const sidebar = document.querySelector("#contentEntries > div:nth-child(2)")
                        sidebar.innerHTML = ""

                        const dataIndex = e.target.getAttribute("data-index");
                        if (!dataIndex) return; // Check if a valid data-index attribute exists
                        const selected = e.target.children[1].querySelector("#synopsis").innerHTML

                        getMalAPISearch(title).then(response => {
                            const animeID = response[0].node.id
                            document.querySelector("#contentEntries > div:nth-child(3) > button").attributes["data-id"].value = animeID
                            console.log(animeID);

                            player.title = title


                            clientGET(selected).then(response => {
                                const html = new DOMParser().parseFromString(response, 'text/html');
                                const episode = new DOMParser().parseFromString(html.querySelector("#episodeLists").attributes["data-content"].value,"text/html")
                                const episodeList = episode.querySelectorAll("a")
                                for (let i = 0; i < episodeList.length; i++) {
                                    const title = episodeList[i].innerHTML
                                    const url = episodeList[i].attributes["href"].value
                                    const epsCount = i+1
    
                                    const items = document.createElement("div");
                                    items.id = "items";
                                    items.setAttribute("data-index", i);
                                    items.innerHTML = `
                                        <div id="info" style="pointer-events:none;">
                                            <a href="${url}" target="_blank" id="title">${title}</a>
                                        </div>
                                    `;
                                    sidebar.appendChild(items);
                                    items.addEventListener("click", function (e){
                                        document.querySelector("#progress-container > progress").removeAttribute("value");
                                        document.querySelector("#progress-container > progress").removeAttribute("max");
                                        document.querySelector("#progress-container > input").attributes["value"].value = "0";
                                        document.querySelector("#progress-container > input").removeAttribute("max");

                                        document.querySelector("#contentEntries > div:nth-child(3) > button").attributes["data-eps"].value = epsCount
                                        // console.log(e);
                                        const epsUrl = e.target.querySelector("a").attributes["href"].value
                                        clientGET(`${epsUrl}?activate_stream=nOc7xTBoR5F0DC9Jhl5oix2oSfN8waFI`).then(response => {
                                            document.querySelector("#contentEntries > div:nth-child(3) > button").style = "display:none;"
                                            const html = new DOMParser().
                                            parseFromString(response, 'text/html');
                                            // console.log(html);
                                            const hiQ = html.querySelector("#player > source:nth-child(1)").attributes["src"].value
                                            const medQ = html.querySelector("#player > source:nth-child(2)").attributes["src"].value
                                            const lowQ = html.querySelector("#player > source:nth-child(3)").attributes["src"].value

                                            const regex = /https:\/\/(.+)\.my\.id\//;
                                            // const replacedUrl = lowQ.replace(regex, "https://komi.my.id/");
                                            // console.log(lowQ);
                                            document.querySelector("video").src = lowQ

                                            console.groupCollapsed("[Video URL]")
                                            console.log("Low",lowQ);
                                            console.log("Med",medQ);
                                            console.log("High",hiQ);
                                            console.groupEnd()
                                        })
                                        console.log(epsUrl);
                                    })
                                    // console.log(episodeList[i]);
                                }
    
                            })
                        })
                        
                    });

                }
            })
            .catch(err => {
                if (err.status < 500) {
                console.error(err);
                sendError(err, query, "");
                } else {
                console.error(err);
                }
            });

        }, 1000);
    } else if (query.length<3){ // If search query is empty, clear search results
        clearTimeout(search_timer);
        const prevresult = document.getElementById("search-result-overlay")
        prevresult.innerHTML=""
        prevresult.style="pointer-events:none"
    }
})

function skipOP(){
    const id = document.querySelector("#contentEntries > div:nth-child(3) > button").attributes["data-id"].value
    const eps = document.querySelector("#contentEntries > div:nth-child(3) > button").attributes["data-eps"].value
    const length = document.querySelector("#contentEntries > div:nth-child(3) > button").attributes["data-length"].value

    console.log(id,eps,length);
    clientGET(`https://api.aniskip.com/v2/skip-times/${id}/${eps}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=${length}`).then(response => {
        let resp = JSON.parse(response)
        console.log("SKIP: ",resp);
        
        // player.currentTime = resp.results[1].interval.endTime
    }).catch(err =>{
        console.error("Manual Skip",err);
        document.querySelector("#contentEntries > div:nth-child(3) > button").style = "display:block;"
        // player.currentTime = player.currentTime+85
    })
}