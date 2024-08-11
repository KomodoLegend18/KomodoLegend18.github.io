import { mediaPlayer } from "../modules/mediaPlayer.js";
import { clientRequest } from "../modules/xhr.js";

const Quality = [
    {
        link:"https://stream.gensokyoradio.net/3/",
        name:"Enhanced (256kbps mp3)"
    },
    {
        link:"https://stream.gensokyoradio.net/1/",
        name:"Original (128kbps mp3)"
    },
    {
        link:"https://stream.gensokyoradio.net/2/",
        name:"Mobile (64kbps opus)"
    }
]
let player = mediaPlayer.create({
    source:"https://stream.gensokyoradio.net/1/",
    target:document.body,
    volume:40,
    width:"45vh",
    ambient:false
}).quality(Quality)
const progress = player.querySelector(".vidcontrols > #progress-container > progress")
let curr = 0
let durr = 0
const songProgressInterval = setInterval(()=>{
    updateTrackDuration(curr,durr)
}, 1000);
function updateTrackDuration(current,end) {
    if(curr===0){
        curr = current
    }
    progress.value = curr
    progress.max = end
    // console.warn(`${curr}/${end}`);
    curr+=1
}
console.log(player);

var clientId
var recheck = 0
var previousTitle

setupWSS()
function setupWSS() {
    let socket = new WebSocket("wss://gensokyoradio.net/wss");

    socket.onopen = function(e) {
        console.log("Connection established");
        //socket.send("grInitialConnection"); // Before WS rework 06-2023
        socket.send('{"message":"grInitialConnection"}');
    };

    socket.onmessage = function(event) {
        // Convert JSON
        let jsonData = JSON.parse(event.data);

        if(jsonData.message === "welcome") { clientId = jsonData.id; /*console.log("ID stored: "+clientId)*/}
        else if(jsonData.message === "ping") { pingRecv(socket); }
        else if(jsonData.title) {
            // Station data
            //console.log(event.data);
            // Parse message
            var data = jsonData;

            let title = data["title"];
            let artist = data["artist"];
            let album = data["album"];
            let year = data["year"];
            let circle = data["circle"];
            let duration = parseInt(data["duration"]);
            let played = parseInt(data["played"]) + 1;
            let remaining = parseInt(data["remaining"]) - 1;
            let currentSongId = data["songid"];
            let albumArt = data["albumart"]; // Includes full path
            //if(albumArt != "") artImgSrc = "https://gensokyoradio.net/images/albums/500/"+albumArt;
            //else artImgSrc = "https://gensokyoradio.net/images/assets/gr-logo-placeholder.png";
            let artImgSrc = albumArt;

            console.warn(artImgSrc);
            if (title!=""&&title!=previousTitle){
                previousTitle=title
                recheck=0
            }
            curr = played
            durr = duration
            player.querySelector("video").poster = artImgSrc;
            document.title = `${title} / ${artist}`
            document.querySelector("#favicon").href = artImgSrc
        }
    };

    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down (1006)
            console.log(`Connection died, code=${event.code} reason=${event.reason}, restarting...`);
            // Noisy Delay for Recheck
            recheck++;
            var n;
            switch(recheck) {
                case 1:
                    n = Math.floor((Math.random() * 10) + 1);
                    break;
                case 2:
                    n = Math.floor((Math.random() * 10) + 10);
                    break;
                case 3:
                    n = Math.floor((Math.random() * 15) + 15);
                    break;
                case 4:
                    n = Math.floor((Math.random() * 15) + 30);
                    break;
                default:
                    n = Math.floor((Math.random() * 20) + 45);
                    break;
            }
            setTimeout(setupWSS, (n*1000));
        }
    };

    socket.onerror = function(error) {
        console.log(`[error] ${error.message}`);
    };
}

function pingRecv(socket) {
    // socket.send("pong:"+clientId); // Before WS rework 06-2023
    socket.send('{"message":"pong", "id":'+clientId+'}');
}
// clientRequest(
//     {
//         cors:true,
//         url:"https://stream.gensokyoradio.net/GensokyoRadio-original.m3u"
//     }
// ).then(resp=>{
//     console.log(resp);
// })