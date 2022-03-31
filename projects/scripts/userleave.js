function userleave() {
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
    return undefined;
}
// window.onbeforeunload = userleave()