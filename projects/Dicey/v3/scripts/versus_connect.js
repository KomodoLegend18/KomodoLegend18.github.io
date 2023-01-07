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
    
    if (content_trimmed.includes("https://youtu.be/")==true||content_trimmed.includes("https://www.youtube.com/watch?v=")==true||content_trimmed.includes("https://music.youtube.com/watch?v=")==true){
        let YTid = link.replace("https://youtu.be/","")
        YTid = YTid.replace("https://music.youtube.com/watch?v=","")
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
        }, 3500);
    }
    return
}

function ChatSending(content){
    if (role=="host"){
        let id = versusPlayerData[0].chatID
        let embeds = [
            {
                "description": `${content}`,
                "color": 15597654,
                "author": {
                    "name": `${versusPlayerData[0].username}`,
                    "icon_url":`${versusPlayerData[0].avatar}`
                }
            }
        ]
        PATCH(id,embeds).then(responseData => {
            console.log(responseData)
            ChatBubble(versusPlayerData[0].avatar,content)
        }).catch(err => {
            console.log(err)
        })
    } else if (role=="client"){
        let id = versusPlayerData[1].chatID
        let embeds = [
            {
                "description": `${content}`,
                "color": 15597654,
                "author": {
                    "name": `${versusPlayerData[1].username}`,
                    "icon_url":`${versusPlayerData[1].avatar}`
                }
            }
        ]
        PATCH(id,embeds).then(responseData => {
            console.log(responseData)
            ChatBubble(versusPlayerData[1].avatar,content)
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
    twemoji.parse(document.body)    

    document.getElementById("chat-display").scrollTop = document.getElementById("chat-display").scrollHeight;
}

function ChatSync(){
    console.log("Syncing Chat (GET)")
    if (role=="host"){
        // console.warn(versusPlayerData[1].chatID)
        GET(versusPlayerData[1].chatID).then(responseData => {
            // console.warn(responseData.response[0].embeds[0].description)
            last_edited = edited
            edited = `${responseData.response[0].embeds[0].description}`
            // console.log(`${edited}\n${last_edited}`)
            if (edited!=last_edited){
                ChatBubble(responseData.response[0].embeds[0].author.icon_url,responseData.response[0].embeds[0].description)
            }
        }).catch(err => {
            console.error(err)
        })
    } else if (role=="client"){
        GET(versusPlayerData[0].chatID).then(responseData => {
            last_edited = edited
            edited = `${responseData.response[0].embeds[0].description}`
            // console.log(`${edited}\n${last_edited}`)
            if (edited!=last_edited){
                ChatBubble(responseData.response[0].embeds[0].author.icon_url,responseData.response[0].embeds[0].description)
            }
        }).catch(err => {
            console.error(err)
        })
    }
    setTimeout(function () {
        // console.log("Syncing Chat...")
        ChatSync()
    }, 3500); 
}