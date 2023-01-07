var getmsg = ""

var edited
var last_edited

const formCancel = document.querySelector('form');
    formCancel.addEventListener('submit', event => {
    event.preventDefault();
    ChatValidator()
});

function ChatValidator(){
    let regex = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi
    let content = document.getElementById("chat-input").value
    let content_trimmed = content.trim()
    let aElem = content_trimmed
    let link
    aElem = aElem.replace(regex,function(url) {
        link = url
        return `<a target='_blank' href='${url}'>${url}</a>`;
    })
    content_trimmed = aElem
    
    if (content_trimmed.includes("https://youtu.be/")==true||content_trimmed.includes("https://www.youtube.com/watch?v=")==true){
        let YTid = link.replace("https://youtu.be/","")
        YTid = YTid.replace("https://www.youtube.com/watch?v=","")
        console.log(YTid)
        if (YTid.length>0){
            content_trimmed = `<a target='_blank' href='${link}'>${link}</a><iframe width="853" height="480" src="https://www.youtube.com/embed/${YTid}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        }
        
    }
    

    content_trimmed = content_trimmed.replace(/["]/g, "'")
    content_trimmed = content_trimmed.replace("<script>", "")
    content_trimmed = content_trimmed.replace("</script>", "")
    content_trimmed.trim()
    // console.log(content)
    // console.log(content_trimmed)
    // console.log(content_trimmed.length)
    if(content_trimmed.length>0){
        document.getElementById("chat-input").placeholder = "Sending...";
        document.getElementById("chat-input").disabled = true;

        ChatSending(content_trimmed)
        document.getElementById("chat-input").value = "";
        setTimeout(function () { // simulate wait PATCH
            document.getElementById("chat-input").disabled = false;
            document.getElementById("chat-input").placeholder = "Chat";
        }, 2500);
    }
    return
}

function ChatSending(content){
    if (role=="host"){
        let id = host_chatID
        let embeds = JSON.parse(`{
            "description": "${content}",
            "color": 15597654,
            "author": {
                "name": "${host_username}",
                "icon_url": "${host_pfp}"
            }
        }`)
        PATCH(id,embeds).then(responseData => {
            // console.log(responseData)
            ChatBubble(host_pfp,content)
        }).catch(err => {
            console.log(err)
        })
    } else if (role=="client"){
        let id = client_chatID
        let embeds = JSON.parse(`{
            "description": "${content}",
            "color": 15597654,
            "author": {
                "name": "${client_username}",
                "icon_url": "${client_pfp}"
            }
        }`)
        PATCH(id,embeds).then(responseData => {
            // console.log(responseData)
            ChatBubble(client_pfp,content)
        }).catch(err => {
            console.log(err)
        })
    }
}
// Create New Chat Bubble
function ChatBubble(UserPicture, ChatContent) {
    const chat = document.createElement('div');
    chat.className = 'chat_history';
    chat.innerHTML = `<img class="chat_pfp" src="${UserPicture}">
    <div class="chat_text">${ChatContent}</div>`;
    document.getElementById('chat-display').appendChild(chat);

    document.getElementById("chat-display").scrollTop = document.getElementById("chat-display").scrollHeight;
}

function ChatSync(){
    if (role=="host"){
        GET(client_chatID).then(responseData => {
            last_edited = edited
            edited = responseData.response[0].edited_timestamp
            
            // console.log(`${edited}\n${last_edited}`)
            
            if (edited!=last_edited){
                ChatBubble(responseData.response[0].embeds[0].author.icon_url,responseData.response[0].embeds[0].description)
            }
            
        }).catch(err => {
            console.log(err)
        })
    } else if (role=="client"){
        GET(host_chatID).then(responseData => {
            last_edited = edited
            edited = responseData.response[0].edited_timestamp

            // console.log(`${edited}\n${last_edited}`)

            if (edited!=last_edited){
                ChatBubble(responseData.response[0].embeds[0].author.icon_url,responseData.response[0].embeds[0].description)
            }
        }).catch(err => {
            console.log(err)
        })
    }
    setTimeout(function () {
        console.log("Syncing Chat...")
        ChatSync()
    }, 2500); 
}

function SideLog(type, logContent) {
    if (type=="system"){
        const log = document.createElement('div');
        log.setAttribute(`class`, `log_history`);
        log.setAttribute(`id`,`log_system`)
        log.textContent = logContent
        document.getElementById("log_display").appendChild(log)
        document.getElementById("log_display").scrollTop=document.getElementById("log_display").scrollHeight
    }
}

// function chat_get(){
//     if (role=="host"){
//         let xmlHttp = new XMLHttpRequest();
//         xmlHttp.open( "GET", `https://discord.com/api/webhooks/871795497881440278/PGB-ytcBMwXtz27-t_2EMkz7MT8VtYGrucuDIR_etDDKTqq5FMnZj_iJeDSH0qlgOFez/messages/${client_chatID}?${new Date().getTime()}`, false ); // false for synchronous request 
//         xmlHttp.setRequestHeader('Content-type', 'application/json');
//         // xmlHttp.setRequestHeader("Cache-Control", "no-cache");
//         // xmlHttp.setRequestHeader("Pragma", "no-cache");
//         // xmlHttp.setRequestHeader("Expires", "0");
//         xmlHttp.send();
//         // console.log(xmlHttp.responseText)
//         // console.log(xhr.status);
//         // console.log(xhr.responseText);
//         client_pfp = JSON.parse(xmlHttp.responseText).embeds[0].author.icon_url
//         oldmsg = getmsg
//         getmsg = JSON.parse(xmlHttp.responseText).embeds[0].description
//         // console.log(JSON.parse(xmlHttp.responseText))
//         if (getmsg!=oldmsg){
//             console.log(JSON.parse(xmlHttp.responseText))
//             console.log(`
//             OLD: ${oldmsg}
//             NEW: ${getmsg}
//             `)
//             const chat_history = document.createElement('div'); 
//             chat_history.className = `chat_history`;
//             chat_history.innerHTML = `<img class="chat_pfp" src="${client_pfp}">
//             <div class="chat_text">${getmsg}</div>`;
//             document.getElementById('chat-display').appendChild(chat_history);

//             document.getElementById("chat-display").scrollTop = document.getElementById("chat-display").scrollHeight
//         }
//         setTimeout(function () {
//             chat_get();
//         }, 2000);
//     } else if (role=="client"){
//         let xmlHttp = new XMLHttpRequest();
//         xmlHttp.open( "GET", `https://discord.com/api/webhooks/871795497881440278/PGB-ytcBMwXtz27-t_2EMkz7MT8VtYGrucuDIR_etDDKTqq5FMnZj_iJeDSH0qlgOFez/messages/${host_chatID}?${new Date().getTime()}`, false ); // false for synchronous request 
//         xmlHttp.setRequestHeader('Content-type', 'application/json');
//         // xmlHttp.setRequestHeader("Cache-Control", "no-cache");
//         // xmlHttp.setRequestHeader("Pragma", "no-cache");
//         // xmlHttp.setRequestHeader("Expires", "0");
//         xmlHttp.send();
//         // console.log(xmlHttp.responseText)
//         // console.log(xhr.status);
//         // console.log(xhr.responseText);
//         host_pfp = JSON.parse(xmlHttp.responseText).embeds[0].author.icon_url
//         oldmsg = getmsg
//         getmsg = JSON.parse(xmlHttp.responseText).embeds[0].description
//         // console.log(JSON.parse(xmlHttp.responseText))
//         if (getmsg!=oldmsg){
//             console.log(JSON.parse(xmlHttp.responseText))
//             console.log(`
//             OLD: ${oldmsg}
//             NEW: ${getmsg}
//             `)
//             const chat_history = document.createElement('div'); 
//             chat_history.className = `chat_history`;
//             chat_history.innerHTML = `<img class="chat_pfp" src="${host_pfp}">
//             <div class="chat_text">${getmsg}</div>`;
//             document.getElementById('chat-display').appendChild(chat_history);

//             document.getElementById("chat-display").scrollTop = document.getElementById("chat-display").scrollHeight
//         }
//         setTimeout(function () {
//             chat_get();
//         }, 2000);
//     }
// }