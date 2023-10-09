const player = document.querySelector("video")
var hidePlayerControlsTimer

const defaultQuality = 360
const netStatus =  document.querySelector("#netStat")

const player_element = document.querySelector(".vidContainer")
const play_button = document.querySelector("#play-container > span")
const progress_current = document.querySelector("#progress-container > div > p:nth-child(1)")
const progress_status = document.querySelector("#progress-container > div > p:nth-child(2)")
const progress_duration = document.querySelector("#progress-container > div > p:nth-child(3)")
const progress_input = document.querySelector("#progress-container > input")
const progress_bar = document.querySelector("#progress-container > progress")
const mute_button = document.querySelector("#volume-container > span")
const volume_input = document.querySelector("#volume-container > input")
const setting_button = document.querySelector("#controls-container > span:nth-child(1)")
const setting_menu = document.querySelector("#contentEntries > div:nth-child(1) > div:nth-child(1)")
const quality_setting = document.querySelector(".settingItems > #qualitySelect")
const sync_setting = document.querySelector(".settingItems > #syncMode")
const sync_button = document.querySelector("#controls-container > span:nth-child(2)")
const skip_button = document.querySelector("#controls-container > span:nth-child(3)")
const fullscreen_button = document.querySelector("#fullscreen-container > span")
const buffer_overlay = document.querySelector("#contentEntries > div:nth-child(1) > div:nth-child(2)")

const episodeContainer = document.querySelector(".epsContainer")
const miscContainer = document.querySelector(".miscContainer")

const poster = "https://cdn.discordapp.com/attachments/636600433799856128/1151476930005180446/9B.png"

let posted = false
let postid

const embedtest = [{
        "title": "body title",
        "description": `body desc`,
        "url": "https://www.google.com",
        "color": 13311,
        "fields": [
            {
                "name": "lastupdate",
                "value": "timestamp",
                "inline": true
            },
            {
                "name": "vidurl",
                "value": "url",
                "inline": true
            },
            {
                "name": "vidcurrtime",
                "value": "0",
                "inline": true
            }
        ],
        "author": {
            "name": "Nobyar v2 | Watch",
            "url": "https://komodolegend18.github.io/",
        },
        "image": {
            "url": ""
        },
        "thumbnail": {
            "url": ""
        }
    },
    {
        "title": "viData",
        "description": "data here",
        "color": null
    }
]

