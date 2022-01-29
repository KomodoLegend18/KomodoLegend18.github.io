function usersong() {
    // var songmsg = 'Now Playing\n'+songname+' by '+channelname+"\nhttps://youtu.be/"+player.getVideoData().video_id;
    var songmsg = "\nNow Playing : "+playlistindex+"/200"+"\nhttps://youtu.be/"+player.getVideoData().video_id;
    var request = new XMLHttpRequest();
    request.open("POST", "https://discord.com/api/webhooks/871795497881440278/PGB-ytcBMwXtz27-t_2EMkz7MT8VtYGrucuDIR_etDDKTqq5FMnZj_iJeDSH0qlgOFez?thread_id=935558529102790696");

    request.setRequestHeader('Content-type', 'application/json');

    var params = {
      username: "holoRadio",
      avatar_url: "https://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_64,w_64,q_auto/1369026/logo_square_qn4ncy.png",
      content: songmsg
    }

    request.send(JSON.stringify(params));
    // alert('ok!');
}