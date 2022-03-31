function usersong() {
  // var songmsg = 'Now Playing\n'+songname+' by '+channelname+"\nhttps://youtu.be/"+player.getVideoData().video_id;
  var songmsg = "\nNow Playing "+playlistindex+"/"+player.getPlaylist().length+":\nhttps://youtu.be/"+player.getVideoData().video_id+" from: https://youtube.com/playlist?list="+player.getPlaylistId();;
  
  var songembeds = {
    title:player.getVideoData().title,
    description:"there",
    image: {
      url: "https://i.ytimg.com/vi/"+player.getVideoData().video_id+"/hqdefault.jpg"
    },
    author:{
      name:"holoradio"
    },
    color: 5814783
  }

  var params = {
    username: "holoRadio",
    avatar_url: "https://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_64,w_64,q_auto/1369026/logo_square_qn4ncy.png",
    content: songmsg,
    embeds: [songembeds]
  }
  
  fetch(localStorage.hookID+"?wait=true", {
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