watchPageLoad()
function watchPageLoad(){
    setInterval(checkInternet, 1000)
    play_button.addEventListener("click", function(e){
        togglePlay()
    })
    player.addEventListener('click', function(e) {
        // console.log(e.target);
        togglePlay()
    });
    progress_input.addEventListener("input", function(e){
        // console.log(e.target.value);
        const seek = e.target.value
        player.currentTime = seek

        updateProgress()
        progress_bar.value = seek + 10
        progress_input.attributes[1].value = `${seek}`
    })
    mute_button.addEventListener("click",function(e){
        toggleMute();
    })
    volume_input.addEventListener("input",function(e){
        const vol = e.target.value
        player.volume = vol
    })
    setting_button.addEventListener("click", function(e){
        toggleSetting();
    })
    quality_setting.addEventListener("change", function(e) {
        // The value of the selected option
        var value = e.target.value;

        // The text of the selected option
        var text = e.target.options[e.target.selectedIndex].text;

        player.src = value
        // Now you can use the value and text as needed
        console.log("Selected option value: " + value);
        console.log("Selected option text: " + text);
    });
    updateSyncMode()
    sync_setting.addEventListener("change", function(e) {
        updateSyncMode()
    });
    

    sync_button.addEventListener("click", function(e){
        if(urlParams.has("id")==true){
            if (syncTime<player.duration){
                sync(watchID,watchURL)
            }else{
                player.currentTime = player.duration
            }
        }
    })
    skip_button.addEventListener("click", function(e){
        
    })
    fullscreen_button.addEventListener("click", function(e){
        toggleFullscreen();
    })

    // Skip opening
    document.addEventListener('keydown', function(event) {
        if (event.code == 'ArrowRight' && event.ctrlKey) {
            // Check if the event's target is an input element
            if (event.target.tagName.toLowerCase() === 'input') {
                return;  // Don't do anything if the user is focused on an input element
            }
            console.log(event);
            event.preventDefault();
            player.currentTime += 85;
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.code == 'ArrowRight' && !event.ctrlKey) {
            // Check if the event's target is an input element
            if (event.target.tagName.toLowerCase() === 'input') {
                return;  // Don't do anything if the user is focused on an input element
            }
            console.log(event);
            event.preventDefault();
            player.currentTime += 5;
        }
    });
    document.addEventListener('keydown', function(event) {
        if (event.code == 'ArrowLeft' && !event.ctrlKey) {
            // Check if the event's target is an input element
            if (event.target.tagName.toLowerCase() === 'input') {
                return;  // Don't do anything if the user is focused on an input element
            }
            console.log(event);
            event.preventDefault();
            player.currentTime -= 5;
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.code == 'Space' && !event.ctrlKey) {
            // Check if the event's target is an input element
            if (event.target.tagName.toLowerCase() === 'input') {
                return;  // Don't do anything if the user is focused on an input element
            }
            console.log(event);
            event.preventDefault();
            togglePlay();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyM' && !event.ctrlKey) {
            // Check if the event's target is an input element
            if (event.target.tagName.toLowerCase() === 'input') {
                return;  // Don't do anything if the user is focused on an input element
            }
            console.log(event);
            event.preventDefault();
            toggleMute();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyC' && !event.ctrlKey) {
            // Check if the event's target is an input element
            if (event.target.tagName.toLowerCase() === 'input') {
                return;  // Don't do anything if the user is focused on an input element
            }
            console.log(event);
            event.preventDefault();
            toggleSetting();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyF' && !event.ctrlKey) {
            // Check if the event's target is an input element
            if (event.target.tagName.toLowerCase() === 'input') {
                return;  // Don't do anything if the user is focused on an input element
            }
            console.log(event);
            event.preventDefault();
            toggleFullscreen();
        }
    });

    // Leave search
    document.addEventListener('keydown', function(event) {
        if (event.code == 'Escape' && !event.ctrlKey) {
            console.log(event);
            event.preventDefault();
            closeSearch()
        }
    });

    // Enter search
    document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyF' && event.ctrlKey) {
            // Check if the event's target is an input element
            if (event.target.tagName.toLowerCase() === 'input') {
                return;
            }
            console.log(event);
            event.preventDefault();
            searchInput.focus()
        }
    });

    // Sync
    document.addEventListener('keydown', function(event) {
        if (event.code == 'Space' && event.ctrlKey) {
            // Check if the event's target is an input element
            if (event.target.tagName.toLowerCase() === 'input') {
                return;
            }
            console.log(event);
            event.preventDefault();
            if(sync_setting.value=="false"){
                console.log("Manual Sync");
                sync(watchID,watchURL)
            }else{
                console.log("Manual sync disabled");
            }
        }
    });

    // Toggle controls visibility
    player_element.addEventListener('mousemove', function() {
        hideControls();
    });
    player_element.addEventListener('mouseout', function() {
        hideControls();
    });
    

    player.oncanplay = function(){
        // document.querySelector("#progress-container > progress").value = 0 
        // document.querySelector("#progress-container > input").attributes[1].value = `0`
        // document.querySelector("#contentEntries > div:nth-child(3) > button").attributes["data-length"].value = duration
        updateProgress()
        progress_status.innerHTML = `Can play data`
        buffer_overlay.style["display"] = "none"
        // player.poster = ""

        // console.log("oncanplay");
        // skipOP()
    }
    player.ontimeupdate = function() {
        // console.log(player.currentTime,player.duration);
        updateProgress()
    };

    // Try to load video
    player.onloadstart = function() {
        buffer_overlay.style["display"] = "grid"
        // player.poster = poster
        progress_status.innerHTML = `Loading data`
        // console.log("onloadstart");
    }
    // Downloading video
    player.onprogress = function() {
        // buffer_overlay.style["display"] = "none"
        progress_status.innerHTML = `Downloading data`
        // console.log("onprogress");
    }
    // Can't load video
    player.onerror = function(e) {
        buffer_overlay.style["display"] = "grid"
        player.poster = poster
        progress_status.innerHTML = `No Data`
        console.error("Error loading video",e);
    }
    player.onwaiting = function() {
        buffer_overlay.style["display"] = "grid"
        progress_status.innerHTML = `Waiting`
        // console.log("onwaiting");
        // hostSend("Host Waiting")
    }
    player.onloadeddata = function() {
        buffer_overlay.style["display"] = "none"
        progress_status.innerHTML = `Data ready`
        // console.log("onloadeddata");
    }
    player.onplaying = function() {
        buffer_overlay.style["display"] = "none"
        // console.log("onplaying");

        // if host
        hostSend("Playing");
    }
    player.onplay = function() {
        buffer_overlay.style["display"] = "none"
        // console.log("onplay");

        hideControls()
        // togglePlay()
    }
    player.onpause = function() {
        buffer_overlay.style["display"] = "none"
        // console.log("onpause");

        hostSend("Paused");
        hideControls()
        // togglePlay()
    }
    player.onended = function() {
        buffer_overlay.style["display"] = "grid"
        progress_status.innerHTML = `Data Ended`
        console.log("onended");
        hostSend("Ended");
        // togglePlay()
    }
    updateWebhook()
}

