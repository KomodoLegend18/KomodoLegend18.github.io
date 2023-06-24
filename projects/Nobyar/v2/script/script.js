// ========================================================
if(!user_data){
    // Create new empty save data
    let saveArray = [
        {
            "list":[],
            "config":[
                {
                    "webhook":[]
                }
            ]
        }
    ]
    localStorage.setItem("nobyarV2", JSON.stringify(saveArray))
    console.warn("Save data not found, new save data created",JSON.parse(localStorage.getItem("nobyarV2")))
} else {
    console.warn("Save data found, loading save data...",JSON.parse(user_data)[0])
}

// ========================================================
searchInput.addEventListener("focus", function(e){
    // console.log("Dim count: ",document.querySelector("#fadeDim").childElementCount)
    if(document.querySelector("#fadeDim").childElementCount==0){
        // Create dim element for header and container
        const dimElem = document.createElement("div");
        dimElem.className="dim"
        document.getElementById("fadeDim").appendChild(dimElem);

        // Then look for all element with dim class
        const alldim = document.querySelectorAll(".dim")
            for (i=0;i<alldim.length;i++){
                // Then add eventlistener to those elements
                alldim[i].addEventListener("click", function(e){
                    for(i=0;i<alldim.length;i++){
                        alldim[i].remove()
                    }
                    clearSearch()
                })
            }
    }
    
    if(document.getElementById("search-result-overlay")){
        document.getElementById("search-result-overlay").style="pointer-events:none"
    }
    
    // console.warn("dim applied")
    // console.log(query)
    function clearSearch(){ // Clear searchbar when executed    
        // document.querySelector("#header-section > input[type=text]").value=""
        const prevresult = document.getElementById("search-result-overlay")
        if(prevresult){
            // prevresult.innerHTML=""
            prevresult.style="pointer-events:none;display:none"
        }
    }
})

