function usersong() {
    // var songmsg = 'Now Playing\n'+songname+' by '+channelname+"\nhttps://youtu.be/"+player.getVideoData().video_id;
    var songmsg = "\nNow Playing : "+playlistindex+"/200"+"\nhttps://youtu.be/"+player.getVideoData().video_id;
    
    var params = {
      username: "holoRadio",
      avatar_url: "https://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_64,w_64,q_auto/1369026/logo_square_qn4ncy.png",
      content: songmsg
    }
    
    fetch("https://discord.com/api/webhooks/871795497881440278/PGB-ytcBMwXtz27-t_2EMkz7MT8VtYGrucuDIR_etDDKTqq5FMnZj_iJeDSH0qlgOFez?wait=true", {
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
      console.log('POST: '+postid);
    }).catch (error => {
      console.log(error)
    })
    
    // alert('ok!');
}