function togglePlay(state){
    console.log("togglePlay");
    if (player.readyState>=3){
        // data for the current and at least the next frame is available
        if (player.paused || player.ended) {
            console.log("paused/ended > play");
            progress_status.innerHTML = `Playing`
            player.play();

            // Icon
            play_button.innerHTML = "pause"            
        } else {
            console.log("playing > pause");
            player.pause();
            progress_status.innerHTML = `Paused`

            // Icon
            play_button.innerHTML = "play_arrow"
        }
    }

    // if NOT host
    if(state=="Playing"){
        player.play();
        progress_status.innerHTML = `Playing`
        // player.muted = false;
        
        // Icon
        play_button.innerHTML = "pause"
    }else if(state=="Paused"){
        player.pause();
        progress_status.innerHTML = `Host Paused`
        // player.muted = false;

        // Icon
        play_button.innerHTML = "play_arrow"
    }
}

function toggleMute(){
    if (player.muted){
        mute_button.innerHTML = "volume_up"
        player.muted = false
    } else {
        mute_button.innerHTML = "volume_off"
        player.muted = true
    }
}

function toggleSetting(){
    if (setting_menu.style["display"]=="block"){
        setting_menu.style["display"] = "none"
    } else {
        setting_menu.style["display"] = "block"
    }
}

function updateSyncMode() {
    let value = sync_setting.value
    // console.log(value);
    if(value=="true"){
        console.log("[Sync Mode] Auto");
        sync_button.classList.add("disabled")
    }else{
        console.log("[Sync Mode] Manual");
        sync_button.classList.remove("disabled")
    }
}

function hideControls() {
    clearTimeout(hidePlayerControlsTimer);

    if(!player.paused){
        player_element.querySelector(".vidcontrols").classList.remove("hidden");

        hidePlayerControlsTimer = setTimeout(function() {
            player_element.querySelector(".vidcontrols").classList.add("hidden");
        }, 2100);
    }else if(player.paused){
        player_element.querySelector(".vidcontrols").classList.remove("hidden");
    }
}

function toggleFullscreen() {
    if (document.fullscreenElement) {
        fullscreen_button.innerHTML = "fullscreen"
        document.exitFullscreen();
    } else if (document.webkitFullscreenElement) {
        // Need this to support Safari
        fullscreen_button.innerHTML = "fullscreen"
        document.webkitExitFullscreen();
    } else if (player_element.webkitRequestFullscreen) {
        // Need this to support Safari
        fullscreen_button.innerHTML = "fullscreen_exit"
        player_element.webkitRequestFullscreen();
    } else {
        fullscreen_button.innerHTML = "fullscreen_exit"
        player_element.requestFullscreen();
    }
}

function updateProgress(){
    try {
        // Update Player Progress
        // # Progress Bar
        progress_bar.value = player.currentTime
        progress_bar.max = player.duration
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
                alldim[i].addEventListener("click", closeSearch)
            }
    }
    if(e.target.value.length>=3){
        document.getElementById("search-result-overlay").style="pointer-events: auto;"
    }
    
    // console.warn("dim applied")
    // console.log(query)
})

function closeSearch() {
    const alldim = document.querySelectorAll(".dim")
    for(i=0;i<alldim.length;i++){
        alldim[i].remove()
    }
    const prevresult = document.getElementById("search-result-overlay")
    if(prevresult){
        // prevresult.innerHTML=""
        prevresult.style="pointer-events:none;display:none"
    }
    searchInput.blur();
}