// ========================================================
let timer
searchInput.addEventListener("input", function(e) {
    let query = e.target.value
    if (query.length>=3){ // If query is longer than/equal to 3 characters
        console.log("Search query: ",query.length,`"${query}"`)

        clearTimeout(timer);
        timer = setTimeout(() => {
            console.log("> Searching: ",query.length,`"${query}"`)
            getAnime(query).then(response =>{ // Search MAL for specified search query
                const result = document.getElementById("search-result-overlay")
                result.innerHTML=""
                result.style="pointer-events:auto;"
    
                for(i=0;i<response.length;i++){ // Iterate all responses to display on the page
                    const items = document.createElement("div");
                    items.id="items"
                    items.setAttribute("data-index",i)
    
                    // Incase response does not contain "start_season" field
                    if(response[i].node.start_season&&response[i].node.genres){ // If "start_season" exist, display on details tag
                        items.innerHTML=`
                        <div id="poster" style="background-image: url(${response[i].node.main_picture.large});">
                        <div id="label">Add to list</div>
                        </div>
                        <div id="info">
                            <div id="title">${response[i].node.title}</div>
                            <div id="genre">${response[i].node.genres.map(x => x.name).join(", ")}</div>
                            <div id="details">
                                <div id="score">${response[i].node.mean}</div>
                                <div id="type">${response[i].node.media_type}</div>
                                <div id="status">${response[i].node.status}</div>
                                <div id="season">${response[i].node.start_season.season} ${response[i].node.start_season.year}</div>
                            </div>
                            <div id="synopsis">${response[i].node.synopsis}</div>
                        </div>`
                    } else if(response[i].node.genres){ // If only "genres" exist, display on details tag
                        // let error = new Error("start_season is undefined")
                        // error.name = "no start_season"
                        // sendError(`genre`,query,``)
                        items.innerHTML=`
                        <div id="poster" style="background-image: url(${response[i].node.main_picture.large});">
                        <div id="label">Add to list</div>
                        </div>
                        <div id="info">
                            <div id="title">${response[i].node.title}</div>
                            <div id="genre">${response[i].node.genres.map(x => x.name).join(", ")}</div>
                            <div id="details">
                                <div id="score">${response[i].node.mean}</div>
                                <div id="type">${response[i].node.media_type}</div>
                                <div id="status">${response[i].node.status}</div>
                            </div>
                            <div id="synopsis">${response[i].node.synopsis}</div>
                        </div>`
                    } else {
                        items.innerHTML=`
                        <div id="poster" style="background-image: url(${response[i].node.main_picture.large});">
                        <div id="label">Add to list</div>
                        </div>
                        <div id="info">
                            <div id="title">${response[i].node.title}</div>
                            <div id="genre">-</div>
                            <div id="details">
                                <div id="score">${response[i].node.mean}</div>
                                <div id="type">${response[i].node.media_type}</div>
                                <div id="status">${response[i].node.status}</div>
                            </div>
                            <div id="synopsis">${response[i].node.synopsis}</div>
                        </div>`
                    }
                    
                    // Add a click eventlistener to search results created from search response
                    items.addEventListener("click", function(e){ 
                        // Declare response as data
                        let data = response[e.target.attributes["data-index"].value].node
                        let savedata = JSON.parse(localStorage.getItem("nobyarV2"))
                        console.log("Save data: ",savedata[0].list)
    
                        let customProperty = 
                        {
                            "nobyar": {
                                "aired_episodes": 0,
                                "watched_episodes": 0,
                                "mean_history": [],
                                "external_source":[]
                            }
                        }
                        // Then assign custom property above to data
                        Object.assign(data,customProperty)
    
                        console.log(e.target.children.info.children.title.innerText,data)
    
                        // Search Yugen with title as query
                        searchYugen(e.target.children.info.children.title.innerText).then(response=>{
                            // Then parse response from Yugen
                            let parse = new DOMParser().parseFromString(response,"text/html")
                            let item = parse.querySelector(`[title='${e.target.children.info.children.title.innerText}']`)
                            let url = `${sites[0].url}${item.getAttribute("href")}watch/`
                            // console.log(url)
    
                            // Request Yugen again with parsed URL to get all available episodes
                            allepsYugen(url).then(response=>{
                                // Parse the response
                                let parse = new DOMParser().parseFromString(response,"text/html")
                                let item = parse.querySelectorAll(`.ep-card`)
                                
                                // console.log(`${item.length} episode aired`)
    
                                // Insert new info to data
                                data.nobyar.aired_episodes = item.length
                                let newExternal = {"name":"Yugen","url":url}
                                data.nobyar.external_source.push(newExternal);
                                addMeanHistory(data);
                                
                                if (savedata[0].list.length>0){ // If list in savedata not empty
                                    for(i=0;i<savedata[0].list.length;i++){ // Iterate all list in savedata
                                        console.log(savedata[0].list[i].id,savedata[0].list[i].title)
                                            if(data.id==savedata[0].list[i].id){ // If data id is the same as the one in save data
                                                // console.warn("duplicate")
                                                break; // stop iterating
                                            } else if(i==savedata[0].list.length-1&&data.id!=savedata[0].list[i].id){ // else if done iterating AND no duplicate found, add to savedata
                                                console.log("unique",data)
                                                savedata[0].list.push(data)
                                                localStorage.setItem("nobyarV2", JSON.stringify(savedata))
                                                let save = JSON.parse(localStorage.getItem("nobyarV2"))
                                                createcard(data,save[0].list.length-1)
                                                toast("notice",`Successfully added "${data.title}" to the list`)
    
                                                console.log(save)
                                            }
                                            console.log(i,savedata[0].list.length)
                                    }
                                }else if(savedata[0].list.length<1){ // Else if list in savedata is empty, just add without checking for duplicates
                                    savedata[0].list.push(data)
                                    localStorage.setItem("nobyarV2", JSON.stringify(savedata))
                                    let save = JSON.parse(localStorage.getItem("nobyarV2"))
                                    createcard(data,save[0].list.length-1)
                                    toast("notice",`Successfully added "${data.title}" to the list`)
                                    console.log(save)
                                }
                                if(document.querySelector("#empty")){ // if empty list message exist, remove it
                                    document.querySelector("#empty").style="display:none"
                                }
                            }).catch(err=>{
                                console.error(err)
                            })
                        }).catch(err=>{
                            // console.error(err)
                            sendError(err,data,`Yugen page not found for __***${e.target.children.info.children.title.innerText} (${data.id})***__`)
                            if (savedata[0].list.length>0){ // If list in savedata not empty
                                for(i=0;i<savedata[0].list.length;i++){ // Iterate all list in savedata
                                    console.log(savedata[0].list[i].id,savedata[0].list[i].title)
                                        if(data.id==savedata[0].list[i].id){ // If data id is the same as the one in save data
                                            // console.warn("duplicate")
                                            break; // stop iterating
                                        } else if(i==savedata[0].list.length-1&&data.id!=savedata[0].list[i].id){ // else if done iterating AND no duplicate found, add to savedata
                                            console.log("unique",data)
                                            savedata[0].list.push(data)
                                            localStorage.setItem("nobyarV2", JSON.stringify(savedata))
                                            let save = JSON.parse(localStorage.getItem("nobyarV2"))
                                            createcard(data,save[0].list.length-1)
                                            toast("notice",`Successfully added "${data.title}" to the list`)
    
                                            console.log(save)
                                        }
                                        console.log(i,savedata[0].list.length)
                                }
                            }else if(savedata[0].list.length<1){ // Else if list in savedata is empty, just add without checking for duplicates
                                savedata[0].list.push(data)
                                localStorage.setItem("nobyarV2", JSON.stringify(savedata))
                                let save = JSON.parse(localStorage.getItem("nobyarV2"))
                                createcard(data,save[0].list.length-1)
                                toast("notice",`Successfully added "${data.title}" to the list`)
                                console.log(save)
                            }
                        })
                        // data.push(customProperty)
                        // page_loadlist()
                    })
                    document.getElementById("search-result-overlay").appendChild(items);
                }
                // console.warn(response)
            }).catch(err=>{
                if (err.status<500){
                    console.error(err)
                    sendError(err,query,``)
                } else {
                    console.error(err)
                }
            })
        }, 1000);
    } else if (query.length==0){ // If search query is empty, clear search results
        clearTimeout(timer);
        const prevresult = document.getElementById("search-result-overlay")
        prevresult.innerHTML=""
        prevresult.style="pointer-events:none"
    }
})

