var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
//this function is called by the API
function onYouTubeIframeAPIReady() {
    //creates the player object
    player = new YT.Player('player');

    //subscribe to events
    player.addEventListener("onReady",       "onYouTubePlayerReady");
    player.addEventListener("onStateChange", "onYouTubePlayerStateChange");
}

function onYouTubePlayerReady() {
    // event.target.playVideo();
    let videoID = player.getVideoData()['video_id']
    let content = document.getElementById("player")
    console.log(videoID)
    content.remove()
    window.location.href = `https://www.youtube.com/live_chat?v=${videoID}`;
    // document.querySelector("body > div:nth-child(1)").innerHTML = `<iframe id="player" width="100%" height="100%" src="https://www.youtube.com/live_chat?v=${videoID}"  title="test" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
}


// checkEmbed()
// function checkEmbed(){
//     if(document.getElementById("iframe")){
    
//     } else {
//         setTimeout(() => {
//             checkEmbed()
//         }, 1000);
//     }
// }
