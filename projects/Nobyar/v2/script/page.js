// var saveArray = [
//     {
//         "list":[],
//         "config":[
//             {
//                 "webhook":[]
//             }
//         ]
//     }
// ]

// var user_data = localStorage.getItem("nobyarV2")


// if (user_data==null){ // If previous save data exist
//     // Create new empty save data
//     localStorage.setItem("nobyarV2", JSON.stringify(saveArray))
//     console.warn("Save data not found, new save data created",JSON.parse(localStorage.getItem("nobyarV2")))
// } else { // ## Else, load existing data
//     console.warn("Save data found, loading save data...",JSON.parse(user_data))
// }

// If user focuses on search bar
// document.querySelector("#header-section > input[type=text]").addEventListener("focus", function(e) {
//     if(document.querySelectorAll(".dim").length<=0){

//         // Create dim element for header and container
//         const dimhead = document.createElement("div");
//         dimhead.className="dim"
//         document.getElementById("header").insertBefore(dimhead,document.getElementById("header").children[0]);
//         const dimbody = document.createElement("div");
//         dimbody.className="dim"
//         document.getElementById("container").insertBefore(dimbody,document.getElementById("container").children[0]);

//         // Then look for all element with dim class
//         const alldim = document.querySelectorAll(".dim")
//             for (i=0;i<alldim.length;i++){
//                 // Then add eventlistener to those elements
//                 alldim[i].addEventListener("click", function(e){
//                     for(i=0;i<alldim.length;i++){
//                         alldim[i].remove()
//                     }
//                     clearSearch()
//                 })
//             }
//         }
//     // console.warn("dim applied")

//     // console.log(query)
//     function clearSearch(){ // Clear searchbar when executed    
//         document.querySelector("#header-section > input[type=text]").value=""
//         const prevresult = document.getElementById("search-result-overlay")
//         prevresult.innerHTML=""
//         prevresult.style="pointer-events:none"
//     }
// })

// If user typed something on search bar
// document.querySelector("#header-section > input[type=text]").addEventListener("input", function(e) {
//     let query = e.target.value
//     if (query.length>=3){ // If query is longer than/equal to 3 characters
//         console.log(query.length,query)
//         getAnime(query).then(response =>{ // Search MAL for specified search query
//             const result = document.getElementById("search-result-overlay")
//             result.innerHTML=""
//             result.style="pointer-events:auto"

//             for(i=0;i<response.length;i++){ // Iterate all responses to display on the page
//                 const items = document.createElement("div");
//                 items.id="items"
//                 items.setAttribute("data-index",i)

//                 // Incase response does not contain "start_season" field
//                 if(response[i].node.start_season&&response[i].node.genres){ // If "start_season" exist, display on details tag
//                     items.innerHTML=`
//                     <div id="poster" style="background-image: url(${response[i].node.main_picture.large});">
//                     <div id="label">Add to list</div>
//                     </div>
//                     <div id="info">
//                         <div id="title">${response[i].node.title}</div>
//                         <div id="genre">${response[i].node.genres.map(x => x.name).join(", ")}</div>
//                         <div id="details">
//                             <div id="score">${response[i].node.mean}</div>
//                             <div id="type">${response[i].node.media_type}</div>
//                             <div id="status">${response[i].node.status}</div>
//                             <div id="season">${response[i].node.start_season.season} ${response[i].node.start_season.year}</div>
//                         </div>
//                         <div id="synopsis">${response[i].node.synopsis}</div>
//                     </div>`
//                 } else if(response[i].node.genres){ // If only "genres" exist, display on details tag
//                     // let error = new Error("start_season is undefined")
//                     // error.name = "no start_season"
//                     // sendError(`genre`,query,``)
//                     items.innerHTML=`
//                     <div id="poster" style="background-image: url(${response[i].node.main_picture.large});">
//                     <div id="label">Add to list</div>
//                     </div>
//                     <div id="info">
//                         <div id="title">${response[i].node.title}</div>
//                         <div id="genre">${response[i].node.genres.map(x => x.name).join(", ")}</div>
//                         <div id="details">
//                             <div id="score">${response[i].node.mean}</div>
//                             <div id="type">${response[i].node.media_type}</div>
//                             <div id="status">${response[i].node.status}</div>
//                         </div>
//                         <div id="synopsis">${response[i].node.synopsis}</div>
//                     </div>`
//                 } else {
//                     items.innerHTML=`
//                     <div id="poster" style="background-image: url(${response[i].node.main_picture.large});">
//                     <div id="label">Add to list</div>
//                     </div>
//                     <div id="info">
//                         <div id="title">${response[i].node.title}</div>
//                         <div id="genre">-</div>
//                         <div id="details">
//                             <div id="score">${response[i].node.mean}</div>
//                             <div id="type">${response[i].node.media_type}</div>
//                             <div id="status">${response[i].node.status}</div>
//                         </div>
//                         <div id="synopsis">${response[i].node.synopsis}</div>
//                     </div>`
//                 }
                
