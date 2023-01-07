// var URLWebhook = "https://discord.com/api/webhooks/871795497881440278/PGB-ytcBMwXtz27-t_2EMkz7MT8VtYGrucuDIR_etDDKTqq5FMnZj_iJeDSH0qlgOFez"
var URLWebhook
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
                // reject(xhr.response)
            } else {
                let response = `{"response":[${JSON.stringify(xhr.response)}],"status":${JSON.parse(xhr.status)}}`
                resolve(JSON.parse(response));
            }
        };
        xhr.onerror = () =>{
            reject(xhr.status)
        };

        // const embeds = POSTembeds
        let params = {
            username: "Dicey 2 test",
            embeds: POSTembeds
        }
        // console.log(POSTembeds)
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

    let params = {
        username: "Dicey 2 test",
        embeds: PATCHembeds
    }

    xhr.send(JSON.stringify(params))
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