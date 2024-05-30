"use strict";
import "../request.js"
import { Eclick } from "./eventlisteners.js";

export function debug(type,data) {
    if (type==="error"){
        console.error(data);
    }else if (type==="warn"){
        console.warn(data);
    }else{
        console.log(data);
    }
}
export const component = {
    create:{
        listEmpty: (data) => {
            const randFace = Math.round(Math.random() * 2);
            const face = randFace === 0 ? ":(" : "D:";
            console.error("List Empty",data)
    
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
        },
        notify: (type, text) => {
            if(type=="notify"){
                const notify = document.createElement("div")
                notify.className = type
                notify.innerHTML=`<p>${text}</p>`
                notify.addEventListener("animationend", function(e){
                    this.remove()
                    // console.log("removed alert :",e)
                })
                document.querySelector("#alert").appendChild(notify)
            }else if(type=="canvasAlert"){
                const notify = document.createElement("div")
                notify.className = type
                notify.innerHTML=`<img src="${text}" style="float:left;">Schedule copied to clipboard</img>`
                notify.addEventListener("animationend", function(e){
                    this.remove()
                    // console.log("removed alert :",e)
                })
                document.querySelector("#alert").appendChild(notify)
            }
        }
    },
    search:{
        bgDim: () =>{
            try {
                // Prevent multiple dim element
                if(document.querySelector("#fadeDim").childElementCount==0){
                    // Create dim element for header and container
                    const dimElem = document.createElement("div");
                    dimElem.className="dim";
                    dimElem.addEventListener("click", dimClick);
                    document.getElementById("fadeDim").appendChild(dimElem);
                }else{
                    debug('warn',`Dim already exist: ${document.querySelector("#fadeDim").childElementCount} dim found`)
                }
                function dimClick(event) {
                    const elemEventTriggered = event.target;
                    elemEventTriggered.removeEventListener("click",dimClick);
                    elemEventTriggered.remove();
                    component.search.hideSearchResults()
                }
            } catch (error) {
                console.error(error);
            }
        },
        searchResults: (results) => {
            for (let i = 0; i < results.data.length; i++) {
                const resultOverlay = document.getElementById("search-result-overlay");
                const entry = results.data[i].node;
                const posterURL = entry.main_picture ? entry.main_picture.large : "";
                const genres = entry.genres ? entry.genres.map(x => x.name).join(", ") : "unavailable";
                const startSeason = entry.start_season ? `${entry.start_season.season} ${entry.start_season.year}` : "";

                // Add customProperty to data
                Object.assign(entry, {
                    "nobyar": {
                        "aired_episodes": 0,
                        "watched_episodes": 0,
                        "mean_history": [],
                        "external_source": []
                    }
                });

                const items = document.createElement("div");
                items.id = "items";
                items.setAttribute("data-index", i);
                items.innerHTML = `
                    <div id="poster" style="background-image: url(${posterURL});">
                    <div id="label">Add to list</div>
                    </div>
                    <div id="info">
                    <div id="title">${entry.title}</div>
                    <div id="genre">${genres}</div>
                    <div id="details">
                        <div id="score">${entry.mean}</div>
                        <div id="type">${entry.media_type}</div>
                        <div id="status">${entry.status}</div>
                        <div id="season">${startSeason}</div>
                    </div>
                    <div id="synopsis">${entry.synopsis || "Synopsis not available"}</div>
                    </div>
                `;
                items.addEventListener("click", function(e){Eclick.resultClick(e,results)})

                resultOverlay.appendChild(items);
            }
        },
        hideSearchResults: () => {
            // Clear search results when executed
            // document.querySelector("#header-section > input[type=text]").value=""
            try {
                const searchResult = document.getElementById("search-result-overlay")
                if(searchResult){
                    // prevresult.innerHTML=""
                    searchResult.style="pointer-events:none;display:none"
                }   
            } catch (error) {
                console.error(error);
            }
        },
        resetSearchResults: (elem) => {
            try {
                if(elem?.childElementCount!=0){
                    while (elem.childElementCount!=0) {
                        console.warn("Clearing previous results");
                        elem.children[0],removeEventListener("click",function(e){Eclick.resultClick(e,response)})
                        elem.removeChild(elem.children[0])
                    }
                    elem.innerHTML = "";
                }
            } catch (error) {
                console.error("[Search]",error);
            }
            
        }
    },
    library:{
        validateData: (node,type) => {
            if (type==="score"){
                if (node.mean === undefined) return "???"
                return `${node.mean}`
            }
            if (type==="season") {
                if (node.start_season === undefined) return node.start_date ? `${node.start_date}` : "Airing date unknown";
                return `${node.start_season.season} ${node.start_season.year}`;
            }
            if (type==="genres") {
                return node.genres ? node.genres.map(x => x.name).join(", ") : "-";
            }
            if (type==="sources") {
                return node.nobyar.external_source.length !== 0 
            }
            // const hasExternalSources = node.nobyar.external_source.length !== 0;
        },
        detailWindow: (node,index) => {
            try {
                // TODO: remake detail window code to be less spaghetti-ish
            // Check if external sources are available
            
            // element.library.detailComponent(`
            //     <h1>Test</h1>
            // `)
            // Create the entry window
            const entryWindow = document.createElement("div");
            entryWindow.id = "entry_container";
            entryWindow.setAttribute("data-index", index);
            
            const entryPoster = document.createElement("div");
            entryPoster.id = "entry_poster";
            entryPoster.style = `background-image:url(${node.main_picture.large}); background-repeat: no-repeat; background-position: center; background-size: cover;`;
            entryWindow.appendChild(entryPoster);

            const entryReturn = document.createElement("div");
            entryReturn.id = "entry_return";
            entryReturn.innerHTML = "<span class='material-symbols-outlined'>close</span>";
            entryReturn.addEventListener("click",Eclick.detailClose);
            entryPoster.appendChild(entryReturn);

            const entryDetailsContainer = document.createElement("div");
            entryDetailsContainer.id = "entry_details_container";
            
            const section = document.createElement("div")
            section.classList = "entry_details_section"
            section.innerHTML = `
            <a href="https://myanimelist.net/anime/${node.id}" target="_blank" style="text-decoration:none; color:white;"><h1 data-nobyarelemtype="title">${node.title}</h1></a>

            <div class="entry_details_overview">
                <div class="entry_details_overview_score">
                    <div>
                        <span>${component.library.validateData(node,"score")}</span>
                    </div>
                    <div>Score</div>
                </div>
                <div class="entry_details_overview_info">
                    <h3><span style="text-transform: capitalize">${component.library.validateData(node,"season")}</span> | <span style="text-transform: uppercase">${node.media_type}, </span><span style="text-transform: capitalize">${node.status.replace(/_/g, ' ')}</span></h3>
                    <h4>${component.library.validateData(node,"genres")}</h4>
                    <h5>Rank: #${node.rank} • Popularity: #${node.popularity} • MAL Users: ${node.num_list_users} • MAL Users Favorite: ${node.num_favorites}</h5>
                </div>
            </div>

            <!-- 
            <div id="synopsisContainer">
                <p id="synopsis" class="entry_details_synopsisCollapsed">${node.synopsis}}</p>
            </div>
            -->
            <!--
            <div id="entry_remove" style="background-color:red;color:white;cursor:pointer;width:fit-content"><span id="entry_remove" class="material-symbols-outlined">delete</span></div>
            -->
            </div>`;

            const synCon = document.createElement("div")
            synCon.id = "synopsisContainer"

            const synopsis = document.createElement("p");
            synopsis.id = "synopsis";
            synopsis.classList = "entry_details_synopsisCollapsed"
            synopsis.innerText = node.synopsis
            
            // return synopsis.outerHTML
            
                // return `<p id="synopsis" class="entry_details_synopsisCollapsed">${node.synopsis}}</p>`
            // console.log(synopsis);

            function truncateButton() {
                try {
                    const syno = document.querySelector("#synopsisContainer > #synopsis")
                    console.log(syno);
                    if (syno.scrollHeight>syno.offsetHeight) {
                        console.warn("long syn detected");
                        const truncButton = document.createElement("div");
                        truncButton.id = "toggleSynopsis"
                        truncButton.innerText = "Show More"
                        // console.log("added eventClick");
                        truncButton.addEventListener("click",function() {
                            if(truncButton.hasAttribute("data-expand")===true){
                                truncButton.previousElementSibling.classList = "entry_details_synopsisCollapsed"
                                truncButton.innerText = "Show More"
                                truncButton.removeAttribute("data-expand")
                            } else {
                                truncButton.previousElementSibling.classList = "entry_details_synopsisExpanded"
                                truncButton.innerText = "Show Less"
                                truncButton.setAttribute("data-expand",true)
                            }
                        })
                        syno.parentElement.appendChild(truncButton);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            synCon.appendChild(synopsis)
            section.appendChild(synCon)
            entryDetailsContainer.appendChild(section)
            entryWindow.appendChild(entryDetailsContainer)
            document.querySelector("#overlay").appendChild(entryWindow);
            truncateButton()
            console.log(node,index);
            } catch (error) {
                console.error(error);
            }

        // if (node.synopsis.length>128) {
        //     const truncButton = document.createElement("div");
        //     truncButton.id = "toggleSynopsis"
        //     console.log("added eventClick");
        //     truncButton.innerText = "Show More"
        //     truncButton.addEventListener("click",function() {
        //         if(truncButton.hasAttribute("data-expand")===true){
        //             truncButton.previousElementSibling.classList = "entry_details_synopsisCollapsed"
        //             truncButton.innerText = "Show More"
        //             truncButton.removeAttribute("data-expand")
        //         } else {
        //             truncButton.previousElementSibling.classList = "entry_details_synopsisExpanded"
        //             truncButton.innerText = "Show Less"
        //             truncButton.setAttribute("data-expand",true)
        //         }
        //     })
        //     entryWindow.querySelector("#synopsisContainer").appendChild(truncButton);
        // }
        // // console.log(window.getComputedStyle(entryWindow.querySelector("#synopsis")));
        // function synopsisLoad(node) {
        //     console.log(container);
        //     const synopsis = document.createElement("div");
        //     synopsis.id = "synopsis";
        //     synopsis.classList = "entry_details_synopsisCollapsed"
        //     synopsis.innerText = node.synopsis
        //     return synopsis.outerHTML
        //     // return `<p id="synopsis" class="entry_details_synopsisCollapsed">${node.synopsis}}</p>`
        // }
        // let detailCloseButton = entryWindow.querySelector("#entry_return")
        // detailCloseButton.addEventListener("click", Eclick.detailClose)
                
        //         `

        //         entryDetailsContainer.appendChild(section)
        //     }

        //     // Generate the inner HTML based on external sources
        //     // entryWindow.innerHTML =
            //     <div id="entry_poster" style="background-image:url(${node.main_picture.large});background-repeat: no-repeat;background-position: center;background-size:cover;">
            //         <!-- Poster -->
            //         <div id="entry_return">
            //             <span class="material-symbols-outlined">close</span>
            //         </div>
            //     </div>
            //     <div id="entry_details_container">
            //         <!-- Details container -->
            //         <div class="entry_details_section">
            //             <!-- Details -->

            // // Append the entry window to the overlay
        },
        entryDetailWindow: (node, index, trigger) => {
            try {
                // console.log('node: ',node);
                // console.log('index: ',index);
                // console.log('trigger: ',trigger);
                // Helper function to get the season string
                // extraData(index,node.id,node)
        
                // Event listeners 
                // document.querySelector("#entry_return").addEventListener("click", function (e) {
                //     e.target.parentElement.parentElement.remove();
                // });
        
                // // Add a click event listener to toggle the synopsis
                // const maxHeight = 4.5 * parseFloat(window.getComputedStyle(document.querySelector("#synopsis")).fontSize); // Convert 4.5em to pixels
                // // console.log("MaxHeight: ",maxHeight)
                // if (document.querySelector("#synopsis").scrollHeight > maxHeight) {
                //     // console.log('More');
                //     document.querySelector("#toggleSynopsis").addEventListener("click", function (e) {
                //         const synopsis = document.querySelector("#synopsis");
                //         const isCollapsed = synopsis.classList.contains("entry_details_synopsisCollapsed");
                //         if (isCollapsed) {
                //             // Expand the synopsis
                //             // synopsis.classList.remove("entry_details_synopsisCollapsed");
                //             synopsis.classList.value = "entry_details_synopsisExpanded";
                //             // console.log(synopsis.classList);
                //             document.querySelector("#toggleSynopsis").textContent = "Show Less";
                //         } else {
                //             // Collapse the synopsis
                //             // synopsis.classList.remove("entry_details_synopsisExpanded");
                //             synopsis.classList.value = "entry_details_synopsisCollapsed";
                //             // console.log(synopsis.classList);
                //             document.querySelector("#toggleSynopsis").textContent = "Show More";
                //         }
                //     });
                // } else {
                //     // console.log('Less');
                //     document.querySelector("#toggleSynopsis").style = `
                //         pointer-events:none; display:none;
                //     `;
                // }
        
                document.querySelector("#entry_remove").addEventListener("click", function (e) {
                    const load = loadingUserData();
                    load[0].list.splice(index, 1);
                    // localStorage.setItem("nobyarV2", JSON.stringify(load));
                    savingUserData(load, "Entry window, User manual delete entry")
                    location.reload();
                });
        
                // Add/Remove episode event listeners
                const epRem = document.querySelector("#ep_rem");
                const epAdd = document.querySelector("#ep_add");
        
                epRem.addEventListener("click", function () {
                    updateWatchedEpisodes(-1);
                });
        
                epAdd.addEventListener("click", function () {
                    updateWatchedEpisodes(1);
                });
        
                // Helper function to update watched episodes
                function updateWatchedEpisodes(change) {
                    if (node.nobyar.watched_episodes + change >= 0) {
                        node.nobyar.watched_episodes += change;
        
                        const watchedPercentage = node.num_episodes !== 0 ? (node.nobyar.watched_episodes / node.num_episodes * 100) : (node.nobyar.watched_episodes / node.nobyar.aired_episodes * 100);
        
                        epRem.parentElement.querySelector("#card-episode-bar-watched").style.width = `${watchedPercentage}%`;
                        document.querySelector("#entry_details_container > div:nth-child(2) > p:nth-child(7)").innerText = `Watched: ${node.nobyar.watched_episodes}`;
                        trigger.target.querySelector("#card-episode-bar-watched").style.width = `${watchedPercentage}%`;
                        trigger.target.querySelector("#card-episode-num > span").innerText = `${node.nobyar.watched_episodes}[${node.nobyar.aired_episodes}]/${node.num_episodes || node.nobyar.aired_episodes}`;
        
                        // localStorage.setItem("nobyarV2", JSON.stringify(load));
                        const load = loadingUserData();
                        load[0].list[index] = node
                        savingUserData(load, "Entry window, User manual episode change")
                    }
                }
        
            } catch (error) {
                sendError(error, node, "Error creating entry, createEntryWindow()");
            }
        }
    }
}
export const userData = {
    load: () => {
        let data = JSON.parse(localStorage.getItem("nobyarV2"))
        if(data){
            // console.warn("Save data found, loading save data...",data[0])
            return data
        }else{
            // Create new empty save data
            let saveArray = {
                "list":[],
                "config":[
                    {
                        "webhook":[]
                    }
                ]
            }
            // localStorage.setItem("nobyarV2", JSON.stringify(saveArray))
            userData.save(saveArray,"New save data")
            console.warn("Save data not found, new save data created",saveArray)
            return userData.load()
        }
    },
    save: (data,info) => {
        if (data){
            localStorage.setItem("nobyarV2", JSON.stringify(data))
            console.groupCollapsed(`[Save] ${info}`)
            console.log("[Save] Saving...",data.list,userData.load().list)
            console.trace("[Save] Saving...",data,userData.load())
            console.groupEnd()
        }
    }
}
export const update = {
    backend: {
        entry: () => {
            MALClient.detail(id,"anime").then(response => {
                let load = loadingUserData();
                // console.log("New: ", response);
                // console.log("Old: ", load[0].list[i]);
        
                let newData = Object.assign({}, load[0].list[index]);
        
                for (let key in response) {
                    if (response[key] !== undefined && response[key] !== newData[key]) {
                        // console.log("Old: ", response[key]);
                        // console.log(newData[key], response[key]);
        
                        newData[key] = response[key];
                    }
                }
                // console.log(newData);
                AnimeScheduleClient.searchByMALID({id:newData.id})
        
                // load[0].list[index] = updateMeanHistory(index,load,newData);
                load[0].list[index] = newData
                // console.log(newData,load[0].list[index]);
                // localStorage.setItem("nobyarV2", JSON.stringify(load));
                savingUserData(load, "Entry update")
        
        
                // extraData(index,id)
        
                // createcard(load[0].list[index], index);
                if(fresh){
                    toast("notify", `Successfully added <b>"${load[0].list[index].title}"</b> to the list`);
                } else {
                    toast("notify", `<b>"${load[0].list[index].title}"</b> data successfully updated`);
                }
            }).catch((err) => {
                if (err.status>=500){
                    // MAL Maintenance | 503
                    toast('notify',`[${err.status} ${err.response[0].error}]\n${err.response[0].message}`)
                }else if (err.status>=400){
                    if(cors_proxy=="https://cors-anywhere.herokuapp.com/"){
                        toast('notify','Open <b>https://cors-anywhere.herokuapp.com</b> and click <b>\'request temporary access to the demo server\'</b>')
                        window.open('https://cors-anywhere.herokuapp.com/', '_blank');
                    }
                }else{
                    console.error("Uh oh!\n"+err);
                    toast('notify',`${err}`)
                    sendError(err,`ID:${id}\nINDEX:${index}\nFRESH:${fresh}`,"Error updating entry data, updateAnime()");
                }
                // createEntryWindow(node,index)
            });
        }
    },
    home: {
        createEntryCard: () => {
            try {
                while (document.querySelector("#contentEntries").firstChild) {
                    document.querySelector("#contentEntries").removeChild(document.querySelector("#contentEntries").firstChild);
                }
                for (let i = 0; i < userData.load().list.length; i++) {
                    let entryCardData = setTimeout(() => {
                        let node = userData.load().list[i]
                        if(node.num_episodes==0){ // Total episode is unknown, make it the same as aired
                            node.num_episodes=node.nobyar.aired_episodes
                        }
                        const card = document.createElement("div");
                        card.className="cardContainer"
                        // card.title=`${node.title}`
                        // card.setAttribute("data-index",index)
                        card.innerHTML=`
                        <div class="cardBorder"></div>
                        <div class="card" title='${node.title}' data-index="${i}">
                            <div class="card-image" style="background-image:url(${node.main_picture.large});" alt="${node.title}"></div>
                            <div class="card-episode-num"><span>${node.nobyar.watched_episodes}[${node.nobyar.aired_episodes}]/${node.num_episodes}</span></div>
                            <div class="card-title">
                                <div class="card-episode-bar">
                                    <div class="card-episode-bar-aired" style="width: ${node.nobyar.aired_episodes/node.num_episodes*100}%;"></div>
                                    <div class="card-episode-bar-watched" style="width: ${node.nobyar.watched_episodes/node.num_episodes*100}%;"></div>
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
                        card.addEventListener("click", Eclick.cardClick)
                        // card.addEventListener("click",function(e){
                        //     // console.log(e.target)
                        //     // let load = JSON.parse(user_data)
                        //     createEntryWindow(node,index,e)
                        //     // console.log(load[0].list[index])
                        //     // console.log("Save",save)
                        //     // let openLink = save[0].list[e.target.attributes["data-index"].value].nobyar[2].external_link[0].url
                            
                        //     // test(openLink)
                        //     // window.open(openLink);
                        // })
                        clearTimeout(entryCardData);
                        // updateEntry(data[0].list[i].id,i)
                    }, i * 150); // wait between each request
                }  
            } catch (error) {
                sendError(error,node,"Error creating card, createcard()")
            }
        }
    }
}