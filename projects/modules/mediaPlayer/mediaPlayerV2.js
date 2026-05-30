import { randomString } from "../random.js";

const definition = {
    template:{
        settingEntry:""
    },
    styles:{
        boxShadow:"0px 0px 5px 2px rgba(0,0,0,0.267)"
    },
    elements:{
        container:"kmdPlayerContainer",
        playerid:"PlayerID"
    },
}

export const mediaPlayer = {
    create: function (options){
        const {
            source,
            target,
            width = "70vw",
            poster="",
            volume=100
        } = options
        
        // Validate options
        try {
            if (!source) {
                throw new Error("Source not defined!");
            } else if (!target) {
                throw new Error("Target not defined!");
            }

            loadCss()

            const randomPlayerID = randomString(6);

            const playerContainer = document.createElement("div");
            playerContainer.className = definition.elements.container
            playerContainer.setAttribute(definition.elements.playerid,randomPlayerID);
            playerContainer.style.width = width;
            playerContainer.style.boxShadow = definition.styles.boxShadow;
            playerContainer.style.aspectRatio = 16/9
            playerContainer.style.overflow = "hidden"
            playerContainer.style.position = "relative"

            const playerVideo = document.createElement("video")
            playerVideo.poster = poster
            playerVideo.src = source
            playerVideo.style.width = "100%"
            playerVideo.style.height = "100%"
            playerVideo.style.position = "absolute"
            playerVideo.style.zIndex = "1"
            playerContainer.appendChild(playerVideo)

            const playerControls = document.createElement("div")
            playerControls.style.width = "100%"
            playerControls.style.height = "35px"
            playerControls.style.background = "gray"
            playerControls.style.position = "absolute"
            playerControls.style.zIndex = "2"
            playerControls.style.bottom = "0"
            playerContainer.appendChild(playerControls)

            const iconPlay = document.createElement("span")
            iconPlay.className = "material-symbols-rounded"
            iconPlay.innerText = "play_arrow"
            playerControls.appendChild(iconPlay)
            


            target.appendChild(playerContainer)
            playerVideo.addEventListener("pointerup",togglePlayback)
            
            let player = {
                container : playerContainer,
                media : playerVideo
            }
            console.log(target);
            return player
            
        } catch (error) {
            console.error("Error creating mediaPlayer",{cause:error});
        }
    },
    test: function (options){
        
    }
}

function loadCss() {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,200&icon_names=pause,play_arrow,volume_up&display=block"
    document.head.appendChild(link)

    const css = document.createElement("style")
    css.innerHTML = `.material-symbols-rounded{
        height:100%;
        aspect-ratio:1/1;
        font-size:35px;
        cursor:pointer;
    }`
    document.head.appendChild(css)
}

function togglePlayback(e) {
    console.log(e,this);
    // console.log(this.tagName);
    e.stopPropagation()
    if(this.tagName==="VIDEO"){
        // console.log(this.paused);
        if(this.paused){
            this.play()
        }else{
            this.pause()
        }
    }
}