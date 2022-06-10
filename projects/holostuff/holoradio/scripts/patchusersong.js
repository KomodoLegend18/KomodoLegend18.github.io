function patchusersong() {
    // var songmsg = 'Now Playing\n'+songname+' by '+channelname+"\nhttps://youtu.be/"+player.getVideoData().video_id;
    var patchedsongmsg = `▶ Now Playing 「${playlistindex}/${player.getPlaylist().length}」\n[[Open in YouTube]](https://youtu.be/${player.getVideoData().video_id}) / [[Open Playlist]](https://youtube.com/playlist?list=${player.getPlaylistId()})`;
    var songplaylist = `https://youtube.com/playlist?list=${player.getPlaylistId()}`
    
    var patchurl = localStorage.hr_hookID+'/messages/'+postid

    var date = new Date();

    var songembeds = {
      title:player.getVideoData().title,
      url: `https://youtu.be/${player.getVideoData().video_id}`,
      description:`[Playlist](${songplaylist})`,
      image: {
        url: "https://i.ytimg.com/vi/"+player.getVideoData().video_id+"/maxresdefault.jpg"
      },
      author:{
        name:`holoRadio | ${player.getVideoData().author}`,
        url: `https://komodolegend18.github.io/projects/holostuff/holoradio`
      },
      color: 5814783,
      timestamp: `${date.toISOString()}`,
      footer: {
        text: `UID ${localStorage.UserID}`
      },
      thumbnail: {
        url: `${channelphoto}`
      }
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
      console.log(JSON.stringify(jsonResponse))
    }).catch (error => {
      console.log(error)
    })
    // alert('ok!');
}