//                 // Add a click eventlistener to search results created from search response
//                 items.addEventListener("click", function(e){ 
//                     // Declare response as data
//                     let data = response[e.target.attributes["data-index"].value].node
//                     let savedata = JSON.parse(localStorage.getItem("nobyarV2"))
//                     console.log("Save data: ",savedata[0].list)

//                     let customProperty = 
//                     {
//                         "nobyar":[
//                             {
//                                 "aired_episodes":0
//                             },
//                             {
//                                 "watched_episodes":0
//                             },
//                             {
//                                 "external_link":[
//                                     {
//                                         "name":"Yugen",
//                                         "url":""
//                                     }
//                                 ]
//                             }   
//                         ]
//                     }
//                     // Then assign custom property above to data
//                     Object.assign(data,customProperty)
//                     console.log(e.target.children.info.children.title.innerText,data)

//                     // Search Yugen with title as query
//                     searchYugen(e.target.children.info.children.title.innerText).then(response=>{
//                         // Then parse response from Yugen
//                         let parse = new DOMParser().parseFromString(response,"text/html")
//                         let item = parse.querySelector(`[title='${e.target.children.info.children.title.innerText}']`)
//                         let url = `https://yugen.to${item.getAttribute("href")}watch/`
//                         // console.log(url)

//                         // Request Yugen again with parsed URL to get all available episodes
//                         allepsYugen(url).then(response=>{
//                             // Parse the response
//                             let parse = new DOMParser().parseFromString(response,"text/html")
//                             let item = parse.querySelectorAll(`.ep-card`)
                            
//                             // console.log(`${item.length} episode aired`)

//                             // Insert new info to data
//                             data.nobyar[0].aired_episodes = item.length
//                             data.nobyar[2].external_link[0].url = url
                            
//                             if (savedata[0].list.length>0){ // If list in savedata not empty
//                                 for(i=0;i<savedata[0].list.length;i++){ // Iterate all list in savedata
//                                     console.log(savedata[0].list[i].id,savedata[0].list[i].title)
//                                         if(data.id==savedata[0].list[i].id){ // If data id is the same as the one in save data
//                                             // console.warn("duplicate")
//                                             break; // stop iterating
//                                         } else if(i==savedata[0].list.length-1&&data.id!=savedata[0].list[i].id){ // else if done iterating AND no duplicate found, add to savedata
//                                             console.log("unique",data)
//                                             savedata[0].list.push(data)
//                                             localStorage.setItem("nobyarV2", JSON.stringify(savedata))
//                                             let save = JSON.parse(localStorage.getItem("nobyarV2"))
//                                             createcard(data,save[0].list.length-1)
//                                             notify("notice",`Successfully added "${data.title}" to the list`)

