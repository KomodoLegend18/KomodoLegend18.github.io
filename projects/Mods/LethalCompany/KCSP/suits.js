// Main function for HTTP request
const clientRequest = (options) => {
    const promise = new Promise((resolve, reject) => {
        const {
            method = "GET",
            cors = false,
            url,
            async = true,
            headers,
            respType = "text",
            data,
        } = options;
        // Check method
        if (!["GET", "POST", "PATCH"].includes(method)) {
            reject(
                new Error(
                    "Invalid method. Method must be one of 'GET', 'POST', or 'PATCH'."
                )
            );
        }
        // Check cors
        if (typeof cors !== "boolean") {
            reject(new Error("Invalid cors. Cors must be boolean"));
        }
        // Check url
        if (!url) {
            reject(new Error("URL is not specified."));
        }
        // Check async
        if (typeof async !== "boolean") {
            reject(new Error("Invalid async. Async must be boolean"));
        }
        // Check headers
        if (headers) {
            // console.log(headers);
            if (typeof headers !== "object") {
                reject(new Error("Invalid headers. Headers must be object"));
            }
        }
        // Check respType
        if (!["text", "document", "json"].includes(respType)) {
            reject(
                new Error(
                    "Invalid responseType. type must be one of 'text', 'document', or 'json'."
                )
            );
        }

        const xhr = new XMLHttpRequest();
        if (cors) {
            // removed encodeuricomponent
            // encodeuri now must be provided before requested
            xhr.open(method, cors_proxy + url, async);
        } else {
            xhr.open(method, url, async);
        }
        xhr.responseType = respType;
        if (headers) {
            for (const key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }
        // xhr.setRequestHeader("Access-Control-Allow-Origin","*")
        // xhr.setRequestHeader("Origin","https://komodolegend18.github.io/")
        // xhr.abort()
        xhr.onload = () => {
            const respHeaders = xhr.getAllResponseHeaders();
            const responseData = {
                data: {
                    result: xhr.response,
                    status: xhr.status,
                },
                input: {
                    method,
                    cors,
                    url,
                    async,
                    headers,
                    respType,
                    data,
                },
                respHeader: {
                    respHeaders,
                },
            };

            if (xhr.status >= 400) {
                console.error(
                    "Don't forget to encodeuricomponent() 😇\n",
                    responseData
                );
                reject(new Error(responseData));
            } else {
                // console.log("Don't forget to encodeuricomponent() 😇\n",responseData);
                resolve(responseData.data.result);
            }
        };
        xhr.onerror = () => {
            const respHeaders = xhr.getAllResponseHeaders();
            const responseData = {
                data: {
                    result: xhr.response,
                    status: xhr.status,
                },
                input: {
                    method,
                    cors,
                    url,
                    async,
                    headers,
                    respType,
                    data,
                },
                respHeader: {
                    respHeaders,
                },
            };
            console.error(
                "Don't forget to encodeuricomponent() 😇\n",
                responseData
            );
            // sendError(new Error("ClientRequest ERROR"),JSON.stringify(responseData),"ClientRequest ERROR")
            reject(new Error(responseData));
        };
        xhr.send(data);
    });
    return promise;
};
function loadsuits(){
    clientRequest({
        method:"GET",
        url:"suits.json",
        respType:"json"
    })
    
}