// ========================================================
page_loadlist()
function page_loadlist(){ // Executed when page loaded
    try {
        let data = JSON.parse(localStorage.getItem("nobyarV2"))
        // console.log(data[0].list.length)

        if(!data){ // If save data somehow doesn't exist, refresh
            location.reload()
        }

        if (data[0].list.length==0){ // If list is empty, display a message
            // display random face just for fun :\
            let randFace = Math.round(Math.random()*2)
            let face
            if (randFace==0){
                face = ":("
            } else {
                face = "D:"
            }

            console.error("List Empty")
            const empty = document.createElement("div");
            empty.id="empty";
            empty.innerHTML=`
            <h1>${face}</h1>
            <h3>Hmm...Looks like your list is empty</h3>
            <p><span>why not add some to your list?</span></p>`
            document.getElementById("content").appendChild(empty);

            document.querySelector("#empty > p > span").addEventListener("click", function(){ // When hint clicked, focuses user to search input
                document.querySelector("#header-section > input[type=text]").focus();
            });
        } else if(data[0].list.length!=0){ // Else if list is not empty, display user lists
            document.querySelector("#hamburger-icon").addEventListener("click", function(e){
                document.querySelector("#menu").style="transform: translateX(0%);"

                document.querySelector("#menuClose").addEventListener("click", function(){
                    document.querySelector("#menu").style="transform: translateX(-100%);"

                })

            });
            console.warn(data[0].list)
            data[0].list = data[0].list.filter((obj) => Object.keys(obj).length !== 0);
            localStorage.setItem("nobyarV2", JSON.stringify(data))
            for (let i = 0; i < data[0].list.length; i++) {
                setTimeout(() => {
                    updateAnime(data[0].list[i].id).then((response) => {
                        let load = JSON.parse(localStorage.getItem("nobyarV2"));
                        // console.log("New: ", response);
                        // console.log("Old: ", load[0].list[i]);
                
                        let newData = Object.assign({}, load[0].list[i]);
                
                        for (let key in response) {
                        if (response[key] !== undefined && response[key] !== newData[key]) {
                            // console.log("Old: ", response[key]);
                            // console.log(newData[key], response[key]);

                            newData[key] = response[key];
                        }
                        }

                        
                        load[0].list[i] = updateMeanHistory(i,load,newData);
                        // createcard(load[0].list[i], i);
                        // localStorage.setItem("nobyarV2", JSON.stringify(load));

                        // if(load[0].list[i].nobyar.external_source.length!=0){

                        // check all eps on yugen
                        allepsYugen(load[0].list[i].nobyar.external_source[0].url).then(response=>{
                            let data = load[0].list[i];
                            // Parse the response
                            let parse = new DOMParser().parseFromString(response,"text/html")
                            let item = parse.querySelectorAll(`.ep-card`)
                            
                            // console.log(`${item.length} episode aired`)

                            // Insert new info to data
                            data.nobyar.aired_episodes = item.length
                            // data.nobyar[2].external_link[0].url = url
                            localStorage.setItem("nobyarV2", JSON.stringify(load));
                            // console.log(node)
                            createcard(load[0].list[i], i);
                        }).catch(err=>{
                            console.error(err,"Unable to get data from external url, url may have changed. Getting new link...")
                            searchYugen(load[0].list[i].title).then(response=>{
                                // Then parse response from Yugen
                                let parse = new DOMParser().parseFromString(response,"text/html")
                                let item = parse.querySelector(`[title='${load[0].list[i].title}']`)
                                let url = `${sites[0].url}${item.getAttribute("href")}watch/`
                                // console.log(url)
                                // console.log(response)
        
                                // Request Yugen again with parsed URL to get all available episodes
                                allepsYugen(url).then(response=>{
                                    // Parse the response
                                    let parse = new DOMParser().parseFromString(response,"text/html")
                                    let item = parse.querySelectorAll(`.ep-card`)
                                    
                                    // console.log(`${item.length} episode aired`)
        
                                    // Insert new info to data
                                    load[0].list[i].nobyar.aired_episodes = item.length
                                    let newExternal = {"name":"Yugen","url":`${url}`}
                                    load[0].list[i].nobyar.external_source[0]=newExternal;
                                    console.log(load[0].list[i].nobyar.external_source[0])
                                    console.log(load)
                                    addMeanHistory(load[0].list[i]);
                                    localStorage.setItem("nobyarV2", JSON.stringify(load));
                                    createcard(load[0].list[i], i);
                                })
                            })
                            // console.error(err+", Entry does not have external url",load[0].list[i]);
                            // sendError(err,load[0].list[i],"Entry does not have external url, allepsYugen():315");
                        })

                        // check all eps on kurama
                        // console.log(load[0].list[i].nobyar.external_source.length);
                        if (load[0].list[i].nobyar.external_source.length<2){
                            console.log(load[0].list[i].nobyar.external_source.length)
                            searchKurama(load[0].list[i].title).then(response=>{
                                // Then parse response from Kurama
                                let parse = new DOMParser().parseFromString(response,"text/html")
                                let item = parse.querySelector(`#animeList > div > div > a`)
                                // console.log(item);

                                let url = `${item.getAttribute("href")}`
                                // console.log(url)
                                // console.log(response)
        
                                // Insert new info to data
                                // load[0].list[i].nobyar.aired_episodes = item.length
                                let newExternal = {"name":"Kurama","url":`${url}`}
                                load[0].list[i].nobyar.external_source[1]=newExternal;
                                console.log(load[0].list[i].nobyar.external_source[1])
                                console.log(load)
                                // addMeanHistory(load[0].list[i]);
                                localStorage.setItem("nobyarV2", JSON.stringify(load));
                                // createcard(load[0].list[i], i);

                                // Request Kurama again with parsed URL to get all available episodes
                                // allepsKurama(url).then(response=>{
                                //     // Parse the response
                                //     let parse = new DOMParser().parseFromString(response,"text/html")
                                //     let itemdata = parse.querySelector("#episodeLists").getAttribute("data-content")
                                //     let dataparsed = new DOMParser().parseFromString(itemdata,"text/html")
                                //     console.log(dataparsed.body.children);
                                //     // console.log(`${item.length} episode aired`)
                                // })

                            })
                        }
                        // allepsKurama(load[0].list[i].nobyar.external_source[1].url).then(response=>{
                        //     // let data = load[0].list[i];
                        //     // Parse the response
                        //     let parse = new DOMParser().parseFromString(response,"text/html")
                        //     let item = parse.querySelector(`#episodeLists`)
                            
                        //     // console.log(`${item.length} episode aired`)

                        //     // Insert new info to data
                        //     // data.nobyar.aired_episodes = item.length
                        //     // data.nobyar[2].external_link[0].url = url
                        //     localStorage.setItem("nobyarV2", JSON.stringify(load));
                        //     // console.log(node)
                        //     // createcard(load[0].list[i], i);
                        // }).catch(err=>{
                        //     console.error(err,"Unable to get data from external url, url may have changed. Getting new link...")
                        //     searchKurama(load[0].list[i].title).then(response=>{
                        //         // Then parse response from Yugen
                        //         let parse = new DOMParser().parseFromString(response,"text/html")
                        //         let items = parse.querySelectorAll(`h5`)
                        //         items.forEach(target=>{
                        //             let targetText = target.querySelector("a").innerHTML;
                        //             if (targetText == load[0].list[i].title){
                        //                 console.log(targetText,target)
                        //             }
                        //         })
                        //         // let url = `${sites[0].url}${item.getAttribute("href")}watch/`
                        //         // console.log(url)
                        //         // console.log(response)
        
                        //         // Request Yugen again with parsed URL to get all available episodes

                        //         // allepsKurama(url).then(response=>{
                        //         //     // Parse the response
                        //         //     let parse = new DOMParser().parseFromString(response,"text/html")
                        //         //     let item = parse.querySelectorAll(`.ep-card`)
                                    
                        //         //     // console.log(`${item.length} episode aired`)
        
                        //         //     // Insert new info to data
                        //         //     load[0].list[i].nobyar.aired_episodes = item.length
                        //         //     let newExternal = {"name":"Kurama","url":`${url}`}
                        //         //     load[0].list[i].nobyar.external_source[0]=newExternal;
                        //         //     console.log(load[0].list[i].nobyar.external_source[0])
                        //         //     console.log(load)
                        //         //     addMeanHistory(load[0].list[i]);
                        //         //     localStorage.setItem("nobyarV2", JSON.stringify(load));
                        //         //     createcard(load[0].list[i], i);
                        //         // })

                        //     })
                        //     // console.error(err+", Entry does not have external url",load[0].list[i]);
                        //     // sendError(err,load[0].list[i],"Entry does not have external url, allepsYugen():315");
                        // })

                        // } else {
                            // createcard(load[0].list[i], i);
                        // }

                    }).catch((err) => {
                        console.error(err);
                        
                        // sendError(err,load[0].list[i],"Error updating entry data, updateAnime():320");
                        // createEntryWindow(node,index)
                    });
                }, i * 250); // wait between each request
            }  
        }
    } catch (error) {
        // sendError(error,JSON.parse(localStorage.getItem("nobyarV2")),"Error loading page, page_loadlist():327")
        console.error(error)
    }
}

