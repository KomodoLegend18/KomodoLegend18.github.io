function patchusersong() {
    // var songmsg = 'Now Playing\n'+songname+' by '+channelname+"\nhttps://youtu.be/"+player.getVideoData().video_id;
    var patchedsongmsg = "\nNow Playing : "+playlistindex+"/200"+"\nhttps://youtu.be/"+player.getVideoData().video_id;
    
    var patchurl = 'https://discord.com/api/webhooks/871795497881440278/PGB-ytcBMwXtz27-t_2EMkz7MT8VtYGrucuDIR_etDDKTqq5FMnZj_iJeDSH0qlgOFez/messages/'+postid

    var patchparams = {
      content: patchedsongmsg
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