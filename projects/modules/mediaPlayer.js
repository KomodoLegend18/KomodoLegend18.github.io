import { randomString } from "./random.js";

let mediaTime = 0
export const mediaPlayer = {
    create: function (options){
        const {
            source,
            poster="",
            target,
            width = "70vw",
            ambient=true,
            volume=100
        } = options;
        if (!source){
            throw "Source not provided"
        } else if (!target){
            throw "Target not specified"
        }
        const PlayerID = randomString(6); //generate unique id
        const container = document.createElement("div")
        container.className = "vidContainer"
        container.setAttribute("PlayerID",PlayerID)
        container.style.width = width
        container.style.boxShadow = "0px 0px 5px 2px rgba(0, 0, 0, 0.267)"
        container.innerHTML = `
        <div class="vidSettingOverlay">
            <div class="settingItems">
                <label for="vidQuality">Quality: </label>
                <select name="vidQuality" id="qualitySelect">
                    <option value="" selected hidden>No data</option>
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
                <input value="${volume/100}" type="range" max="1" min="0" step="0.01">
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
        target.appendChild(container)
        // const simple = document.createElement("video")
        // simple.src = resource
        // simple.controls = true
        if (target.querySelectorAll(`.vidContainer[playerid="${PlayerID}"]`).length>1) {
            console.warn("element found, removing...");
            const elems = target.querySelectorAll(`.vidContainer[playerid="${PlayerID}"]`)
            for (let i = 0; i < elems.length; i++) {
                elems[i].remove()                
            }
        }

        playerEvents(container,options)

        container.quality = function (array){
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
                console.log(quality,i);
    
                // Create a new video quality option element
                var option = document.createElement("option");
                option.value = `${quality.link}`;
                option.textContent = `${quality.name}`;

                if (i===0) {
                    option.selected = true
                }
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
            return this;
        }

        return container
        // return simple
    }
}

function playerEvents(player,options) {
    let hidePlayerControlsTimer
    const media = player.querySelector("video")
    const play_button = player.querySelector(".vidcontrols > #play-container > span")
    const progress_current = player.querySelector(".vidcontrols > #progress-container > div > p:nth-child(1)")
    const progress_status = player.querySelector(".vidcontrols > #progress-container > div > p:nth-child(2)")
    const progress_duration = player.querySelector(".vidcontrols > #progress-container > div > p:nth-child(3)")
    const progress_input = player.querySelector(".vidcontrols > #progress-container > input")
    const progress_bar = player.querySelector(".vidcontrols > #progress-container > progress")
    const mute_button = player.querySelector(".vidcontrols > #volume-container > span")
    const volume_input = player.querySelector(".vidcontrols > #volume-container > input")
    const setting_button = player.querySelector(".vidcontrols > #controls-container > span:nth-child(1)")
    const setting_menu = player.querySelector(".vidSettingOverlay")
    const quality_setting = player.querySelector(".vidSettingOverlay > .settingItems > #qualitySelect")
    const fullscreen_button = player.querySelector(".vidcontrols > #fullscreen-container > span")
    const buffer_overlay = player.querySelector(".bufferOverlay")

    play_button.addEventListener("click", function(e){
        console.log(e);
        e.stopPropagation();
        playerAction(player).togglePlayback()
    })
    player.addEventListener('click', function(e) {
        console.log(e);
        e.stopPropagation();
        playerAction(player).togglePlayback()
    });
    progress_input.addEventListener("input", function(e){
        e.stopPropagation();
        console.log(e);

        const seek = e.target.value
        media.currentTime = seek

        playerAction(player).updateProgress()
        progress_bar.value = seek + 10
        progress_input.attributes[1].value = `${seek}`
    })
    progress_input.addEventListener("click", function(e){
        e.stopPropagation();
        console.log(e);
    })
    mute_button.addEventListener("click",function(e){
        e.stopPropagation();
        console.log(e);

        playerAction(player).toggleMute();
    })
    volume_input.addEventListener("input",function(e){
        e.stopPropagation();
        // console.log(e);

        const vol = e.target.value
        media.volume = vol
    })
    volume_input.addEventListener("click",function(e){
        e.stopPropagation();
        // console.log(e);
    })
    setting_button.addEventListener("click", function(e){
        e.stopPropagation();

        playerAction(player).toggleSettings();
    })
    quality_setting.addEventListener("change", function(e) {
        e.stopPropagation();

        // The value of the selected option
        var value = e.target.value;

        // The text of the selected option
        var text = e.target.options[e.target.selectedIndex].text;

        media.src = value
        media.currentTime = mediaTime
        // Now you can use the value and text as needed
        console.log("Selected option value: " + value);
        console.log("Selected option text: " + text);
    });
    quality_setting.addEventListener("click", function(e) {
        e.stopPropagation();
    });
    fullscreen_button.addEventListener("click", function(e){
        e.stopPropagation();

        playerAction(player).toggleFullscreen();
    })
    // Skip opening / 85s
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
            media.currentTime += 85;
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
            media.currentTime -= 5;
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
            media.currentTime += 5;
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
            playerAction(player).togglePlayback()
            
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
            playerAction(player).toggleMute();
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
            playerAction(player).toggleSettings();
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
            playerAction(player).toggleFullscreen();
        }
    });
    // Toggle controls visibility
    player.addEventListener('mousemove', function(e) {
        e.stopPropagation();

        playerAction(player).toggleControls();
    });
    player.addEventListener('mouseout', function(e) {
        e.stopPropagation();

        playerAction(player).toggleControls(true);
    });

    // Try to load video
    media.onloadstart = function() {
        buffer_overlay.style["display"] = "grid"
        // player.poster = poster
        progress_status.innerHTML = `Loading data`
        // console.log("onloadstart");
    }
    // data loaded
    media.onloadeddata = function() {
        buffer_overlay.style["display"] = "none"
        progress_status.innerHTML = `Data ready`
        // console.log("onloadeddata");
    }
    // Video can start
    media.oncanplay = function(){
        playerAction(player).updateProgress()
        playerAction(player).togglePlayback("Playing")
        // progress_status.innerHTML = `Can play data`
        buffer_overlay.style["display"] = "none"
        // player.poster = ""

        // console.log("oncanplay");
        // skipOP()
    }
    // Update progress display
    media.ontimeupdate = function() {
        // console.log(player.currentTime,player.duration);
        playerAction(player).updateProgress()
    };
    // Downloading video / buffer
    media.onprogress = function() {
        // buffer_overlay.style["display"] = "none"
        // progress_status.innerHTML = `Downloading data`
        // console.log("onprogress");
    }
    // Can't load video
    media.onerror = function(e) {
        buffer_overlay.style["display"] = "grid"
        // player.poster = poster
        progress_status.innerHTML = `No Data`
        console.error(`[player.onerror] Video Player Error\n`,e);
    }
    // Player waiting to play
    media.onwaiting = function() {
        buffer_overlay.style["display"] = "grid"
        progress_status.innerHTML = `Waiting`
        // hideControls()
        // console.log("onwaiting");
    }
    // Player playing
    media.onplaying = function() {
        buffer_overlay.style["display"] = "none"
        // console.log("onplaying");
    }
    media.onplay = function() {
        // buffer_overlay.style["display"] = "none"
        // console.log("onplay");
        playerAction(player).toggleControls()
        // togglePlay()
    }
    // Player paused
    media.onpause = function() {
        buffer_overlay.style["display"] = "none"
        // console.log("onpause");

        playerAction(player).toggleControls()
        // togglePlay()
    }
    // Player ended
    media.onended = function() {
        buffer_overlay.style["display"] = "grid"
        progress_status.innerHTML = `Data Ended`
        console.log("onended");

        play_button.innerHTML = "play_arrow"

        // togglePlay()
    }
    const playerAction = (player) => ({
        togglePlayback: function (state) {
            try {
                const media = player.querySelector("video")
                media.volume = volume_input.value

                console.log("togglePlay");
                if (media.readyState>=3){
                    if (media.paused) {
                        console.log("paused/ended > play");
                        progress_status.innerHTML = `Playing`
                        try {
                            media.play();
                        } catch (error) {
                            console.error(error);
                        }
            
                        // Icon
                        play_button.innerHTML = "pause"            
                    } else {
                    // data for the current and at least the next frame is available
                        console.log("playing > pause");
                        media.pause();
                        progress_status.innerHTML = `Paused`
            
                        // Icon
                        play_button.innerHTML = "play_arrow"
                    }
                }
            
                if(state=="Playing"){
                    try {
                        media.play();
                    } catch (error) {
                        console.error(error);
                    }
                    progress_status.innerHTML = `Playing`
                    // player.muted = false;
                    
                    // Icon
                    play_button.innerHTML = "pause"
                }else if(state=="Paused"){
                    media.pause();
                    progress_status.innerHTML = `Host Paused`
                    // player.muted = false;
            
                    // Icon
                    play_button.innerHTML = "play_arrow"
                }
            } catch (error) {
                console.error(error);
            }
        },
        toggleMute:function (){
            const media = player.querySelector("video")
            if (media.muted){
                mute_button.innerHTML = "volume_up"
                media.muted = false
            } else {
                mute_button.innerHTML = "volume_off"
                media.muted = true
            }
        },
        toggleSettings:function (){
            if (setting_menu.style["display"]=="block"){
                setting_menu.style["display"] = "none"
            } else {
                setting_menu.style["display"] = "block"
            }
        },
        toggleControls:function (isForced) {
            clearTimeout(hidePlayerControlsTimer);
            // console.log("[hideControls] paused: ",player.paused);
            if(!media.paused){
                player.querySelector(".vidcontrols").classList.remove("hidden");
                player.style.cursor = "default"
                if (document.fullscreenElement) {
                    document.fullscreenElement.style.cursor = "default"
                } else if (document.webkitFullscreenElement) {
                    document.webkitFullscreenElement.style.cursor = "default"
                }
    
                if (!isForced||isForced===false) {
                    hidePlayerControlsTimer = setTimeout(function() {
                        player.querySelector(".vidcontrols").classList.add("hidden");
                        player.style.cursor = "none"
                        // document.body.style.cursor = "none"
                        if (document.fullscreenElement) {
                            document.fullscreenElement.style.cursor = "none"
                        } else if (document.webkitFullscreenElement) {
                            document.webkitFullscreenElement.style.cursor = "none"
                        }
                    }, 2000);
                }else{
                    player.querySelector(".vidcontrols").classList.add("hidden");
                        player.style.cursor = "none"
                        // document.body.style.cursor = "none"
                        if (document.fullscreenElement) {
                            document.fullscreenElement.style.cursor = "none"
                        } else if (document.webkitFullscreenElement) {
                            document.webkitFullscreenElement.style.cursor = "none"
                        }
                }
            }else if(media.paused){
                player.querySelector(".vidcontrols").classList.remove("hidden");
                player.style.cursor = "default"
                if (document.fullscreenElement) {
                    document.fullscreenElement.style.cursor = "default"
                } else if (document.webkitFullscreenElement) {
                    document.webkitFullscreenElement.style.cursor = "default"
                }
            }
        },
        toggleFullscreen:function () {
            if (document.fullscreenElement) {
                fullscreen_button.innerHTML = "fullscreen"
                document.exitFullscreen();
            } else if (document.webkitFullscreenElement) {
                // Need this to support Safari
                fullscreen_button.innerHTML = "fullscreen"
                document.webkitExitFullscreen();
            } else if (player.webkitRequestFullscreen) {
                // Need this to support Safari
                fullscreen_button.innerHTML = "fullscreen_exit"
                player.webkitRequestFullscreen();
            } else {
                fullscreen_button.innerHTML = "fullscreen_exit"
                player.requestFullscreen();
            }
        },
        updateProgress:function (){
            try {
                if(media.duration && media.duration!=Infinity){
                    console.warn(media.duration);
                    // Update Player Progress
                    // # Progress Bar
                    progress_bar.value = media.currentTime
                    progress_bar.max = media.duration
                    // # Progress Input
                    progress_input.attributes[1].value = `${media.currentTime}`
                    progress_input.value = media.currentTime
                    progress_input.max = media.duration
                    // # Progress Text
                    progress_current.innerHTML = new Date(media.currentTime*1000).toISOString().substr(11, 8);
                    progress_status.innerHTML = `${media.currentTime}/${media.duration}, Frame: ${Math.round(media.currentTime*24)}`
                    progress_duration.innerHTML = new Date(media.duration*1000).toISOString().substr(11, 8);
    
                    mediaTime = media.currentTime
                }else{
                    // If duration is "infinite" aka streaming
    
                    // Update Player Progress
                    // # Progress Bar
                    // progress_bar.value = media.currentTime
                    // progress_bar.max = media.currentTime
                    // # Progress Input
                    progress_input.style = "pointer-events:none;"
                    // progress_input.attributes[1].value = `${media.currentTime}`
                    // progress_input.value = media.currentTime
                    // progress_input.max = media.currentTime
                    // # Progress Text
                    progress_current.innerHTML = "Live";
                    // progress_status.innerHTML = `${media.currentTime}/${media.duration}, Frame: ${Math.round(media.currentTime*24)}`
                    progress_duration.innerHTML = "Streaming";
    
                    mediaTime = media.currentTime
                }
            } catch (error) {
                console.error(error);
            }
            if (options.ambient){
                let v = player
                const cElem = document.createElement("canvas")
                cElem.style = `filter:blur(50px);position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(1);`
                target.appendChild(cElem)
                let c = target.querySelector("canvas");
                let ctx = c.getContext("2d");
                let i;
                function draw() {
                c.width = container.getBoundingClientRect().width;
                c.height = container.getBoundingClientRect().height; 
                i = window.requestAnimationFrame(draw)
                ctx.drawImage(v, 0, 0, c.width, c.height)
                }
        
                v.addEventListener("loadeddata", function() {
                draw()
                }, false);
                v.addEventListener("play", function() {
                draw()
                }, false);
                v.addEventListener("pause", function() {
                window.cancelAnimationFrame(i);
                i = undefined;
                }, false);
                v.addEventListener("ended", function() {
                window.cancelAnimationFrame(i);
                i = undefined;
                }, false); 
            }
        }
    })
    function playerActions(player) {
        try {
            const media = player.querySelector("video")
            
            
        } catch (error) {
            console.error(error);
        }
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