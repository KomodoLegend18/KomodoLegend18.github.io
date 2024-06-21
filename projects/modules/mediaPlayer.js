let mediaTime = 0
export const mediaPlayer = {
    create: function (options){
        const {
            source,
            poster,
            target
        } = options;
        const container = document.createElement("div")
        container.className = "vidContainer"
        // container.innerHTML =``
        container.innerHTML = `
        <div class="vidSettingOverlay">
            <div class="settingItems">
                <label for="vidQuality">Quality: </label>
                <select name="vidQuality" id="qualitySelect">
                    <option value="" selected hidden>No data</option>
                </select>
            </div>
            <div class="settingItems">
                <label for="sync2Host">Automatically sync to host: </label>
                <select name="sync2Host" id="syncMode">
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            </div>
            <div class="settingItems notImplemented">
                <label for="aniSkip">When available, Automatically skip opening & ending: </label>
                <select name="aniSkip" id="">
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            </div>
            <div class="settingItems notImplemented">
                <button>Download</button><button>Copy URL</button>
            </div>
            <div class="settingItems notImplemented">
                <Button>Reset to default</Button>
            </div>                        
        </div>
    
        <div class="bufferOverlay"></div>
    
    
        <div class="vidcontrols">
            <div id="play-container">
                <span class="material-symbols-rounded">play_arrow</span>
            </div>
            <div id="progress-container">
                <div id="progressStatus">
                    <p style="float: left; margin: 0;">00:00</p>
                    <p style="float: left; margin: 0; margin-left: 10px; padding-left: 10px;border-left: 1px white dashed;">No data</p>
                    <p style="float: right; margin: 0;padding-left: 10px;border-left: 1px white dashed;">00:00</p>
                </div>
                <input type="range" value="" step="0.04167">
                <progress></progress>
            </div>
            <div id="volume-container">
                <span class="material-symbols-rounded">
                    volume_up
                </span>
                <input value="1" type="range" max="1" min="0" step="0.01">
            </div>
            <div id="controls-container">
                <span class="material-symbols-rounded">settings_cinematic_blur</span>
            </div>
            <div id="fullscreen-container">
                <span class="material-symbols-rounded">fullscreen</span>
            </div>
        </div>
    
        <video poster="${poster}" src="${source}" data-title="" 
        data-eps="" data-idmal="" data-opstart="" data-opend="" data-edstart="" data-edend=""></video>`

        // const simple = document.createElement("video")
        // simple.src = resource
        // simple.controls = true
        if (target.querySelector(".vidContainer")) {
            console.warn("element found, removing...");
            target.querySelector(".vidContainer").remove()
        }
        target.appendChild(container)
        loadPlayer(target)

        function loadPlayer(target) {
            const player = target.querySelector("video")
            let hidePlayerControlsTimer
            const player_element = target.querySelector(".vidContainer")
            const play_button = target.querySelector(".vidcontrols > #play-container > span")
            const progress_current = target.querySelector(".vidcontrols > #progress-container > div > p:nth-child(1)")
            const progress_status = target.querySelector(".vidcontrols > #progress-container > div > p:nth-child(2)")
            const progress_duration = target.querySelector(".vidcontrols > #progress-container > div > p:nth-child(3)")
            const progress_input = target.querySelector(".vidcontrols > #progress-container > input")
            const progress_bar = target.querySelector(".vidcontrols > #progress-container > progress")
            const mute_button = target.querySelector(".vidcontrols > #volume-container > span")
            const volume_input = target.querySelector(".vidcontrols > #volume-container > input")
            const setting_button = target.querySelector(".vidcontrols > #controls-container > span:nth-child(1)")
            const setting_menu = target.querySelector(".vidContainer > .vidSettingOverlay")
            const quality_setting = target.querySelector(".vidContainer > .vidSettingOverlay > .settingItems > #qualitySelect")
            const fullscreen_button = target.querySelector(".vidcontrols > #fullscreen-container > span")
            const buffer_overlay = target.querySelector(".vidContainer > .bufferOverlay")
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
                player.currentTime = mediaTime
                // Now you can use the value and text as needed
                console.log("Selected option value: " + value);
                console.log("Selected option text: " + text);
            });
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
                togglePlay("Playing")
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
            }
            // Player playing
            player.onplaying = function() {
                buffer_overlay.style["display"] = "none"
                // console.log("onplaying");
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

                hideControls()
                // togglePlay()
            }
            // Player ended
            player.onended = function() {
                buffer_overlay.style["display"] = "grid"
                progress_status.innerHTML = `Data Ended`
                console.log("onended");

                play_button.innerHTML = "play_arrow"

                // togglePlay()
            }
            function togglePlay(state){
                try {
                    console.log("togglePlay");

                    if (player.readyState>=3){
                        if (player.paused) {
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
                        // data for the current and at least the next frame is available
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
                } catch (error) {
                    console.error(error);
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

                        mediaTime = player.currentTime
        
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }


            // return simple
    },qualities: function(array){
        const quality_setting = document.querySelector(".vidContainer > .vidSettingOverlay > .settingItems > #qualitySelect") 
        const defQuality = [
            {
                link:"https://",
                name:"720"
            }
        ]
        // Clear quality setting
        quality_setting.innerHTML = ""
    
        // console.log("Available Server", servers);
        // console.log("Sources: ", sources);
        console.log("quality: ",array);

        array.forEach((quality,i) => {
            console.log(quality);

            // Create a new video quality option element
            var option = document.createElement("option");
            option.value = `${quality.link}`;
            option.textContent = `${quality.name}`;

            // if (data.attributes["size"].value == defaultQuality) {
            //     option.selected = true
            //     player.src = data.attributes["src"].value
            // }else{
            //     option.selected = true
            //     player.src = data.attributes["src"].value
            // }
            console.warn("adding quality: ",quality);
            quality_setting.appendChild(option);
        });
    }
}

// Function to load an external CSS file
function loadCSS(url) {
    return new Promise((resolve, reject) => {
        // Create a <link> element
        const link = document.createElement('link');

        // Set the attributes for the <link> element
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;

        // Append the <link> element to the <head> section
        // document.head.appendChild(link);

        const glink = document.createElement('link')
        glink.rel = 'stylesheet';
        glink.type = 'text/css';
        glink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'

        document.head.appendChild(glink)
        // Resolve the promise when the CSS is loaded
        glink.onload = () => resolve(document.head.appendChild(link));
        glink.onerror = () => reject(new Error(`Failed to load CSS file: ${url}`));
    });
}

loadCSS("../../../projects/modules/mediaPlayer.css")