// ========================================================
function createcard(node,index){ // Create cards when executed
    try {
        if(node.num_episodes==0){ // Total episode is unknown, make it the same as aired
            node.num_episodes=node.nobyar.aired_episodes
        }
        const card = document.createElement("div");
        card.id="cardContainer"
        // card.title=`${node.title}`
        // card.setAttribute("data-index",index)
        card.innerHTML=`
        <div id="cardBorder"></div>
        <div id="card" title='${node.title}' data-index="${index}">
            <img src="${node.main_picture.large}" alt="${node.title}">
            <div id="card-episode-num"><span>${node.nobyar.watched_episodes}[${node.nobyar.aired_episodes}]/${node.num_episodes}</span></div>
            <div id="card-title">
                <div id="card-episode-bar">
                    <div id="card-episode-bar-aired" style="width: ${node.nobyar.aired_episodes/node.num_episodes*100}%;"></div>
                    <div id="card-episode-bar-watched" style="width: ${node.nobyar.watched_episodes/node.num_episodes*100}%;"></div>
                </div>
                <p>${node.title}</p>
            </div>
        </div>    
        `;
        // if (node.status=="not_yet_aired"){
        //     card.style="border:2px dashed gray"
        // } else if (node.status=="currently_airing"){
        //     card.style="border:2px dotted rgba(86, 204, 255, 1)"
        // } else if (node.status=="finished_airing"){
        //     card.style="border:2px solid white"
        // }
        // console.log(node.nobyar[0].aired_episodes)
        document.getElementById("contentEntries").appendChild(card)
        card.addEventListener("click",function(e){
            // console.log(e.target.attributes.title.value)
            let load = JSON.parse(localStorage.getItem("nobyarV2"))
            createEntryWindow(load[0].list[index],index,e)
            // console.log(load[0].list[index])
            // console.log("Save",save)
            // let openLink = save[0].list[e.target.attributes["data-index"].value].nobyar[2].external_link[0].url
            
            // test(openLink)
            // window.open(openLink);
        }) 
    } catch (error) {
        sendError(error,node,"Error creating card, createcard()")
    }
}