function hostSend(status){
    if(urlParams.has("id")==false){
        let embed = embedtest
        let vq = []
        console.log(quality_setting.children);
        for (let i = 0; i < quality_setting.children.length; i++) {
            let obj = {
                type:`${quality_setting.children[i].innerHTML}`,
                url:`${quality_setting.children[i].value}`
            }
            vq.push(obj);
        }
        embed[0].title = `${player.attributes["data-title"].value}`
        embed[0].url = `https://myanimelist.net/search/all?cat=all&q=${encodeURIComponent(player.attributes["data-title"].value)}`
        embed[0].description = `[Ep.${player.attributes["data-eps"].value}] ${progress_current.innerHTML} - ${progress_duration.innerHTML}`
        embed[0].image.url = `${player.poster}`
        // embed[0].thumbnail.url = `${player.poster}`
        embed[0].fields[0].name = `Last updated:`
        embed[0].fields[0].value = `<t:${Math.round(new Date().getTime() / 1000)}:R>`
        embed[0].fields[1].name = `Status`
        embed[0].fields[1].value = `${status}`
        embed[0].fields[2].name = `Current time`
        embed[0].fields[2].value = `${player.currentTime}`
        embed[1].description = `\`\`\`${JSON.stringify(vq)}\`\`\``
        
        console.log(embed);
        createEmbed()

        function createEmbed() {
            if(posted==false){
                posted = true
                discordWebhook("POST",updateWebhook(),true,embed).then(response => {
                    let resp = response.response[0]
                    postid = resp.id
                    console.log("discord Response",resp.id);
    
                    updateEmbed()
                })
            }else{
                updateEmbed()
            }
        }
        
        function updateEmbed() {
            if(posted==true){
                embed[0].description = `[Ep.${player.attributes["data-eps"].value}] ${progress_current.innerHTML} - ${progress_duration.innerHTML}\n# [__Join Nobyar__](https://komodolegend18.github.io/projects/Nobyar/v2/watch/?id=${postid}&url=${updateWebhook()})`
                discordWebhook("PATCH",`${updateWebhook()}/messages/${postid}`,"true",embed).then(response => {
                    console.log(response);
                    console.log(`?id=${postid}&url=${updateWebhook()}`);
                })
            }
        }
    }
}

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
                        player.poster = poster
                        episodeContainer.innerHTML = ""

                        const dataIndex = e.target.getAttribute("data-index");
                        if (!dataIndex) return; // Check if a valid data-index attribute exists
                        const selected = e.target.children[1].querySelector("#synopsis").innerHTML
                        closeSearch()

                        player.attributes["data-title"].value = title
                        clientGET(selected).then(response => {
                            kuramaEpsList(response)
                        })

                        // getMalAPISearch(title).then(response => {
                        //     const animeID = response[0].node.id
                        //     document.querySelector("#contentEntries > div:nth-child(3) > button").attributes["data-id"].value = animeID
                        //     console.log(animeID);

                        //     player.attributes["data-title"].value = title
                        //     player.attributes["data-idmal"].value = animeID

                        //     clientGET(selected).then(response => {
                        //         kuramaEpsList(response,animeID)
                        //     })
                        // })
                        
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

miscContainer.querySelector("input").addEventListener("input", function(e) {
    let query = e.target.value
    let pattern = new RegExp('https://discord\\.com/api/webhooks/');
    if (pattern.test(query)){
        // https://discord.com/api/webhooks/835374841455443968/IHdR8hm8AES_l15uwQBIAjnZHmHafkDqXUpr7LX3RSEPcMY5LfpOMcZ0HmT9n25al6GF
        clearTimeout(search_timer);
        search_timer = setTimeout(() => {
            console.log("> Checking Webhook: ",query)
            clientGET(query).then(response => {
                if(miscContainer.querySelector("#webhookValid")){
                    miscContainer.querySelector("#webhookValid").remove()
                }
                let parsed = JSON.parse(response) 
                console.log(parsed);

                var respondElem = document.createElement("div");
                respondElem.id = "webhookValid"
                respondElem.innerHTML = `
                <p>Webhook is Valid!</p>
                <p>Webhook Name : ${parsed.name}</p>
                <p>Webhook Channel : ${parsed.channel_id}</p>
                <p>Webhook Guild : ${parsed.guild_id}</p>
                <p>Webhook Owner : ${parsed.user.global_name} (${parsed.user.username})</p>
                `;
                miscContainer.appendChild(respondElem);

                let data = loadingUserData()
                data[0].config[0].webhook[0] = {url:`${query}`}
                console.log(data[0].config[0].webhook);
                savingUserData(data,"[Nobyar > Watch] Saved Webhook URL")
            }).catch(err => {
                if (err.status <= 400) {
                    console.error(err);
                    sendError(err, query, "");
                } else {
                    console.error(err);
                }
            });

        }, 1000);
    } else {
        clearTimeout(search_timer);
    }
})

function updateWebhook() {
    if(user_data[0].config[0].webhook.length>0){
        let url = user_data[0].config[0].webhook[0].url
        // console.log(url);
        miscContainer.querySelector("input").value = url

        return url
    }else{
        return
    }
}

