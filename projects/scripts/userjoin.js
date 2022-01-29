function userjoin() {
    var joinmsg = ':green_circle: user visited the website';
    var request = new XMLHttpRequest();
    request.open("POST", "https://discord.com/api/webhooks/871795497881440278/PGB-ytcBMwXtz27-t_2EMkz7MT8VtYGrucuDIR_etDDKTqq5FMnZj_iJeDSH0qlgOFez?thread_id=935558529102790696");

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
    request.open("POST", "https://discord.com/api/webhooks/871795497881440278/PGB-ytcBMwXtz27-t_2EMkz7MT8VtYGrucuDIR_etDDKTqq5FMnZj_iJeDSH0qlgOFez?thread_id=935558529102790696");

    request.setRequestHeader('Content-type', 'application/json');

    var params = {
      username: "holoRadio",
      avatar_url: "https://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_64,w_64,q_auto/1369026/logo_square_qn4ncy.png",
      content: leavemsg
    }

    request.send(JSON.stringify(params));
    // alert('ok!');
    return 'You have unsaved changes!';
}