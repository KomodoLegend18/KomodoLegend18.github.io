function UserIDCheck(){
    if (localStorage.UserID == null){
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 6; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        console.log(`UserID does not exist, Generating New UserID:\n${result}\nUserID is used as display name in Discord Webhook`);
        localStorage.setItem("UserID", result);
        return result;      
    } else {
        console.log("UserID exist, Current UserID:",localStorage.UserID);
        // let user_id = prompt("Input Name");
    }
}
function ResetUserID(){
    // let user_id = (Math.random()).toString(36).substring(6);
    // console.log("New UserID: ", user_id);
    // localStorage.setItem("UserID", user_id);  

    // let user_id = prompt("Input Name");
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log("New UserID:",result);
    localStorage.setItem("UserID", result);
    return result;
}
function DeleteUserID(){
    localStorage.removeItem("UserID");
    localStorage.removeItem("cachedwebhookpostid");
}