function kuramaEpsList(data) {
    const html = new DOMParser().parseFromString(data, 'text/html');
    const episode = new DOMParser().parseFromString(html.querySelector("#episodeLists").attributes["data-content"].value,"text/html")
    // console.log(episode);
    const nextURL = episode.body.children[episode.body.children.length-1].attributes["href"].value
    console.log(nextURL);
    const episodeList = episode.querySelectorAll("a.btn-danger")
    for (let i = 0; i < episodeList.length; i++) {
        // console.log("episode list loop: ",i,episodeList.length);
        const title = episodeList[i].innerHTML
        const url = episodeList[i].attributes["href"].value
        const epsCount = title.match(/\d+/g)[0];
        // console.log(epsCount);

        const items = document.createElement("div");
        items.id = "items";
        items.setAttribute("data-index", epsCount);
        items.innerHTML = `
            <div id="info" style="pointer-events:none;">
                <a href="${url}" target="_blank" id="title">${title}</a>
            </div>
        `;
        episodeContainer.appendChild(items);

        items.addEventListener("click", function (e){
            document.querySelector("#progress-container > progress").removeAttribute("value");
            document.querySelector("#progress-container > progress").removeAttribute("max");
            document.querySelector("#progress-container > input").attributes["value"].value = "0";
            document.querySelector("#progress-container > input").removeAttribute("max");

            player.attributes["data-eps"].value = epsCount
            // console.log(e);
            const epsUrl = e.target.querySelector("a").attributes["href"].value

            clientGET(`${epsUrl}?activate_stream=nOc7xTBoR5F0DC9Jhl5oix2oSfN8waFI`).then(response => {
                // Clear quality setting
                quality_setting.innerHTML = ""

                const responseHTML = new DOMParser().parseFromString(response, 'text/html');
                console.log(responseHTML);

                // document.querySelector("#contentEntries > div:nth-child(3) > button").style = "display:none;"

                for (let i = 0; i < responseHTML.querySelectorAll("#player > source").length; i++) {
                    const data = responseHTML.querySelectorAll("#player > source")[i]
                    console.log(data);
                    
                    // Create a new option element
                    var option = document.createElement("option");

                    // Set the value attribute
                    option.value = `${data.attributes["src"].value}`;
                    
                    // Set the text content
                    option.textContent = `${data.attributes["size"].value}p`;

                    if (data.attributes["size"].value==defaultQuality){
                        option.selected = true
                        player.src = data.attributes["src"].value
                    }

                    quality_setting.appendChild(option);
                }
                hostSend(`Selected Ep.${epsCount}`)
                // const hiQ = html.querySelector("#player > source:nth-child(1)").attributes["src"].value
                // const medQ = html.querySelector("#player > source:nth-child(2)").attributes["src"].value
                // const lowQ = html.querySelector("#player > source:nth-child(3)").attributes["src"].value

                // const regex = /https:\/\/(.+)\.my\.id\//;
                // const replacedUrl = lowQ.replace(regex, "https://komi.my.id/");
                // console.log(lowQ);
                // document.querySelector("video").src = lowQ

                // console.groupCollapsed("[Video URL]")
                // console.log("Low",lowQ);
                // console.log("Med",medQ);
                // console.log("High",hiQ);
                // console.groupEnd()
            })
            console.log(epsUrl);
        })
        if(i==episodeList.length-1){
            clientGET(nextURL).then(response=>{
                kuramaEpsList(response)
            }).catch(err=>{
                console.error("All available episode already displayed",err);
                // getMalPage(malID,"anime").then(response=>{
                //     const html = new DOMParser().parseFromString(response, 'text/html');
                //     console.log(html.querySelector("#horiznav_nav > ul"));
                // })
            })
            
        }
        // console.log(episodeList[i]);
    }
}


function skipOP(){
    // const id = document.querySelector("#contentEntries > div:nth-child(3) > button").attributes["data-id"].value
    // const eps = document.querySelector("#contentEntries > div:nth-child(3) > button").attributes["data-eps"].value
    // const length = document.querySelector("#contentEntries > div:nth-child(3) > button").attributes["data-length"].value

    console.log(id,eps,length);
    clientGET(`https://api.aniskip.com/v2/skip-times/${id}/${eps}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=${length}`).then(response => {
        let resp = JSON.parse(response)
        console.log("SKIP: ",resp);
        
        // player.currentTime = resp.results[1].interval.endTime
    }).catch(err =>{
        console.error("Manual Skip",err);
        // document.querySelector("#contentEntries > div:nth-child(3) > button").style = "display:block;"
        // player.currentTime = player.currentTime+85
    })
}