// ========================================================
function createEntryWindow(node,index,trigger){
    console.log(trigger.target,node)
    try {
        if(node.num_episodes==0){ // Total episode is unknown, make it the same as aired
            node.num_episodes=node.nobyar.aired_episodes
        }
        let season
        if(node.start_season==undefined){
            season = `${node.start_date}`
            if(node.start_date==undefined){
                season = `Airing date unknown`
            }
        } else {
            season = `${node.start_season.season} ${node.start_season.year}`
        }
        let genres
        if (node.genres){
            genres = node.genres.map(x => x.name).join(", ")
        } else {
            genres = "-"
        }
        const entryWindow = document.createElement("div");
        entryWindow.id="entry_container"
        entryWindow.setAttribute("data-index",index)
        if(node.nobyar.external_source.length!=0){
            entryWindow.innerHTML=`
            <div id="entry_poster" style="background-image:url(${node.main_picture.large});background-repeat: no-repeat;background-position: center;background-size:cover;">
                <!-- Poster -->
                <div id="entry_return">
                    <span class="material-symbols-outlined">close</span>
                </div>
            </div>
            <div id="entry_details_container">
                <!-- Details container -->
                <div class="entry_details_section">
                    <!-- Details -->
                    <a href="https://myanimelist.net/anime/${node.id}" target="_blank" style="text-decoration:none; color:white;"><h1 data-nobyarelemtype="title">${node.title}</h1></a>
                    <h3><span style="text-transform:capitalize">${season}</span> | <span style="text-transform:uppercase">${node.media_type}, </span><span style="text-transform:capitalize">${node.status.replace(/_/g, ' ')}</span></h3>
                    <h4>${genres}</h4>
                    <p><span style="line-height:1.5;">${node.synopsis}</span></p>
                    <div id="entry_remove" style="background-color:red;color:white;cursor:pointer;width:fit-content"><span id="entry_remove" class="material-symbols-outlined">delete</span></div>
                </div>
                <div class="entry_details_section">
                    <!-- Details -->
                    <h2>Episodes</h2>
                    <div id="ep_rem"><span class="material-symbols-outlined">remove</span></div><div id="ep_add"><span class="material-symbols-outlined">add</span></div>
                    <br>
                    <br>
                    <div id="card-episode-bar">
                        <div id="card-episode-bar-aired" style="width: ${node.nobyar.aired_episodes/node.num_episodes*100}%;"></div>
                        <div id="card-episode-bar-watched" style="width: ${node.nobyar.watched_episodes/node.num_episodes*100}%;"></div>
                    </div>
                    <p>Watched: ${node.nobyar.watched_episodes}</p>
                    <p>Aired: ${node.nobyar.aired_episodes}</p>
                    <strong>Total: ${node.num_episodes}</strong>
                </div>
                <div class="entry_details_section">
                    <!-- Details -->
                    <h2>Watch</h2>
                    <p><a href="${node.nobyar.external_source[0].url}" target="_blank" style="color:inherit;">YugenAnime</a></p>
                    <p><a href="${node.nobyar.external_source[1].url}" target="_blank" style="color:inherit;">Kuramanime</a></p>
                </div>
                <div class="entry_details_section">
                    <!-- Details -->
                    <h2>Score History</h2>
                    <div id="myChart"></div>
                </div>
            </div>`;
        } else {
            entryWindow.innerHTML=`
            <div id="entry_poster" style="background-image:url(${node.main_picture.large});background-repeat: no-repeat;background-position: center;background-size:cover;">
                <!-- Poster -->
                <div id="entry_return">
                    <span class="material-symbols-outlined">close</span>
                </div>
            </div>
            <div id="entry_details_container">
                <!-- Details container -->
                <div class="entry_details_section">
                    <!-- Details -->
                    <a href="https://myanimelist.net/anime/${node.id}" target="_blank" style="text-decoration:none; color:white;"><h1>${node.title}</h1></a>
                    <h3><span style="text-transform:capitalize">${season}</span> | <span style="text-transform:uppercase">${node.media_type}, </span><span style="text-transform:capitalize">${node.status.replace(/_/g, ' ')}</span></h3>
                    <h4>${genres}</h4>
                    <p><span style="line-height:1.5;">${node.synopsis}</span></p>
                    <div id="entry_remove" style="background-color:red;color:white;cursor:pointer;width:fit-content"><span id="entry_remove" class="material-symbols-outlined">delete</span></div>
                </div>
                <div class="entry_details_section">
                    <!-- Details -->
                    <h2>Episodes</h2>
                    <div id="ep_rem"><span class="material-symbols-outlined">remove</span></div><div id="ep_add"><span class="material-symbols-outlined">add</span></div>
                    <br>
                    <br>
                    <div id="card-episode-bar">
                        <div id="card-episode-bar-aired" style="width: ${node.nobyar.aired_episodes/node.num_episodes*100}%;"></div>
                        <div id="card-episode-bar-watched" style="width: ${node.nobyar.watched_episodes/node.num_episodes*100}%;"></div>
                    </div>
                    <p>Watched: ${node.nobyar.watched_episodes}</p>
                    <p>Aired: ${node.nobyar.aired_episodes}</p>
                    <strong>Total: ${node.num_episodes}</strong>
                </div>
                <div class="entry_details_section">
                    <!-- Details -->
                    <h2>Score History</h2>
                    <div id="myChart"></div>
                </div>
            </div>`;
        }
        
        // console.log(node.nobyar[0].aired_episodes)
        document.querySelector("#overlay").appendChild(entryWindow)

        createHistoryChart(node);

        document.querySelector("#entry_return").addEventListener("click",function(e){
            // console.log("Index: ",e.target.attributes["data-index"].value)
            // console.log(e)
            e.target.parentElement.parentElement.remove()
            // let save = JSON.parse(localStorage.getItem("nobyarV2"))
            // console.log("Save",save)
        })
        document.querySelector("#entry_remove").addEventListener("click",function(e){
            // console.log("Index: ",e.target.attributes["data-index"].value)
            // console.log(e)
            e.target.parentElement.parentElement.parentElement.remove()
            let load = JSON.parse(localStorage.getItem("nobyarV2"))
            load[0].list.splice(index,1);
            // trigger.target.parentElement.remove();
            // console.log("Save",load[0].list)
            // document.querySelector(`#card[data-index="${index}"]`).remove()
            // console.log(trigger)
            localStorage.setItem("nobyarV2", JSON.stringify(load))
            location.reload()
        })
        document.querySelector("#ep_rem").addEventListener("click",function(e){
            let load = JSON.parse(localStorage.getItem("nobyarV2"))
            // console.log(e.target);
            // console.log(load[0].list[index]);
            // console.log(load[0].list[index].nobyar[1].watched_episodes);
            if(load[0].list[index].nobyar.watched_episodes>1){
                load[0].list[index].nobyar.watched_episodes-=1;

                if(load[0].list[index].num_episodes!=0){
                    e.target.parentElement.children["card-episode-bar"].children["card-episode-bar-watched"].style.width=`${load[0].list[index].nobyar.watched_episodes/load[0].list[index].num_episodes*100}%`;
                    document.querySelector("#entry_details_container > div:nth-child(2) > p:nth-child(7)").innerText = `Watched: ${load[0].list[index].nobyar.watched_episodes}`

                    trigger.target.children["card-title"].children["card-episode-bar"].children["card-episode-bar-watched"].style.width=`${load[0].list[index].nobyar.watched_episodes/load[0].list[index].num_episodes*100}%`;
                    trigger.target.children["card-episode-num"].children[0].innerText = `${load[0].list[index].nobyar.watched_episodes}[${load[0].list[index].nobyar.aired_episodes}]/${load[0].list[index].num_episodes}`
                } else {
                    e.target.parentElement.children["card-episode-bar"].children["card-episode-bar-watched"].style.width=`${load[0].list[index].nobyar.watched_episodes/load[0].list[index].nobyar.aired_episodes*100}%`;
                    document.querySelector("#entry_details_container > div:nth-child(2) > p:nth-child(7)").innerText = `Watched: ${load[0].list[index].nobyar.watched_episodes}`

                    trigger.target.children["card-title"].children["card-episode-bar"].children["card-episode-bar-watched"].style.width=`${load[0].list[index].nobyar.watched_episodes/load[0].list[index].nobyar.aired_episodes*100}%`;
                    trigger.target.children["card-episode-num"].children[0].innerText = `${load[0].list[index].nobyar.watched_episodes}[${load[0].list[index].nobyar.aired_episodes}]/${load[0].list[index].nobyar.aired_episodes}`
                }
                // console.log(load[0].list[index].nobyar[1].watched_episodes);
                // console.log(JSON.parse(localStorage.nobyarV2)[0].list[index])
                localStorage.setItem("nobyarV2", JSON.stringify(load))
            } else if(load[0].list[index].nobyar.watched_episodes==1){
                load[0].list[index].nobyar.watched_episodes=0;

                if(load[0].list[index].num_episodes!=0){
                    e.target.parentElement.children["card-episode-bar"].children["card-episode-bar-watched"].style.width=`${load[0].list[index].nobyar.watched_episodes/load[0].list[index].num_episodes*100}%`;
                    document.querySelector("#entry_details_container > div:nth-child(2) > p:nth-child(7)").innerText = `Watched: ${load[0].list[index].nobyar.watched_episodes}`

                    trigger.target.children["card-title"].children["card-episode-bar"].children["card-episode-bar-watched"].style.width=`${load[0].list[index].nobyar.watched_episodes/load[0].list[index].num_episodes*100}%`;
                    trigger.target.children["card-episode-num"].children[0].innerText = `${load[0].list[index].nobyar.watched_episodes}[${load[0].list[index].nobyar.aired_episodes}]/${load[0].list[index].num_episodes}`
                } else {
                    e.target.parentElement.children["card-episode-bar"].children["card-episode-bar-watched"].style.width=`${load[0].list[index].nobyar.watched_episodes/load[0].list[index].nobyar.aired_episodes*100}%`;
                    document.querySelector("#entry_details_container > div:nth-child(2) > p:nth-child(7)").innerText = `Watched: ${load[0].list[index].nobyar.watched_episodes}`

                    trigger.target.children["card-title"].children["card-episode-bar"].children["card-episode-bar-watched"].style.width=`${load[0].list[index].nobyar.watched_episodes/load[0].list[index].aired_episodes*100}%`;
                    trigger.target.children["card-episode-num"].children[0].innerText = `${load[0].list[index].nobyar.watched_episodes}[${load[0].list[index].nobyar.aired_episodes}]/${load[0].list[index].aired_episodes}`
                }
                localStorage.setItem("nobyarV2", JSON.stringify(load))
            }
        })
        document.querySelector("#ep_add").addEventListener("click",function(e){
            let load = JSON.parse(localStorage.getItem("nobyarV2"))
            // console.log(e.target);
            // console.log(load[0].list[index]);
            // console.log(load[0].list[index].nobyar[1].watched_episodes);
            if(load[0].list[index].nobyar.watched_episodes>=0){
                load[0].list[index].nobyar.watched_episodes+=1;

                if(load[0].list[index].num_episodes!=0){
                    e.target.parentElement.children["card-episode-bar"].children["card-episode-bar-watched"].style.width=`${load[0].list[index].nobyar.watched_episodes/load[0].list[index].num_episodes*100}%`;
                    document.querySelector("#entry_details_container > div:nth-child(2) > p:nth-child(7)").innerText = `Watched: ${load[0].list[index].nobyar.watched_episodes}`

                    trigger.target.children["card-title"].children["card-episode-bar"].children["card-episode-bar-watched"].style.width=`${load[0].list[index].nobyar.watched_episodes/load[0].list[index].num_episodes*100}%`;
                    trigger.target.children["card-episode-num"].children[0].innerText = `${load[0].list[index].nobyar.watched_episodes}[${load[0].list[index].nobyar.aired_episodes}]/${load[0].list[index].num_episodes}`
                } else {
                    e.target.parentElement.children["card-episode-bar"].children["card-episode-bar-watched"].style.width=`${load[0].list[index].nobyar.watched_episodes/load[0].list[index].nobyar.aired_episodes*100}%`;
                    document.querySelector("#entry_details_container > div:nth-child(2) > p:nth-child(7)").innerText = `Watched: ${load[0].list[index].nobyar.watched_episodes}`

                    trigger.target.children["card-title"].children["card-episode-bar"].children["card-episode-bar-watched"].style.width=`${load[0].list[index].nobyar.watched_episodes/load[0].list[index].nobyar.aired_episodes*100}%`;
                    trigger.target.children["card-episode-num"].children[0].innerText = `${load[0].list[index].nobyar.watched_episodes}[${load[0].list[index].nobyar.aired_episodes}]/${load[0].list[index].nobyar.aired_episodes}`
                }
                // console.log(load[0].list[index].nobyar[1].watched_episodes);
                // console.log(JSON.parse(localStorage.nobyarV2)[0].list[index])
                localStorage.setItem("nobyarV2", JSON.stringify(load))
                // console.log(JSON.parse(localStorage.nobyarV2)[0].list[index])
            }
        })
    } catch (error) {
        sendError(error,node,"Error creating entry, createEntryWindow()")
    }
}

