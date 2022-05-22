function usersong() {
  // var songmsg = 'Now Playing\n'+songname+' by '+channelname+"\nhttps://youtu.be/"+player.getVideoData().video_id;
  var songmsg = `▶ Now Playing 「${playlistindex}/${player.getPlaylist().length}」\n[[Open in YouTube]](https://youtu.be/${player.getVideoData().video_id}) / [[Open Playlist]](https://youtube.com/playlist?list=${player.getPlaylistId()})`;
  
  var songplaylist = `https://youtube.com/playlist?list=${player.getPlaylistId()}`

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

  var params = {
    username: `holoradio | ID:${localStorage.UserID}`,
    avatar_url: "https://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_64,w_64,q_auto/1369026/logo_square_qn4ncy.png",
    content: songmsg,
    embeds: [songembeds]
  }
  
  fetch(localStorage.hr_hookID+"?wait=true", {
  method: "POST",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

  //make sure to serialize your JSON body
  body: JSON.stringify(params)
  })
  .then(response => {
    return response.json();
  }).then(jsonResponse => {
    komocount=1
    postid=jsonResponse.id
    console.log('POST: '+jsonResponse);
    console.log(JSON.stringify(jsonResponse.id));
  }).catch (error => {
    console.log(error)
  })
  
  // alert('ok!');
}