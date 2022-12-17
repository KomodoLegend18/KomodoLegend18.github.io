// Webhook
const GET = (URL) => {
    const promise = new Promise((resolve,reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(`GET`, URL, true)
        xhr.responseType = `json`;
        xhr.setRequestHeader(`Content-type`, `application/json`);
        xhr.onload = () => {
            if (xhr.status>=400){
                let response = `{"response":[${JSON.stringify(xhr.response)}],"status":${JSON.parse(xhr.status)}}`
                reject(JSON.parse(response))
            } else {
                let response = `{"response":[${JSON.stringify(xhr.response)}],"status":${JSON.parse(xhr.status)}}`
                resolve(JSON.parse(response));
            }
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
        xhr.send()
    })
    return promise
}
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.has('queue')==true){
    console.log(queryString);
    let url = encodeURI(urlParams.get(`url`))
    console.log(url)
    window.location.replace(`https://youtu.be/dQw4w9WgXcQ`)
    // GET(url).then(response => {
    //     console.log(response)
    // })
}
const POST = (POSTwait, POSTembeds) =>{
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${localStorage.getItem("webhook_url_saved")}?wait=${POSTwait}`, true);

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
            reject(xhr.response)
        };

        const embeds = POSTembeds
        let params = {
            username: localStorage.getItem("webhook_name_saved"),
            avatar_url: localStorage.getItem("webhook_avatarurl_saved"),
            embeds: embeds
        }

        xhr.send(JSON.stringify(params))
    });
    return promise;
};


let data = localStorage.getItem("saved_jadwal")
let dataData = JSON.parse(data)
let field = []
for (let i=0; i<dataData.length; i++){
    let id = dataData[i].id
    let title = dataData[i].title
    let score = dataData[i].mean
    let nextEps
    if (dataData[i].broadcast){
        let startDate = dataData[i].start_date
        let startTime = dataData[i].broadcast.start_time
        let date = new Date(`${startDate} ${startTime}`)
        date.setDate(date.getDate()+7*dataData[i].watched_episode);
        console.log(date)


        nextEps = date.getTime()/1000

        console.log(nextEps)
    } else {
        nextEps = `unknown`
    }
    let add = JSON.parse(`{
        "name": ${id},
        "value": "[ ${score} ] **${title}**\\n next episode [Ep${dataData[i].watched_episode+1}]: <t:${nextEps}:R> (estimated)\\nqueued by ***Komosan***",
        "inline": true
    }`)
    field.push(add)
}
console.log(field)
let embed = [
    {
      "description": "[Add to queue](https://komodolegend18.github.io/projects/Nobyar?queue)",
      "color": 15466240,
      "fields": field,
      "author": {
        "name": "Nobyar Queue"
      }
    }
  ]
POST(true,embed).then(response => {
    console.log(response)
})


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
        reject(xhr.response)
    };

    const embeds = PATCHembeds
    let params = {
        username: webhookName,
        embeds: embeds
    }

    xhr.send(JSON.stringify(params))
});
return promise;
};