// ========================================================
function toast(type, text){ // Create toast notification when executed
    const notify = document.createElement("div")
    notify.className = type
    notify.innerHTML=`<p>${text}</p>`
    document.querySelector("#alert").appendChild(notify)
    let alert = document.querySelectorAll("#alert > .notice")
    for(i=0;i<alert.length;i++){
        alert[i].addEventListener("animationend", function(e){
            e.target.remove()
            console.log("remove",e)
        })
    }
}

// ========================================================
function addMeanHistory(node){
    // console.warn(oldNode[0].list[index],newNode)
    // newNode.mean = oldNode[0].list[index].mean+0.1
    let newMean = {"timestamp":`${node.updated_at}`,"mean":node.mean}
    node.nobyar.mean_history.push(newMean)
    // return node
}
function updateMeanHistory(index,oldNode,newNode){
    // console.warn(oldNode[0].list[index],newNode)
    // newNode.mean = Math.floor(Math.random() * 10) + 1;
    if(newNode.nobyar.mean_history.length==0||newNode.mean!=oldNode[0].list[index].mean){
        let newDate = new Date().toISOString();
        let newMean = {"timestamp":`${newDate}`,"mean":newNode.mean}
        newNode.nobyar.mean_history.push(newMean)
        oldNode[0].list[index] = newNode;
    }
    return newNode
}

// ========================================================
function createHistoryChart(node){
    google.charts.load('current',{packages:['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
    // Set Data
    var meanarr = node.nobyar.mean_history
    var label = [['Date', 'Score']]
    for(i=0;i<meanarr.length;i++){
        let currDate = new Date(meanarr[i].timestamp)
        label.push([currDate,meanarr[i].mean])
        // console.log(currDate)
    }
    var data = google.visualization.arrayToDataTable(label);
    // Set Options
    var options = {
    lineWidth: 5,
    pointSize: 8,
    legend: 'none'
    };
    // Draw
    var chart = new google.visualization.LineChart(document.getElementById('myChart'));
    chart.draw(data, options);
    }
}