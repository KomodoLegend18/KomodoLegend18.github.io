try {
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
    
    var posted = false
    let postid
    
    const embedTemplate = [{
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
        // clientGET("https://github.com/KomodoLegend18/KomodoLegend18.github.io/commits/main/projects/Nobyar").then(response=>{
        //     const res = new DOMParser().parseFromString(response, 'text/html').querySelector(".clearfix > .js-navigation-container");
        //     console.log(res);
        // })
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
            // do something here
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
                console.groupCollapsed("[Keyboard Shortcut] +85s")
                    console.log(event);
                console.groupEnd()
                event.preventDefault();
                player.currentTime += 85;
            }
        });
        // Skip -5s/+5s
        document.addEventListener('keydown', function(event) {
            if (event.code == 'ArrowLeft' && !event.ctrlKey) {
                // Check if the event's target is an input element
                if (event.target.tagName.toLowerCase() === 'input') {
                    return;  // Don't do anything if the user is focused on an input element
                }
                console.groupCollapsed("[Keyboard Shortcut] -5s")
                    console.log(event);
                console.groupEnd()
                event.preventDefault();
                player.currentTime -= 5;
            }
        });
        document.addEventListener('keydown', function(event) {
            if (event.code == 'ArrowRight' && !event.ctrlKey) {
                // Check if the event's target is an input element
                if (event.target.tagName.toLowerCase() === 'input') {
                    return;  // Don't do anything if the user is focused on an input element
                }
                console.groupCollapsed("[Keyboard Shortcut] +5s")
                    console.log(event);
                console.groupEnd()
                event.preventDefault();
                player.currentTime += 5;
            }
        });
        // Toggle play
        document.addEventListener('keydown', function(event) {
            if (event.code == 'Space' && !event.ctrlKey) {
                // Check if the event's target is an input element
                if (event.target.tagName.toLowerCase() === 'input') {
                    return;  // Don't do anything if the user is focused on an input element
                }
                console.groupCollapsed("[Keyboard Shortcut] Play/Pause")
                    console.log(event);
                console.groupEnd()
                event.preventDefault();
                togglePlay();
            }
        });
        // Toggle mute
        document.addEventListener('keydown', function(event) {
            if (event.code == 'KeyM' && !event.ctrlKey) {
                // Check if the event's target is an input element
                if (event.target.tagName.toLowerCase() === 'input') {
                    return;  // Don't do anything if the user is focused on an input element
                }
                console.groupCollapsed("[Keyboard Shortcut] Toggle Mute")
                    console.log(event);
                console.groupEnd()
                event.preventDefault();
                toggleMute();
            }
        });
        // Toggle setting
        document.addEventListener('keydown', function(event) {
            if (event.code == 'KeyC' && !event.ctrlKey) {
                // Check if the event's target is an input element
                if (event.target.tagName.toLowerCase() === 'input') {
                    return;  // Don't do anything if the user is focused on an input element
                }
                console.groupCollapsed("[Keyboard Shortcut] Toggle Setting Menu")
                    console.log(event);
                console.groupEnd()
                event.preventDefault();
                toggleSetting();
            }
        });
        // Toggle fullscreen
        document.addEventListener('keydown', function(event) {
            if (event.code == 'KeyF' && !event.ctrlKey) {
                // Check if the event's target is an input element
                if (event.target.tagName.toLowerCase() === 'input') {
                    return;  // Don't do anything if the user is focused on an input element
                }
                console.groupCollapsed("[Keyboard Shortcut] Toggle Fullscreen")
                    console.log(event);
                console.groupEnd()
                event.preventDefault();
                toggleFullscreen();
            }
        });
        // Leave search
        document.addEventListener('keydown', function(event) {
            if (event.code == 'Escape' && !event.ctrlKey) {
                console.groupCollapsed("[Keyboard Shortcut] Leave search")
                    console.log(event);
                console.groupEnd()
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
                console.groupCollapsed("[Keyboard Shortcut] Search")
                    console.log(event);
                console.groupEnd()
                event.preventDefault();
                if (urlParams.has('id')==false){
                    searchInput.focus()
                }
            }
        });
        // Sync
        document.addEventListener('keydown', function(event) {
            if (event.code == 'Space' && event.ctrlKey) {
                // Check if the event's target is an input element
                if (event.target.tagName.toLowerCase() === 'input') {
                    return;
                }
                console.groupCollapsed("[Keyboard Shortcut] Sync")
                    console.log(event);
                console.groupEnd()
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

        // Try to load video
        player.onloadstart = function() {
            buffer_overlay.style["display"] = "grid"
            // player.poster = poster
            progress_status.innerHTML = `Loading data`
            // console.log("onloadstart");
        }
        // data loaded
        player.onloadeddata = function() {
            buffer_overlay.style["display"] = "none"
            progress_status.innerHTML = `Data ready`
            // console.log("onloadeddata");
        }
        // Video can start
        player.oncanplay = function(){
            updateProgress()
            // progress_status.innerHTML = `Can play data`
            buffer_overlay.style["display"] = "none"
            // player.poster = ""
    
            // console.log("oncanplay");
            // skipOP()
        }
        // Update progress display
        player.ontimeupdate = function() {
            // console.log(player.currentTime,player.duration);
            updateProgress()
    
            syncSpeedUp() // if Viewer
        };
        // Downloading video / buffer
        player.onprogress = function() {
            // buffer_overlay.style["display"] = "none"
            // progress_status.innerHTML = `Downloading data`
            // console.log("onprogress");
        }
        // Can't load video
        player.onerror = function(e) {
            buffer_overlay.style["display"] = "grid"
            player.poster = poster
            progress_status.innerHTML = `No Data`
            console.error(`[player.onerror] Video Player Error\n${e.target.error.message}`,e);
        }
        // Player waiting to play
        player.onwaiting = function() {
            buffer_overlay.style["display"] = "grid"
            progress_status.innerHTML = `Waiting`
            // hideControls()
            // console.log("onwaiting");
            // hostSend("Host Waiting")
        }
        // Player playing
        player.onplaying = function() {
            buffer_overlay.style["display"] = "none"
            // console.log("onplaying");
            hostSend("Playing"); // if host
        }
        player.onplay = function() {
            // buffer_overlay.style["display"] = "none"
            // console.log("onplay");
            hideControls()
            // togglePlay()
        }
        // Player paused
        player.onpause = function() {
            buffer_overlay.style["display"] = "none"
            // console.log("onpause");
    
            hostSend("Paused");
            hideControls()
            // togglePlay()
        }
        // Player ended
        player.onended = function() {
            buffer_overlay.style["display"] = "grid"
            progress_status.innerHTML = `Data Ended`
            console.log("onended");
            hostSend("Ended");
            // togglePlay()
        }
        checkSavedWebhook()
    }
    
    function togglePlay(state){
        console.log("togglePlay");
        if (player.readyState>=3){
            // data for the current and at least the next frame is available
            if (player.paused || player.ended) {
                console.log("paused/ended > play");
                progress_status.innerHTML = `Playing`
                try {
                    player.play();
                } catch (error) {
                    console.error(error);
                }
    
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
            try {
                player.play();
            } catch (error) {
                console.error(error);
            }
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
            console.log("[updateSyncMode] Sync mode: Auto");
            sync_button.classList.add("disabled")
        }else{
            console.log("[updateSyncMode] Sync mode: Manual");
            sync_button.classList.remove("disabled")
        }
    }
    
    function hideControls() {
        clearTimeout(hidePlayerControlsTimer);
    
        // console.log("[hideControls] paused: ",player.paused);
        if(!player.paused){
            player_element.querySelector(".vidcontrols").classList.remove("hidden");
            player.style.cursor = "default"
            if (document.fullscreenElement) {
                document.fullscreenElement.style.cursor = "default"
            } else if (document.webkitFullscreenElement) {
                document.webkitFullscreenElement.style.cursor = "default"
            }
    
            hidePlayerControlsTimer = setTimeout(function() {
                player_element.querySelector(".vidcontrols").classList.add("hidden");
                player.style.cursor = "none"
                // document.body.style.cursor = "none"
                if (document.fullscreenElement) {
                    document.fullscreenElement.style.cursor = "none"
                } else if (document.webkitFullscreenElement) {
                    document.webkitFullscreenElement.style.cursor = "none"
                }
            }, 2000);
        }else if(player.paused){
            player_element.querySelector(".vidcontrols").classList.remove("hidden");
            player.style.cursor = "default"
            if (document.fullscreenElement) {
                document.fullscreenElement.style.cursor = "default"
            } else if (document.webkitFullscreenElement) {
                document.webkitFullscreenElement.style.cursor = "default"
            }
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
            if(player.duration){
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

            }else{
                throw new Error(`Player duration: ${player.duration}`);
            }
        } catch (error) {
            console.error(error);
            sendError(error, `List total: ${loadingUserData()[0].list.length}\nWebhook total: ${loadingUserData()[0].config[0].webhook.length}\n`, `Error executing script.js in nobyar watch`);
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
            console.groupCollapsed("[hostSend] Sending data")
            let embed = embedTemplate
            let vq = []
            // console.log(quality_setting.children);
            console.groupCollapsed("> Video Quality")
            for (let i = 0; i < quality_setting.children.length; i++) {
                let obj = {
                    type:`${quality_setting.children[i].innerHTML}`,
                    url:`${quality_setting.children[i].value}`
                }
                console.log(obj);
                vq.push(obj);
            }
            console.groupEnd()
    
            embed[0].title = `${player.attributes["data-title"].value}`
            embed[0].url = `https://myanimelist.net/search/all?cat=all&q=${encodeURIComponent(player.attributes["data-title"].value)}`
            embed[0].description = `[Ep.${player.attributes["data-eps"].value}] ${progress_current.innerHTML} - ${progress_duration.innerHTML} <t:${Math.round(new Date().getTime() / 1000)}:R>`
            embed[0].image.url = `${player.poster}`
            // embed[0].thumbnail.url = `${player.poster}`
            embed[0].fields[0].name = `Last updated:`
            embed[0].fields[0].value = `${new Date().getTime() / 1000}`
            embed[0].fields[1].name = `Status`
            embed[0].fields[1].value = `${status}`
            embed[0].fields[2].name = `Current time`
            embed[0].fields[2].value = `${player.currentTime}`
            embed[1].description = `\`\`\`${JSON.stringify(vq)}\`\`\``
            
            console.log("Embed data: ",embed);
            if(checkSavedWebhook()){
                createEmbed()
            }
    
            function createEmbed() {
                if(posted==false){
                    posted = true
                    discordWebhook("POST",checkSavedWebhook(),true,embed).then(response => {
                        console.groupCollapsed("[hostSend] > [createEmbed] 🟢 Received response")
    
                        let resp = response.response[0]
                        postid = resp.id
                        console.trace("Webhook Message ID:\n",resp.id);
        
                        updateEmbed()
                        console.groupEnd()
                    })
                }else{
                    updateEmbed()
                }
            }
            
            function updateEmbed() {
                if(posted==true){
                    embed[0].description = `[Ep.${player.attributes["data-eps"].value}] ${progress_current.innerHTML} - ${progress_duration.innerHTML} <t:${Math.round(new Date().getTime() / 1000)}:R>\n# [__Join Nobyar__](https://komodolegend18.github.io/projects/Nobyar/v2/watch/?id=${postid}&url=${checkSavedWebhook()})\n\`\`\`?id=${postid}&url=${checkSavedWebhook()}\`\`\``
                    discordWebhook("PATCH",`${checkSavedWebhook()}/messages/${postid}`,"true",embed).then(response => {
                        console.groupCollapsed("[hostSend] > [updateEmbed] 🟡 Received response")
                        console.log(response);
                        console.trace("Connection parameter:\n",`?id=${postid}&url=${checkSavedWebhook()}`);
                        console.groupEnd()
                    })
                }
            }
            console.groupEnd()
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
                const url = `https://kuramanime.pro/anime?order_by=popular&search=${query}&page=1`
                clientGET(url).then(response => {
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
                                kuramaParse(response)
                            })                            
                        });
    
                    }
                })
                .catch(err => {
                    if (err.status < 500) {
                        console.error(err);
                        sendError(err, err.status, url);
                    } else {
                        console.error(err);
                        sendError(err, err.status, url);
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
                        sendError(err, "", "Webhook input");
                    } else {
                        console.error(err);
                        sendError(err, "", "Webhook input");
                    }
                });
    
            }, 1000);
        } else {
            clearTimeout(search_timer);
            let data = loadingUserData()
            // Remove the first item from the webhook array
            if (data[0].config[0].webhook.length > 0) {
                data[0].config[0].webhook.splice(0, 1);
            }
            savingUserData(data,"[Nobyar > Watch] Saved Webhook URL")
        }
    })
    
    function checkSavedWebhook() {
        if(loadingUserData()[0].config[0].webhook.length>0){
            let url = loadingUserData()[0].config[0].webhook[0].url
            // console.log(url);
            miscContainer.querySelector("input").value = url
    
            return url
        }else{
            return null
        }
    }
    
    function kuramaParse(data) {
        console.groupCollapsed("[kuramaParse] Displaying episode lists")
        try {
            const dataHTML = new DOMParser().parseFromString(data, 'text/html');
            console.warn(dataHTML);

            const episodeLists = new DOMParser().parseFromString(dataHTML.querySelector("#episodeLists").attributes["data-content"].value, "text/html")
            const episodeListsNextPage = episodeLists.body.children[episodeLists.body.children.length - 1].attributes["href"].value
            console.log("nextURL:\n", episodeListsNextPage);
            const episodes = episodeLists.querySelectorAll("a.btn-danger")
            for (let i = 0; i < episodes.length; i++) {
                // console.log("episode list loop: ",i,episodeList.length);
                const episodeTitle = episodes[i].innerHTML
                const episodeURL = episodes[i].attributes["href"].value
                // const episodeCount = episodeTitle.match(/\d+/g)[0];
                const episodeCount = i+1
    
                // console.log(epsCount);
    
                const items = document.createElement("div");
                items.id = "items";
                items.setAttribute("data-index", episodeCount);
                items.innerHTML = `
                <div id="info" style="pointer-events:none;">
                    <a href="${episodeURL}" target="_blank" id="title">${episodeTitle}</a>
                </div>`;
                episodeContainer.appendChild(items);
                items.addEventListener("click", episodeClicked)
    
                if (i == episodes.length - 1) {
                    clientGET(nextURL).then(response => {
                        kuramaParse(response)
                    })
                }
            }
        }catch (error) {
            console.log(error.message);
            if(error.message=="nextURL is not defined"){
                console.warn("All available episode may already displayed\n", error);
            }else{
                console.error(error, data);
                sendError(error, "", `[kuramaParse]`);
            }
        }
        console.groupEnd()
        function episodeClicked(item) {
            console.groupCollapsed("[kuramaParse] Episode selected")
            progress_bar.removeAttribute("value");
            progress_bar.removeAttribute("max");
            progress_input.attributes["value"].value = "0";
            progress_input.removeAttribute("max");
    
            player.attributes["data-eps"].value = item.target.attributes["data-index"].value
            // console.log(e);
            const episodeURL = item.target.querySelector("a").attributes["href"].value
            console.log(episodeURL);
            console.groupEnd();
            episodeGet(episodeURL);
        }
        function episodeGet(URL) {
            clientGET(URL).then(response =>{
                console.groupCollapsed("[kuramaParse] Token")
                let episodeHTML = new DOMParser().parseFromString(response, 'text/html');
                console.log("epsPage:\n",episodeHTML);
                let csrfToken = episodeHTML.querySelector("meta[name='csrf-token']").attributes["content"].value
                let getEndpoint = episodeHTML.querySelectorAll("script:not([src]):not([type])")[1].innerHTML
                const regex = [
                    /window\.stRt = \"(.*?)\";/,
                    /window\.stbk = \"(.*?)\";/
                ]
                let Rt = getEndpoint.match(regex[0])[1].replace(/\\/g, '');
                let Bk = getEndpoint.match(regex[1])[1];
                // csrfToken = matchBk[1]
                console.warn("rt:\n",Rt,"\nbk:\n",Bk,"\ncsrf:\n",csrfToken);
                if (Rt&&Bk) {
                    kuramaTokenPOST(Rt,csrfToken).then(response => {
                        console.log(response);
                        episodeLoad(URL,response)
                    }).catch(err => {
                        console.error("Error getting token:\n",err,"\n\nTrying other method...");
                        episodeLoad(URL,Bk)
                    })
                    // clientGET("https://kuramanime.pro/misc/refresh-token").then(response=>{
                    //     csrfToken = JSON.parse(response).token
                    // })
                }
                console.groupEnd()
            })
        }
        function episodeLoad(URL,token) {
            // ?activate_stream=nOc7xTBoR5F0DC9Jhl5oix2oSfN8waFI
            // ?dfgRr1OagZvvxbzHNpyCy0FqJQ18mCnb=LOtqO0Y6jT&twEvZlbZbYRWBdKKwxkOnwYF0VWoGGVg=kuramadrive
            clientGET(`${URL}?dfgRr1OagZvvxbzHNpyCy0FqJQ18mCnb=${token}&twEvZlbZbYRWBdKKwxkOnwYF0VWoGGVg=kuramadrive`).then(response => {
                try{
                    console.groupCollapsed("[kuramaParse] Episode data loaded");
                    const responseHTML = new DOMParser().parseFromString(response, 'text/html');
                    const servers = responseHTML.querySelectorAll("#changeServer > option")
                    let sources = responseHTML.querySelectorAll("#player > source")
                    if(sources.length<1){
                        throw new Error(`Sources total: ${sources.length}\nURL: ${URL}\nToken: ${token}\nFullURL: ${URL}?dfgRr1OagZvvxbzHNpyCy0FqJQ18mCnb=${token}&twEvZlbZbYRWBdKKwxkOnwYF0VWoGGVg=kuramadrive`);
                    }
                    console.log(responseHTML);
        
                    // Clear quality setting
                    quality_setting.innerHTML = ""
        
                    console.log("Available Server", servers);
                    console.log("Sources: ", sources);
                    for (let i = 0; i < sources.length; i++) {
                        const data = sources[i]
                        console.log(data);
            
                        // Create a new video quality option element
                        var option = document.createElement("option");
                        option.value = `${data.attributes["src"].value}`;
                        option.textContent = `${data.attributes["size"].value}p`;
            
                        if (data.attributes["size"].value == defaultQuality) {
                            option.selected = true
                            player.src = data.attributes["src"].value
                        }else{
                            option.selected = true
                            player.src = data.attributes["src"].value
                        }
                        quality_setting.appendChild(option);
                    }
                    hostSend(`Selected Ep.${player.attributes["data-eps"].value}`)
                    console.groupEnd();
                }catch(err) {
                    console.error(err);
                    sendError(err, `${URL}?dfgRr1OagZvvxbzHNpyCy0FqJQ18mCnb=${token}&twEvZlbZbYRWBdKKwxkOnwYF0VWoGGVg=kuramadrive`, `\`\`\`${JSON.stringify({
                        "url":URL,
                        "token":token
                    })}\`\`\``);
                }
                // const regex = /https:\/\/(.+)\.my\.id\//;
                // const replacedUrl = lowQ.replace(regex, "https://komi.my.id/");
            })
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
} catch (error) {
    console.error(error);
    sendError(error, `List total: ${loadingUserData()[0].list.length}\nWebhook total: ${loadingUserData()[0].config[0].webhook.length}\n`, `Error executing script.js in nobyar watch`);
}