//                                             console.log(save)
//                                         }
//                                         console.log(i,savedata[0].list.length)
//                                 }
//                             }else if(savedata[0].list.length<1){ // Else if list in savedata is empty, just add without checking for duplicates
//                                 savedata[0].list.push(data)
//                                 localStorage.setItem("nobyarV2", JSON.stringify(savedata))
//                                 let save = JSON.parse(localStorage.getItem("nobyarV2"))
//                                 createcard(data,save[0].list.length-1)
//                                 notify("notice",`Successfully added "${data.title}" to the list`)
//                                 console.log(save)
//                             }
//                             if(document.querySelector("#empty")){ // if empty list message exist, remove it
//                                 document.querySelector("#empty").style="display:none"
//                             }
//                         }).catch(err=>{
//                             console.error(err)
//                         })
//                     }).catch(err=>{
//                         // console.error(err)
//                         sendError(err,data,`Yugen page not found for __***${e.target.children.info.children.title.innerText} (${data.id})***__`)
//                         if (savedata[0].list.length>0){ // If list in savedata not empty
//                             for(i=0;i<savedata[0].list.length;i++){ // Iterate all list in savedata
//                                 console.log(savedata[0].list[i].id,savedata[0].list[i].title)
//                                     if(data.id==savedata[0].list[i].id){ // If data id is the same as the one in save data
//                                         // console.warn("duplicate")
//                                         break; // stop iterating
//                                     } else if(i==savedata[0].list.length-1&&data.id!=savedata[0].list[i].id){ // else if done iterating AND no duplicate found, add to savedata
//                                         console.log("unique",data)
//                                         savedata[0].list.push(data)
//                                         localStorage.setItem("nobyarV2", JSON.stringify(savedata))
//                                         let save = JSON.parse(localStorage.getItem("nobyarV2"))
//                                         createcard(data,save[0].list.length-1)
//                                         notify("notice",`Successfully added "${data.title}" to the list`)

//                                         console.log(save)
//                                     }
//                                     console.log(i,savedata[0].list.length)
//                             }
//                         }else if(savedata[0].list.length<1){ // Else if list in savedata is empty, just add without checking for duplicates
//                             savedata[0].list.push(data)
//                             localStorage.setItem("nobyarV2", JSON.stringify(savedata))
//                             let save = JSON.parse(localStorage.getItem("nobyarV2"))
//                             createcard(data,save[0].list.length-1)
//                             notify("notice",`Successfully added "${data.title}" to the list`)
//                             console.log(save)
//                         }
//                     })
//                     // data.push(customProperty)
//                     // page_loadlist()
//                 })
//                 document.getElementById("search-result-overlay").appendChild(items);
//             }
//             // console.warn(response)
//         }).catch(err=>{
//             if (err.status<500){
//                 sendError(err,query,``)
//             } else {
//                 console.error(err)
//             }
//         })
//     } else if (query.length==0){ // If search query is empty, clear search results
//         const prevresult = document.getElementById("search-result-overlay")
//         prevresult.innerHTML=""
//         prevresult.style="pointer-events:none"
//     }
// })
// page_loadlist()
// function page_loadlist(){ // Executed when page loaded
//     try {
//         let data = JSON.parse(localStorage.getItem("nobyarV2"))
//         // console.log(data[0].list.length)

//         if(!data){ // If save data somehow doesn't exist, refresh
//             location.reload()
//         }

//         if (data[0].list.length==0){ // If list is empty, display a message
//             // display random face just for fun :\
//             let randFace = Math.round(Math.random()*2)
//             let face
//             if (randFace==0){
//                 face = ":("
//             } else {
//                 face = "D:"
//             }

//             console.error("List Empty")
//             const empty = document.createElement("div");
//             empty.id="empty";
//             empty.innerHTML=`
//             <h1>${face}</h1>
//             <h3>Hmm...Looks like your list is empty</h3>
//             <p><span>why not add some to your list?</span></p>`
//             document.getElementById("container").appendChild(empty);

//             document.querySelector("#empty > p > span").addEventListener("click", function(){ // When hint clicked, focuses user to search input
//                 document.querySelector("#header-section > input[type=text]").focus();
//             });
//         } else if(data[0].list.length!=0){ // Else if list is not empty, display user lists
//         console.warn(data[0].list)
//             for(i=0;i<data[0].list.length;i++){
//                 createcard(data[0].list[i],i)
//             }
//         }
//     } catch (error) {
//         sendError(error,JSON.parse(localStorage.getItem("nobyarV2")),"Error loading page, page_loadlist()")
//     }
// }

