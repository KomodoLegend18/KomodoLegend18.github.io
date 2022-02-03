function userjoin() {
    var joinmsg = ':green_circle: successfully attached website to webhook';
    var request = new XMLHttpRequest();
    request.open("POST", localStorage.hookID);

    request.setRequestHeader('Content-type', 'application/json');

    var params = {
      username: "holoRadio",
      avatar_url: "https://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_64,w_64,q_auto/1369026/logo_square_qn4ncy.png",
      content: joinmsg
    }

    request.send(JSON.stringify(params));
    // alert('ok!');
}
window.onload = userjoin;

window.onbeforeunload = function userleave() {
    var leavemsg = ':red_circle: user attempted to leave the website';
    var request = new XMLHttpRequest();
    request.open("POST", localStorage.hookID);

    komocount=0

    request.setRequestHeader('Content-type', 'application/json');

    var params = {
      username: "holoRadio",
      avatar_url: "https://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_64,w_64,q_auto/1369026/logo_square_qn4ncy.png",
      content: leavemsg
    }

    request.send(JSON.stringify(params));
    // alert('ok!');
    return 'are you leaving?';
}

function usersong() {
    // var songmsg = 'Now Playing\n'+songname+' by '+channelname+"\nhttps://youtu.be/"+player.getVideoData().video_id;
    var songmsg = "\nNow Playing "+playlistindex+"/200 :"+"\nhttps://youtu.be/"+player.getVideoData().video_id;
    
    var params = {
      username: "holoRadio",
      avatar_url: "https://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_64,w_64,q_auto/1369026/logo_square_qn4ncy.png",
      content: songmsg
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
    }).catch (error => {
      console.log(error)
    })
    
    // alert('ok!');
}