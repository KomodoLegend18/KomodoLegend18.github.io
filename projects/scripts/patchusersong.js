function patchusersong() {
    // var songmsg = 'Now Playing\n'+songname+' by '+channelname+"\nhttps://youtu.be/"+player.getVideoData().video_id;
    var patchedsongmsg = "\nNow Playing "+playlistindex+"/"+player.getPlaylist().length+" :"+"\nhttps://youtu.be/"+player.getVideoData().video_id+" from: https://youtube.com/playlist?list="+player.getPlaylistId();
    
    var patchurl = localStorage.hookID+'/messages/'+postid

    var songembeds = {
      title:player.getVideoData().title,
      description:`[Playlist](${songplaylist})`,
      image: {
        url: "https://i.ytimg.com/vi/"+player.getVideoData().video_id+"/maxresdefault.jpg"
      },
      author:{
        name:"holoradio"
      },
      color: 5814783
    }
  
    var patchparams = {
      username: "holoRadio",
      avatar_url: "https://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_64,w_64,q_auto/1369026/logo_square_qn4ncy.png",
      content: patchedsongmsg,
      embeds: [songembeds]
    }

    fetch(patchurl, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },

    //make sure to serialize your JSON body
    body: JSON.stringify(patchparams)
    })
    .then(response => {
      return response.json();
    }).then(jsonResponse => {
      console.log('Patched: '+jsonResponse);
    }).catch (error => {
      console.log(error)
    })
    // alert('ok!');
}