// function createcard(node,index){ // Create cards when executed
//     try {
//         // console.log(node)
//         if(node.num_episodes==0){ // Total episode is unknown, make it the same as aired
//             node.num_episodes=node.nobyar[0].aired_episodes
//         }
//         const card = document.createElement("div");
//         card.id="card"
//         card.title=`${node.title}`
//         card.setAttribute("data-index",index)
//         card.innerHTML=`
//         <img src="${node.main_picture.large}" alt="${node.title}">
//         <div id="card-episode-num"><span>${node.nobyar[1].watched_episodes}[${node.nobyar[0].aired_episodes}]/${node.num_episodes}</span></div>
//         <div id="card-title">
//             <div id="card-episode-bar">
//                 <div id="card-episode-bar-aired" style="width: ${node.nobyar[0].aired_episodes/node.num_episodes*100}%;"></div>
//                 <div id="card-episode-bar-watched" style="width: 0%;"></div>
//             </div>
//             <p>${node.title}</p>
//         </div>`;
//         if (node.status=="not_yet_aired"){
//             card.style="border:2px dashed gray"
//         } else if (node.status=="currently_airing"){
//             card.style="border:2px dotted rgba(86, 204, 255, 1)"
//         } else if (node.status=="finished_airing"){
//             card.style="border:2px solid white"
//         }
//         // console.log(node.nobyar[0].aired_episodes)
//         document.getElementById("contentEntries").appendChild(card)
//         card.addEventListener("click",function(e){
//             console.log("Index: ",e.target.attributes["data-index"].value)
//             let load = JSON.parse(localStorage.getItem("nobyarV2"))
//             // console.log("Save",save)
//             // let openLink = save[0].list[e.target.attributes["data-index"].value].nobyar[2].external_link[0].url
//             updateAnime(node.id).then(response => {
//                 console.log("New: ",response)
//                 console.log("Old: ",load[0].list[index])
                

//                 createEntryWindow(load[0].list[index],index)
//             }).catch(err =>{
//                 console.error(err)
//                 createEntryWindow(node,index)
//             })
//             // test(openLink)
//             // window.open(openLink);
//         })   
//     } catch (error) {
//         sendError(error,node,"Error creating card, createcard()")
//     }
// }

