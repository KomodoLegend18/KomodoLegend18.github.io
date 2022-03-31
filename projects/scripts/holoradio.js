    /* Replace This Code - get Value from playlist page and place it here */
    var playlistId = "PLowuZgbBgs5XvlwDBAf5eBuL1BQRQpaGE";
    var playlistId2 = "PLowuZgbBgs5W1do79sWC1nYHsmbc7pW5M";
    var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";

    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;

    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            //height: '100%',
            //width: '100%',
            playerVars: {
                autoplay: 1,        // Auto-play the video on load
                controls: 1,        // Show pause/play buttons in player
                modestbranding: 1,  // Hide the Youtube Logo
                loop: 1,            // Run the video in a loop
                fs: 1,              // Hide the full screen button
                cc_load_policy: 1, // Hide closed captions
                iv_load_policy: 3,  // Hide the Video Annotations
                autohide: 0,         // Hide video controls when playing
                rel: 0,              // hide related vids
                widget_referrer: 'https://komodolegend18.github.io/projects/Holoradio',
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError,
            }

        });
    }
    var playlistArray;
    var playListArrayLength;
    var maxNumber;

    var oldNumber = 0;
    var NewNumber = 0;
    var komocount = 0;

    var channelname = 'null';
    var songname = 'null';
    

    // function newRandomNumber() {
    //     oldNumber = NewNumber;
    //     NewNumber = Math.floor(Math.random() * maxNumber);
    //     if (NewNumber == oldNumber) {
    //         newRandomNumber();
    //     } else {
    //         return NewNumber;
    //     }
    //     if (NewNumber==maxNumber){
    //         newRandomNumber();
    //     }
    // }

function onPlayerReady(event) {
    setTimeout(function() {
        event.target.setShuffle({'shufflePlaylist' : true});
    }, 1000);
    player.loadPlaylist({
        'listType': 'playlist',
        'list': playlistId
    });
    setTimeout(function() {
        event.target.playVideoAt(0);
    }, 1000);
    
    // event.target.playVideo();
    // event.target.mute();
    // setTimeout(function(){
    //     event.target.unMute(); 
    // }, 2500);
}

var firstLoad = true;
function onPlayerStateChange(event) {
    // getVideoData documentation is gone, so here's some available parameters that i found
    // title, video_id, author, video_quality, video_quality_features, list
    // document.title = "HOLORADIO || "+player.getVideoData().title+" || "+player.getVideoData().author;
    // document.title = "Welcome to HOLORADIO";
    document.getElementById("mobiletext").innerHTML =player.getVideoData().title;

    fetch('https://holodex.net/api/v2/videos/'+player.getVideoData().video_id, { 
        method: 'GET'
    })
    .then(function(response) { return response.json(); })
    .then(function(json) {
    // use the json below
    // print json to console
    console.log(json);
    // set variable channelname
    channelname=player.getVideoData().author;
    channelname=json.channel.english_name;
    // print channel name to console
    // console.log(channelname);
    // set variable songname
    songname=player.getVideoData().title;
    songname=json.songs[0].name;
    // print song name to console
    // console.log(songname);
    });
    

    // console.log("event status="+event.data);
    // console.log("Counter="+komocount);

    // console.log(player.getDuration());
    //window.location.reload();
    //console.log("NewNum="+NewNumber);
    //console.log("OldNum="+oldNumber);
    //console.log("array="+playlistArray);
    // YT.PlayerState.ENDED //backup

    // If Video Played, Show this in console
    if (event.data == 1){         
        // Show now playing in Dev Console f12
        console.log('Now Playing :\n%c'+songname+"\nby "+channelname, 'background: rgba(56, 255, 228, 0.5); color: black; font-size: 200%');

        

        // Set Now Playing Song as Page Title
        document.title = "Now Playing : "+songname+" || "+channelname;

        // Set Title after 10 Secs
        setTimeout(function() {
            document.title = "HOLORADIO || "+songname+" || "+channelname;
        }, 10000);

        // Add ID of current song to button
        document.getElementById("jsurl").innerHTML =player.getVideoData().author+" | Open Current Song in YouTube";
        playlistindex = player.getPlaylistIndex()+1
        // Get URL of current song
        document.getElementById("jsurl").href="https://youtu.be/"+player.getVideoData().video_id;
        // Get Max Resolution Thumbnail of Current Song and put it in sidebar
        document.getElementById("jsimg").src="https://i.ytimg.com/vi/"+player.getVideoData().video_id+"/hqdefault.jpg";

        // post to webhook
        if (komocount==0){
            usersong();
        }
        if (komocount==1){
            patchusersong();
        }
        
    }
    if (event.data == 2){
                document.title = player.getVideoData().title+" || "+player.getVideoData().author;
    }

    // If Playlist end, do this
    if (event.data == YT.PlayerState.ENDED) {
        // komocount=komocount+201;
        // Play next video after playlist end
        // player.playVideoAt(1);
        player.stopVideo()
        player.loadPlaylist({
                'listType': 'playlist',
                'list': playlistId2
        });
        setTimeout(function() {
            player.setShuffle({'shufflePlaylist' : true});
            player.playVideoAt(0);
            // player.cuePlaylist({
            //     'list': playlistId2
            // });
        }, 2*1000);
        
        console.log(event.data);
        
        // player.setShuffle({'shufflePlaylist' : true});
        // player.playVideo();
        
        console.log("Player state ended");
    }
    // Else, do this
    else {
        if (firstLoad && event.data == YT.PlayerState.PLAYING) {
            firstLoad = false;
            playlistArray = player.getPlaylist();
            playListArrayLength = playlistArray.length;
            maxNumber = playListArrayLength;
            NewNumber = newRandomNumber();
            komocount=komocount+1;
            player.playVideoAt(newRandomNumber());
            console.log("firstLoad && event.data == YT.PlayerState.PLAYING");
        }
    }
    // if (komocount>200){
    //     //window.location.reload();
    //     // window.location.replace("https://komodolegend18.github.io/projects/Holoradio2");
    // }
}

function onPlayerError(event) {
    console.log(event.data);
    player.nextVideo();
    // player.playVideoAt(newRandomNumber());   
}
// newPageTitle = player.getVideoUrl();
// document.title = newPageTitle;