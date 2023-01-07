// var WEBHOOKURL
// var POST_Parsed
var GETID //enemy post ID
console.log(GETID)

var URLWebhook = "https://discord.com/api/webhooks/871795497881440278/PGB-ytcBMwXtz27-t_2EMkz7MT8VtYGrucuDIR_etDDKTqq5FMnZj_iJeDSH0qlgOFez"

var GETMSG
var OLDMSG

const GETDatabase = () =>{
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        // xhr.open("GET", `https://cors-anywhere.herokuapp.com/https://komodolegend18.github.io/projects/Dicey/database.json`, true);
        xhr.open("GET", `https://komodolegend18.github.io/projects/Dicey/database.json`, true);

        xhr.responseType = 'json';
        // xhr.setRequestHeader('Access-Control-Allow-Origin','*')

        xhr.onload = () =>{
            if (xhr.status>=400){
                let response = `{"response":[${JSON.stringify(xhr.response)}],"status":${JSON.parse(xhr.status)}}`
                reject(JSON.parse(response))
            } else {
                let response = `{"response":[${JSON.stringify(xhr.response)}],"status":${JSON.parse(xhr.status)}}`
                resolve(JSON.parse(response));
            }
        };
        xhr.onerror = () =>{
            reject(xhr.response)
        };

        xhr.send()
    });
    return promise;
};
const GET = (GETID) =>{
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${URLWebhook}/messages/${GETID}?${new Date().getTime()}`, true);

        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-type', 'application/json');

        xhr.onload = () =>{
            if (xhr.status>=400||xhr.response.embeds.length<1){
                let response = `{"response":[${JSON.stringify(xhr.response)}],"status":${JSON.parse(xhr.status)}}`
                reject(JSON.parse(response))
            } else {
                let response = `{"response":[${JSON.stringify(xhr.response)}],"status":${JSON.parse(xhr.status)}}`
                resolve(JSON.parse(response));
            }
        };
        xhr.onerror = () =>{
            reject(xhr.response)
        };

        xhr.send()
    });
    return promise;
};


const POST = (POSTwait, POSTembeds) =>{
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${URLWebhook}?wait=${POSTwait}`, true);

        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = () =>{
            if (xhr.status>=400){
                let response = `{"response":[${JSON.stringify(xhr.response)}],"status":${JSON.parse(xhr.status)}}`
                reject(JSON.parse(response))
            } else {
                let response = `{"response":[${JSON.stringify(xhr.response)}],"status":${JSON.parse(xhr.status)}}`
                resolve(JSON.parse(response));
            }
        };
        xhr.onerror = () =>{
            reject(xhr.status)
        };

        const embeds = POSTembeds
        let params = {
            username: "Dicey 2 test",
            embeds: [embeds]
        }

        xhr.send(JSON.stringify(params))
    });
    return promise;
};

const PATCH = (PATCHID, PATCHembeds) =>{
        const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PATCH", `${URLWebhook}/messages/${PATCHID}`, true);

        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-type', 'application/json');

        xhr.onload = () =>{
            if (xhr.status>=400){
                let response = `{"response":[${JSON.stringify(xhr.response)}],"status":${JSON.parse(xhr.status)}}`
                reject(JSON.parse(response))
            } else {
                let response = `{"response":[${JSON.stringify(xhr.response)}],"status":${JSON.parse(xhr.status)}}`
                resolve(JSON.parse(response));
            }
        };
        xhr.onerror = () =>{
            reject(xhr.status)
        };

        const embeds = PATCHembeds
        let params = {
            username: "Dicey 2 test",
            embeds: [embeds]
        }

        xhr.send(JSON.stringify(params))
    });
    return promise;
};

const getData = (ID) => {
    GET(ID).then(responseData => {
        // console.log(responseData)

        // console.log(`
        // GET [STATUS ${responseData.status}]
        // Message ID: ${responseData.response[0].id}
        // `);

        OLDMSG = GETMSG
        GETMSG = responseData.response[0].embeds[0].description
        if (GETMSG!=OLDMSG){
            console.log(`
            OLD: ${OLDMSG}
            NEW: ${GETMSG}
            `)
            const chat_history = document.createElement('div'); 
            chat_history.className = `chat_history`;
            chat_history.innerHTML = `<img class="chat_pfp" src="https://cdn.discordapp.com/avatars/871795497881440278/${responseData.response[0].author.avatar}.png">
            <div class="chat_text">${GETMSG}</div>`;
            document.getElementById('chat-display').appendChild(chat_history);

            document.getElementById("chat-display").scrollTop = document.getElementById("chat-display").scrollHeight
        }
        setTimeout(function () {
            getData(ID);
        }, 3500); //loop get
    }).catch(err => {
        console.log(err)
    });
}

const sendData = () => {
    let embeds = JSON.parse(`{
        "description": "promise test",
        "color": 15597654,
        "author": {
            "name": "ooga booga"
        }
    }`)
    POST(true,embeds).then(responseData => {
        console.log(responseData)
        console.log(`
        POST [STATUS ${responseData.status}]
        Message ID: ${responseData.response[0].id}
        `);
        GETID = responseData.response[0].id
        console.log(GETID)
        getData(GETID)
    }).catch(err => {
        console.log(err)
        console.log(`
        POST [STATUS ${err.status}]
        ${err.response[0].message}
        `);
    });
}

const editData = () =>{
    let embeds = JSON.parse(`{
        "description": "promise test",
        "color": 15597654,
        "author": {
            "name": "ooga booga",
            "icon_url": ""
        }
    }`)
    POST(true,embeds).then(responseData => {
        console.log(responseData)
        console.log(`
        POST [STATUS ${responseData.status}]
        Message ID: ${responseData.response[0].id}
        `);
        GETID = responseData.response[0].id
        console.log(GETID)
        getData(GETID)
    }).catch(err => {
        console.log(err)
        console.log(`
        POST [STATUS ${err.status}]
        ${err.response[0].message}
        `);
    });
}


// function POST(WEBHOOKURL,wait,embeds,params,parsed){
//     if (wait===undefined){
//         wait = false
//         console.warn("POST")
//     } else if (embeds===undefined){
//         embeds = JSON.parse(`{
//             "description": "embeds parameter is undefined",
//             "author": {
//                 "name": "SuiBOT",
//                 "icon_url": "https://cdn.discordapp.com/avatars/626849987984228355/93ddad8a45c7d93dec40959c588a5b07.png?size=256"
//             }
//         }`)
//     } else if (params===undefined){
//         params = {
//             username: "SuiBOT",
//             embeds: [embeds]
//         }
//     }
//     let embeds = embeds
//     let POST = new XMLHttpRequest();
//     POST.open("POST", `${WEBHOOKURL}?wait=${wait}`, false);
//     POST.setRequestHeader('Content-type', 'application/json');
//     let params = params
//     if (POST.readyState == XMLHttpRequest.DONE) {
//         // alert(request_invitation.responseText);
//     }
//     POST.send(JSON.stringify(params));
//     console.log(JSON.parse(POST.responseText));
        
//     POST_Parsed = JSON.parse(POST.responseText)
//     parsed=POST_Parsed
// }