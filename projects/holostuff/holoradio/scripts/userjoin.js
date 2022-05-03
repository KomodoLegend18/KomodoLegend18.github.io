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
// window.onload = userjoin()