// function createEntryWindow(node,index){
//     try {
//         let season
//         if(node.start_season==undefined){
//             season = `${node.start_date}`
//             if(node.start_date==undefined){
//                 season = `Release date unknown`
//             }
//         } else {
//             season = `${node.start_season.season} ${node.start_season.year}`
//         }
//         let genres
//         if (node.genres){
//             genres = node.genres.map(x => x.name).join(", ")
//         } else {
//             genres = "-"
//         }
//         const entryWindow = document.createElement("div");
//         entryWindow.id="entry_container"
//         entryWindow.setAttribute("data-index",index)
//         entryWindow.innerHTML=`
//             <div id="entry_poster" style="background-image:url(${node.main_picture.large});background-repeat: no-repeat;background-position: center;background-size:contain;">
//                 <!-- Poster -->
//                 <div id="entry_return">
//                     <span class="material-symbols-outlined">close</span>
//                 </div>
//             </div>
//             <div id="entry_details_container">
//                 <!-- Details container -->
//                 <div class="entry_details_section">
//                     <!-- Details -->
//                     <a href="https://myanimelist.net/anime/${node.id}" target="_blank" style="text-decoration:none; color:white;"><h1>${node.title}</h1></a>
//                     <h3><span style="text-transform:capitalize">${season}</span> | <span style="text-transform:uppercase">${node.media_type}, </span><span style="text-transform:capitalize">${node.status.replace(/_/g, ' ')}</span></h3>
//                     <h4>${genres}</h4>
//                     <p><span style="line-height:1.5;">${node.synopsis}</span></p>
//                     <div id="entry_remove" style="background-color:red;color:white;cursor:pointer;width:fit-content"><span id="entry_remove" class="material-symbols-outlined">delete</span></div>
//                 </div>
//                 <div class="entry_details_section">
//                     <!-- Details -->
//                     <h2>Episodes</h2>
//                     <div id="ep_rem"><span class="material-symbols-outlined">remove</span></div><div id="ep_add"><span class="material-symbols-outlined">add</span></div>
//                     <br>
//                     <br>
//                     <div id="card-episode-bar">
//                         <div id="card-episode-bar-aired" style="width: ${node.nobyar[0].aired_episodes/node.num_episodes*100}%;"></div>
//                         <div id="card-episode-bar-watched" style="width: ${node.nobyar[1].watched_episodes/node.num_episodes*100}%;"></div>
//                     </div>
//                     <p>Watched: ${node.nobyar[1].watched_episodes}</p>
//                     <p>Aired: ${node.nobyar[0].aired_episodes}</p>
//                     <strong>Total: ${node.num_episodes}</strong>
//                 </div>
//                 <div class="entry_details_section">
//                     <!-- Details -->
//                     <h2>Watch</h2>
//                     <p><a href="${node.nobyar[2].external_link[0].url}" target="_blank" style="color:inherit;">YugenAnime</a></p>
//                 </div>
//             </div>`;
//         // console.log(node.nobyar[0].aired_episodes)
//         document.body.appendChild(entryWindow)
//         document.querySelector("#entry_return").addEventListener("click",function(e){
//             // console.log("Index: ",e.target.attributes["data-index"].value)
//             // console.log(e)
//             e.target.parentElement.parentElement.remove()
//             // let save = JSON.parse(localStorage.getItem("nobyarV2"))
//             // console.log("Save",save)
//         })
//         document.querySelector("#entry_remove").addEventListener("click",function(e){
//             // console.log("Index: ",e.target.attributes["data-index"].value)
//             // console.log(e)
//             e.target.parentElement.parentElement.parentElement.remove()
//             let load = JSON.parse(localStorage.getItem("nobyarV2"))
//             load[0].list.splice(index,1);
//             // console.log("Save",load[0].list)
//             // document.querySelector(`#card[data-index="${index}"]`).remove()
//             location.reload()

//             localStorage.setItem("nobyarV2", JSON.stringify(load))
//         })
//     } catch (error) {
//         sendError(error,node,"Error creating entry, createEntryWindow()")
//     }
// }

// function notify(type, text){ // Create toast notification when executed
//     const notify = document.createElement("div")
//     notify.className = type
//     notify.innerHTML=`<p>${text}</p>`
//     document.querySelector("#alert").appendChild(notify)
//     let alert = document.querySelectorAll("#alert > .notice")
//     for(i=0;i<alert.length;i++){
//         alert[i].addEventListener("animationend", function(e){
//             e.target.remove()
//             console.log("remove",e)
//         })
//     }
// }

function test(q){
    allepsYugen(q).then(response=>{
        let parse = new DOMParser().parseFromString(response,"text/html")
        let item = parse.querySelectorAll(`.ep-card`)
        for(i=0;i<1;i++){
            console.log(`https://yugen.to${item[i].children[1].attributes[0].value}`,item[i].children[1].innerText)
            let watchURL = `https://yugen.to${item[i].children[1].attributes[0].value}`
            watchYugen(watchURL).then(response=>{
                let parse = new DOMParser().parseFromString(response,"text/html")
                console.warn(`https:${parse.querySelectorAll("#main-embed")[0].attributes.src.value}`,parse)
                window.open(`https:${parse.querySelectorAll("#main-embed")[0].attributes.src.value}`,`test`,`scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
                width=500,height=250,left=-1000,top=-1000`);
            })
        }
        console.log(parse,item,`https://yugen.to${item[0].children[1].attributes[0].value}`)
    }).catch(err=>{
        console.error(err)
    })
}