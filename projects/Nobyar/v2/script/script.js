"use strict";
try {    
// ========================================================
// page_loadlist()
// function page_loadlist(){ // Executed when page loaded
//     try {
//         let data = user_data
//         // console.log(data[0].list.length)

//         if(!data){ // If save data somehow doesn't exist, refresh
//             location.reload()
//         }

//         document.querySelector("#hamburger-icon").addEventListener("click", function(e){
//             document.querySelector("#menu").style="transform: translateX(0%);"
//             document.querySelector("#menuClose").addEventListener("click", function(){
//                 document.querySelector("#menu").style="transform: translateX(-100%);"
//             })
//         });

//         if (data[0].list.length==0){ // If list is empty, display a message
//             // display random face just for fun :\
//             const randFace = Math.round(Math.random() * 2);
//             const face = randFace === 0 ? ":(" : "D:";
//             console.error("List Empty",data)

//             const empty = document.createElement("div");
//             empty.id="empty";
//             empty.innerHTML=`
//             <h1>${face}</h1>
//             <h3>Hmm...Looks like your list is empty</h3>
//             <p><span>why not add some to your list?</span></p>`
//             document.getElementById("content").appendChild(empty);

//             document.querySelector("#empty > p > span").addEventListener("click", function(){ // When hint clicked, focuses user to search input
//                 document.querySelector("#header-section > input[type=text]").focus();
//             });
//         } else if(data[0].list.length!=0){ // Else if list is not empty, display user lists
//             console.warn(data[0].list);
//             data[0].list = data[0].list.filter((obj) => Object.keys(obj).length !== 0);
//             // localStorage.setItem("nobyarV2", JSON.stringify(data))
//             savingUserData(data, "Page load, List not empty")
//             for (let i = 0; i < data[0].list.length; i++) {
//                 let entryCardData = setTimeout(() => {
//                     createcard(data[0].list[i],i);
//                     clearTimeout(entryCardData);
//                     // updateEntry(data[0].list[i].id,i)
//                 }, i * 150); // wait between each request
//             }  
//         }
//     } catch (error) {
//         // sendError(error,JSON.parse(localStorage.getItem("nobyarV2")),"Error loading page, page_loadlist():327")
//         console.error(error)
//     }
// }

// ========================================================
// function createcard(node,index){ // Create cards when executed
//     try {
//         if(node.num_episodes==0){ // Total episode is unknown, make it the same as aired
//             node.num_episodes=node.nobyar.aired_episodes
//         }
//         const card = document.createElement("div");
//         card.className="cardContainer"
//         // card.title=`${node.title}`
//         // card.setAttribute("data-index",index)
//         card.innerHTML=`
//         <div class="cardBorder"></div>
//         <div class="card" title='${node.title}' data-index="${index}">
//             <div class="card-image" style="background-image:url(${node.main_picture.large});" alt="${node.title}"></div>
//             <div class="card-episode-num"><span>${node.nobyar.watched_episodes}[${node.nobyar.aired_episodes}]/${node.num_episodes}</span></div>
//             <div class="card-title">
//                 <div class="card-episode-bar">
//                     <div class="card-episode-bar-aired" style="width: ${node.nobyar.aired_episodes/node.num_episodes*100}%;"></div>
//                     <div class="card-episode-bar-watched" style="width: ${node.nobyar.watched_episodes/node.num_episodes*100}%;"></div>
//                 </div>
//                 <p>${node.title}</p>
//             </div>
//         </div>    
//         `;
//         // if (node.status=="not_yet_aired"){
//         //     card.style="border:2px dashed gray"
//         // } else if (node.status=="currently_airing"){
//         //     card.style="border:2px dotted rgba(86, 204, 255, 1)"
//         // } else if (node.status=="finished_airing"){
//         //     card.style="border:2px solid white"
//         // }
//         // console.log(node.nobyar[0].aired_episodes)
//         document.getElementById("contentEntries").appendChild(card)
//         card.addEventListener("click",function(e){
//             // console.log(e.target)
//             // let load = JSON.parse(user_data)
//             createEntryWindow(node,index,e)
//             // console.log(load[0].list[index])
//             // console.log("Save",save)
//             // let openLink = save[0].list[e.target.attributes["data-index"].value].nobyar[2].external_link[0].url
            
//             // test(openLink)
//             // window.open(openLink);
//         })
//     } catch (error) {
//         sendError(error,node,"Error creating card, createcard()")
//     }
// }

// ========================================================
// function createEntryWindow(node, index, trigger) {
//     try {
//         // console.log('node: ',node);
//         // console.log('index: ',index);
//         // console.log('trigger: ',trigger);
//         // Helper function to get the season string
//         function getScoreString() {
//             if (node.mean === undefined) {
//                 return "???";
//             } else {
//                 return `${node.mean}`;
//             }
//         }

//         // Helper function to get the season string
//         function getSeasonString() {
//             if (node.start_season === undefined) {
//                 return node.start_date ? `${node.start_date}` : "Airing date unknown";
//             } else {
//                 return `${node.start_season.season} ${node.start_season.year}`;
//             }
//         }

//         // Helper function to get the genres string
//         function getGenresString() {
//             return node.genres ? node.genres.map(x => x.name).join(", ") : "-";
//         }

//         // Create the entry window
//         const entryWindow = document.createElement("div");
//         entryWindow.id = "entry_container";
//         entryWindow.setAttribute("data-index", index);

//         // Check if external sources are available
//         const hasExternalSources = node.nobyar.external_source.length !== 0;

//         // Generate the inner HTML based on external sources
//         entryWindow.innerHTML = `
//             <div id="entry_poster" style="background-image:url(${node.main_picture.large});background-repeat: no-repeat;background-position: center;background-size:cover;">
//                 <!-- Poster -->
//                 <div id="entry_return">
//                     <span class="material-symbols-outlined">close</span>
//                 </div>
//             </div>
//             <div id="entry_details_container">
//                 <!-- Details container -->
//                 <div class="entry_details_section">
//                     <!-- Details -->
//                     <a href="https://myanimelist.net/anime/${node.id}" target="_blank" style="text-decoration:none; color:white;"><h1 data-nobyarelemtype="title">${node.title}</h1></a>

//                     <div class="entry_details_overview">
//                         <div class="entry_details_overview_score">
//                             <div>
//                                 <span>${getScoreString()}</span>
//                             </div>
//                             <div>Score</div>
//                         </div>
//                         <div class="entry_details_overview_info">
//                             <h3><span style="text-transform: capitalize">${getSeasonString()}</span> | <span style="text-transform: uppercase">${node.media_type}, </span><span style="text-transform: capitalize">${node.status.replace(/_/g, ' ')}</span></h3>
//                             <h4>${getGenresString()}</h4>
//                             <h5>Rank: #${node.rank} • Popularity: #${node.popularity} • MAL Users: ${node.num_list_users} • MAL Users Favorite: ${node.num_favorites}</h5>
//                         </div>
//                     </div>

//                     <div id="synopsisContainer">
//                         <p id="synopsis" class="entry_details_synopsisCollapsed">${node.synopsis}</p>
//                         <div id="toggleSynopsis">Show More</div>
//                     </div>
//                     <div id="entry_remove" style="background-color:red;color:white;cursor:pointer;width:fit-content"><span id="entry_remove" class="material-symbols-outlined">delete</span></div>
//                 </div>
//                 <div class="entry_details_section">
//                     <!-- Details -->
//                     <h2>Episodes</h2>
//                     <div id="ep_rem"><span class="material-symbols-outlined">remove</span></div><div id="ep_add"><span class="material-symbols-outlined">add</span></div>
//                     <br>
//                     <br>
//                     <div id="card-episode-bar">
//                         <div id="card-episode-bar-aired" style="width: ${node.nobyar.aired_episodes / node.num_episodes * 100}%;"></div>
//                         <div id="card-episode-bar-watched" style="width: ${node.nobyar.watched_episodes / node.num_episodes * 100}%;"></div>
//                     </div>
//                     <p>Watched: ${node.nobyar.watched_episodes}</p>
//                     <p>Aired: ${node.nobyar.aired_episodes}</p>
//                     <strong>Total: ${node.num_episodes}</strong>
//                 </div>
//                 <div class="entry_details_section">
//                     <!-- Details -->
//                     <h2>Watch</h2>
//                     ${hasExternalSources ? node.nobyar.external_source.map(source => `<p><a href="${source.url}" target="_blank" style="color:inherit;">${source.name}</a></p>`).join('') : ''}
//                 </div>
//             </div>`;

//         // Append the entry window to the overlay
//         document.querySelector("#overlay").appendChild(entryWindow);
       
//         extraData(index,node.id,node)

//         // Event listeners 
//         document.querySelector("#entry_return").addEventListener("click", function (e) {
//             e.target.parentElement.parentElement.remove();
//         });

//         // Add a click event listener to toggle the synopsis
//         const maxHeight = 4.5 * parseFloat(window.getComputedStyle(document.querySelector("#synopsis")).fontSize); // Convert 4.5em to pixels
//         // console.log("MaxHeight: ",maxHeight)
//         if (document.querySelector("#synopsis").scrollHeight > maxHeight) {
//             // console.log('More');
//             document.querySelector("#toggleSynopsis").addEventListener("click", function (e) {
//                 const synopsis = document.querySelector("#synopsis");
//                 const isCollapsed = synopsis.classList.contains("entry_details_synopsisCollapsed");
//                 if (isCollapsed) {
//                     // Expand the synopsis
//                     // synopsis.classList.remove("entry_details_synopsisCollapsed");
//                     synopsis.classList.value = "entry_details_synopsisExpanded";
//                     // console.log(synopsis.classList);
//                     document.querySelector("#toggleSynopsis").textContent = "Show Less";
//                 } else {
//                     // Collapse the synopsis
//                     // synopsis.classList.remove("entry_details_synopsisExpanded");
//                     synopsis.classList.value = "entry_details_synopsisCollapsed";
//                     // console.log(synopsis.classList);
//                     document.querySelector("#toggleSynopsis").textContent = "Show More";
//                 }
//             });
//         } else {
//             // console.log('Less');
//             document.querySelector("#toggleSynopsis").style = `
//                 pointer-events:none; display:none;
//             `;
//         }

//         document.querySelector("#entry_remove").addEventListener("click", function (e) {
//             const load = loadingUserData();
//             load[0].list.splice(index, 1);
//             // localStorage.setItem("nobyarV2", JSON.stringify(load));
//             savingUserData(load, "Entry window, User manual delete entry")
//             location.reload();
//         });

//         // Add/Remove episode event listeners
//         const epRem = document.querySelector("#ep_rem");
//         const epAdd = document.querySelector("#ep_add");

//         epRem.addEventListener("click", function () {
//             updateWatchedEpisodes(-1);
//         });

//         epAdd.addEventListener("click", function () {
//             updateWatchedEpisodes(1);
//         });

//         // Helper function to update watched episodes
//         function updateWatchedEpisodes(change) {
//             if (node.nobyar.watched_episodes + change >= 0) {
//                 node.nobyar.watched_episodes += change;

//                 const watchedPercentage = node.num_episodes !== 0 ? (node.nobyar.watched_episodes / node.num_episodes * 100) : (node.nobyar.watched_episodes / node.nobyar.aired_episodes * 100);

//                 epRem.parentElement.querySelector("#card-episode-bar-watched").style.width = `${watchedPercentage}%`;
//                 document.querySelector("#entry_details_container > div:nth-child(2) > p:nth-child(7)").innerText = `Watched: ${node.nobyar.watched_episodes}`;
//                 trigger.target.querySelector("#card-episode-bar-watched").style.width = `${watchedPercentage}%`;
//                 trigger.target.querySelector("#card-episode-num > span").innerText = `${node.nobyar.watched_episodes}[${node.nobyar.aired_episodes}]/${node.num_episodes || node.nobyar.aired_episodes}`;

//                 // localStorage.setItem("nobyarV2", JSON.stringify(load));
//                 const load = loadingUserData();
//                 load[0].list[index] = node
//                 savingUserData(load, "Entry window, User manual episode change")
//             }
//         }

//     } catch (error) {
//         sendError(error, node, "Error creating entry, createEntryWindow()");
//     }
// }


// ========================================================
// function toast(type, text){ // Create toast notification when executed
//     if(type=="notify"){
//         const notify = document.createElement("div")
//         notify.className = type
//         notify.innerHTML=`<p>${text}</p>`
//         notify.addEventListener("animationend", function(e){
//             this.remove()
//             // console.log("removed alert :",e)
//         })
//         document.querySelector("#alert").appendChild(notify)
//     }else if(type=="canvasAlert"){
//         const notify = document.createElement("div")
//         notify.className = type
//         notify.innerHTML=`<img src="${text}" style="float:left;">Schedule copied to clipboard</img>`
//         notify.addEventListener("animationend", function(e){
//             this.remove()
//             // console.log("removed alert :",e)
//         })
//         document.querySelector("#alert").appendChild(notify)
//     }
// }

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

    // function findObjectDifference(obj1, obj2) {
    //     const keys1 = Object.keys(obj1);
    //     const keys2 = Object.keys(obj2);
    
    //     // Check if the keys are the same
    //     if (!keys1.every(key => keys2.includes(key)) || !keys2.every(key => keys1.includes(key))) {
    //         return "Objects have different keys.";
    //     }
    
    //     // Compare the values of each property
    //     const differences = {};
    //     for (const key of keys1) {
    //         if (obj1[key] !== obj2[key]) {
    //             differences[key] = {
    //                 oldValue: obj1[key],
    //                 newValue: obj2[key]
    //             };
    //         }
    //     }
    
    //     return differences;
    // }
    // const diff = findObjectDifference(oldNode[0].list[index], newNode);
    // console.log("Object differences:", diff);

    return newNode
}

// ========================================================
function createHistoryChart(node){
    google.charts.load('current',{packages:['corechart']});

    // Set Data
    let meanarr

    // if (Array.isArray(node.nobyar.mean_history) && node.nobyar.mean_history.length > 0) {
    //     // console.log(node.nobyar.mean_history);
    //     meanarr = node.nobyar.mean_history;
    //     google.charts.setOnLoadCallback(drawChart);
    // } else {
    //     getAnimeScoreHistory(node.id).then((response) => {
    //         let ratingData = response.anime.eps
    //         console.log(ratingData);
    //         meanarr = []
    //         for (let i = 1; i < ratingData.length; i++) {
    //             meanarr.push({
    //                 timestamp: ratingData[i].created_at,
    //                 mean: ratingData[i].malRating,
    //             });
    //             console.log(meanarr);

    //             if (i==ratingData.length-1){
    //                 google.charts.setOnLoadCallback(drawChart);
    //             }  
    //         }

    //         // Create the Score History section
    //         const scoreHistorySection = document.createElement("div");
    //         scoreHistorySection.className = "entry_details_section";
    //         scoreHistorySection.innerHTML = `
    //             <h2>Score History</h2>
    //             <div id="myChart"></div>
    //         `;
    //         document.querySelector("#entry_details_container").appendChild(scoreHistorySection);
    //     })
    //     .catch((error) => {
    //         console.error("Error fetching score history:", error);
    //     });
    // }
    getAnimeScoreHistory(node.id).then((response) => {
        let ratingData = response.anime.eps
        // console.log(ratingData);
        meanarr = []
        for (let i = 1; i < ratingData.length; i++) {
            meanarr.push({
                timestamp: ratingData[i].created_at,
                mean: ratingData[i].malRating,
            });
            // console.log(meanarr);

            if (i==ratingData.length-1){
                google.charts.setOnLoadCallback(drawChart);
            }  
        }

        // Create the Score History section
        const scoreHistorySection = document.createElement("div");
        scoreHistorySection.className = "entry_details_section";
        scoreHistorySection.innerHTML = `
            <h2><a href="https://anime-stats.net/anime/show/${node.id}" target="_blank" style="text-decoration:none; color:white;">Score History</a></h2>
            <div id="myChart"></div>
        `;
        document.querySelector("#entry_details_container").appendChild(scoreHistorySection);
    })
    .catch((error) => {
        console.groupCollapsed(`[Score History] Error getting score history for (${node.id}) ${node.title}`)
        console.error(error);
        console.groupEnd()
    });
      

    function drawChart() {
    var label = [['Date', 'Score', {'type': 'string', 'role': 'style'}]]
    var maxMean = -Infinity; // Initialize to a very low value
    var maxMeanIndex = -1;

    // Find the maximum mean and its index
    for (i = 0; i < meanarr.length; i++) {
        let mean = meanarr[i].mean;
        if (mean > maxMean) {
            maxMean = mean;
            maxMeanIndex = i;
        }
    }

    // Populate the label array with data and styles
    for (i = 0; i < meanarr.length; i++) {
        let currDate = new Date(meanarr[i].timestamp);
        let mean = meanarr[i].mean;
        let style = i === maxMeanIndex ? 'point { size: 18; shape-type: star; fill-color: #FFD700; }' : '';
        label.push([currDate, mean, style]);
    }

    var data = google.visualization.arrayToDataTable(label);
    // Set Options
    var options = {
    lineWidth: 5,
    pointSize: 8,
    colors: ['#fff'],
    backgroundColor: { fill:'transparent' },
    hAxis: {
        title:'Timestamp',
        slantedText: false,
        format:'MMM d, y',
        maxAlternation: 2,
        textStyle:{color: '#FFF'},
	    titleTextStyle:{color: '#FFF'}
    },
    vAxis: {
        title:'Score',
        textStyle:{color: '#FFF'},
        titleTextStyle:{color: '#FFF'},
            gridlines: {color: '#787878'}
    },
    legend:'none'
    };
    // Draw
    
    var chart = new google.visualization.LineChart(document.getElementById('myChart'));
    chart.draw(data, options);
    
    }
}

function updateEntry(id,index,fresh){
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

function extraData(index,id,node){
    createHistoryChart(node);
    // GET anime page
    MALClient.page(id,"anime").then((response) => {
        try {
            // parse HTML
            const parser = new DOMParser().parseFromString(response, 'text/html');
            const parentElement = document.querySelector(`#entry_container[data-index='${index}']`)


            // Characters scraper ==================================================================================================================
            const characters = parser.querySelector('.detail-characters-list')
            const character = characters.querySelectorAll('div > table > tbody > tr')
            console.groupCollapsed(`[Scrape Chara] ${index} | ${id}`)

            const charaSection = document.createElement("div");
            charaSection.className = "entry_details_section";
            // charaSection.setAttribute("section-type", "characters");
            charaSection.innerHTML = `
                <h2>Characters</h2>
                <div section-type="characters"></div>
            `;
            parentElement.querySelector("#entry_details_container").appendChild(charaSection);

            const charaContainer = parentElement.querySelector("div[section-type='characters']")

            character.forEach((items) => {
                try {
                    const name = items.children[0].querySelector('img').alt
                    const img = items.children[0].querySelector('img').attributes[3].value
                    // Use a regular expression to remove "/r/42x62"
                    const cleanimg = img.replace(/\/r\/42x62/, '');
                    const role = items.children[1].querySelector('small').innerText
                    const vaname = items.children[2].querySelector('.va-t > a').innerText
                    const vaurl = items.children[2].querySelector('.va-t > a').attributes.href.value

                    const charaItem = document.createElement("a");
                    charaItem.href= vaurl
                    charaItem.target=`_blank`
                    charaItem.style="aspect-ratio:3/4;width:calc(20% - 10px);margin:5px;float:left"
                    charaItem.innerHTML = `
                        <div style="background-image:url('${cleanimg}');background-size:cover; width:100%; height:100%;position:relative;">
                            <div>${name}</div>
                        </div>
                    `
                    charaContainer.appendChild(charaItem);

                    console.log(items,name,role,cleanimg)
                    console.log(vaname,vaurl);
                } catch (error) {
                    const name = items.children[0].querySelector('img').alt
                    const img = items.children[0].querySelector('img').attributes[3].value
                    // Use a regular expression to remove "/r/42x62"
                    const cleanimg = img.replace(/\/r\/42x62/, '');
                    const role = items.children[1].querySelector('small').innerText

                    const charaItem = document.createElement("a");
                    charaItem.href= `https://myanimelist.net/anime/${id}`
                    charaItem.target=`_blank`
                    charaItem.style="aspect-ratio:3/4;width:calc(20% - 10px);margin:5px;float:left"
                    charaItem.innerHTML = `
                        <div style="background-image:url('${cleanimg}');background-size:cover; width:100%; height:100%;position:relative;">
                            <div>${name}</div>
                        </div>
                    `
                    charaContainer.appendChild(charaItem);

                    console.error("Failed to get character data",error);
                }
                
            })
            console.groupEnd()

            // Related scraper =====================================================================================================================
            const related = parser.querySelector('.anime_detail_related_anime')
            const adaptation = related.querySelector("#content > table > tbody > tr > td:nth-child(2) > div.rightside.js-scrollfix-bottom-rel > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td:nth-child(2)")
            const adaptationLinks = adaptation.querySelectorAll('a')
            console.groupCollapsed(`[Scrape Related] ${index} | ${id}`)


            const relatedSection = document.createElement("div");
            relatedSection.className = "entry_details_section";
            relatedSection.setAttribute("section-type", "related");
            relatedSection.innerHTML = `
                <h2>Related Entry</h2>
            `;
            parentElement.querySelector("#entry_details_container").appendChild(relatedSection);

            const relatedContainer = parentElement.querySelector(".entry_details_section[section-type='related']")

            adaptationLinks.forEach((items) => {
                const href = items.attributes.href.value
                const regex = href.match(/\/(\d+)\//); // Using regular expression to find the id
                const id = regex ? regex[1] : null; // The id is captured in the first capturing group
                if (id){
                    mangaDetail(id)
                }
                console.log(id, `https://myanimelist.net${href}`);
            });
            console.groupEnd()

            function mangaDetail(id){
                MALClient.detail(id,"manga").then((response) => {
                    console.groupCollapsed(`[Manga Detail] ${id}`)
                    // console.log(resp)
                    let obj = {
                        "node": {
                            "id": response.id,
                            "title": response.title,
                            "main_picture": response.main_picture
                        },
                        "relation_type": "adaptation",
                        "relation_type_formatted": "Adaptation"
                    }
                    console.log(obj);
                    const relatedItem = document.createElement("a");
                    relatedItem.href=`https://myanimelist.net/manga/${obj.node.id}`
                    relatedItem.target=`_blank`
                    relatedItem.style="aspect-ratio:3/4;width:20%;margin:5px;float:left;"
                    relatedItem.innerHTML = `
                        <div style="background-image:url('${obj.node.main_picture.large}');background-size:cover; width:100%; height:100%;"></div>
                    `
                    relatedContainer.appendChild(relatedItem);
                    
                    // let list = loadingUserData()
                    // if (list){
                    //     list[0].list[index].related_manga.push(obj)
                    //     savingUserData(list, "Added related manga to entry")
                    // }
                    // console.log(list[0].list[index].related_manga);
                    console.groupEnd()
                })    
            }
        } catch (error) {
            console.error(`Entry window is not opened for ${index} | ${id}`,error);
        }
        // console.log("Save: ",JSON.parse(loadingUserData())[0].list[index].related_manga)
        // console.log(parser);
    })
}

function scheduleSort(){
    // get malid's and use that for getting anisched slug to compare timetable
    // malid > anisched slug > timetable
    // AnimeScheduleClient.searchByMALID()
    AnimeScheduleClient.checkSchedule()
    // AnimeScheduleClient.testSlug("sousou-no-frieren")

    let sortedArray = loadingUserData()[0].list;
    sortedArray = sortedArray.filter(item => item.status === "currently_airing");

    let days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    let timeOffset = 0

    sortedArray.sort((a, b) => {
        try {
            let day1 = days.indexOf(a.broadcast.day_of_the_week.toLowerCase());
            let day2 = days.indexOf(b.broadcast.day_of_the_week.toLowerCase());

            if (day1 == day2) {
                // Extract the start times
                let time1 = a.broadcast.start_time.split(':');
                let time2 = b.broadcast.start_time.split(':');

                // Convert start times to numbers
                let hour1 = parseInt(time1[0]);
                let hour2 = parseInt(time2[0]);
                let minute1 = parseInt(time1[1]);
                let minute2 = parseInt(time2[1]);

                // adjust the hour by timeOffset
                hour1 += timeOffset
                hour2 += timeOffset

                if(hour1<0||hour1>23){
                    hour1 = (hour1 + 24) % 24;
                }else if(hour2<0||hour2>23){
                    hour2 = (hour2 + 24) % 24;
                }

                // if (hour1 < 0) {
                //     hour1 = 23;
                // } else if(hour1>0){
                //     hour1 += timeOffset;
                //     hour1 = (hour1 + 24) % 24;
                // }
                // if (hour2 < 0) {
                //     hour2 = 23;
                // } else {
                //     hour2 += timeOffset;
                //     hour2 = (hour2 + 24) % 24;
                // }


                // Update the start_time properties of the objects
                a.broadcast.start_time = `${hour1.toString().padStart(2, '0')}:${minute1.toString().padStart(2, '0')}`;
                b.broadcast.start_time = `${hour2.toString().padStart(2, '0')}:${minute2.toString().padStart(2, '0')}`;

                // Compare the adjusted times
                if (hour1 === hour2) {
                    return minute1 - minute2;
                } else {
                    return hour1 - hour2;
                }
            } else {
                return day1 - day2;
            }
        } catch (error) {
            console.error(error);
        }
    });

    // Get the current day of the week and time
    let currentDate = new Date();
    let currentDay = currentDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase(); // Use 'long' to get the full day name

    let currentTime = currentDate.toLocaleTimeString('en-GB', { timeStyle: 'short' });

    let pastItems = [];
    let upcomingItems = [];

    // Loop through the sorted array to find past and upcoming items
    for (let item of sortedArray) {
        item.broadcast.day_of_the_week = item.broadcast.day_of_the_week.charAt(0).toUpperCase() + item.broadcast.day_of_the_week.slice(1);
        if(item.status=="currently_airing"){
            if (item.broadcast.day_of_the_week.toLowerCase() == currentDay) {
                // console.log(item.broadcast.day_of_the_week.toLowerCase(),currentDay);
                // Check if the show hasn't started yet
                if (item.broadcast.start_time >= currentTime) {
                    upcomingItems.push(item);
                }else{
                    pastItems.push(item);
                }
            } else if (days.indexOf(item.broadcast.day_of_the_week.toLowerCase()) > days.indexOf(currentDay)) {
                upcomingItems.push(item);
            } else {
                pastItems.push(item);
            }
        }
    }

    console.log(`${sortedArray.length}`,`${pastItems.length}`,`${upcomingItems.length}`);
    // Display the schedule items
    console.groupCollapsed("[Airing] Schedule")
    // console.log("📅 Today: ",currentDay, currentTime, `(${timeOffset})`);
    for (i = 0; i < sortedArray.length; i++) {
        try {
            if(sortedArray[i].status=="currently_airing"){
                if(currentDay==sortedArray[i].broadcast.day_of_the_week){
                    if(i==pastItems.length){
                        console.warn("📅 Today:\n",currentDay, currentTime, `(${timeOffset})`);    
                    }
                    console.log(`🔴 ${sortedArray[i].broadcast.day_of_the_week} ${sortedArray[i].broadcast.start_time} | ${sortedArray[i].title}`);
                }else{
                    console.log(`${sortedArray[i].broadcast.day_of_the_week} ${sortedArray[i].broadcast.start_time} | ${sortedArray[i].title}`);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    console.groupEnd()

    console.groupCollapsed("[Airing] Past")
    console.log("📅 Today: ",currentDay, currentTime, `(${timeOffset})`);
    for (let i = 0; i < pastItems.length; i++) {
        try {
            console.log(`${pastItems[i].broadcast.day_of_the_week} ${pastItems[i].broadcast.start_time} | ${pastItems[i].title}`);
        } catch (error) {
            console.error(error);
        }
    }
    console.groupEnd()

    console.groupCollapsed("[Airing] Upcoming")
    console.log("📅 Today: ",currentDay, currentTime, `(${timeOffset})`);
    for (let i = 0; i < upcomingItems.length; i++) {
        try {
            console.log(`${upcomingItems[i].broadcast.day_of_the_week} ${upcomingItems[i].broadcast.start_time} | ${upcomingItems[i].title}`);
            if(i==upcomingItems.length-1){
                // draw(sortedArray)
            }
        } catch (error) {
            console.error(error);
        }
    }
    console.groupEnd()

    draw(sortedArray)
}

function draw(data) {
    console.log(data);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const defaultHeight = 26
    const textStart = 60
    const paddingBottom = 14
    const fontSize = 20
    // Set the canvas size to accommodate the text
    canvas.width = 600; // Adjust this based on your needs
    canvas.height = (26 * (data.length+1)) + paddingBottom;

    // Set the background color to white by drawing a white rectangle
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Get the current day of the week and time
    let days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    let currentDate = new Date();
    let currentDay = currentDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase(); // Use 'long' to get the full day name
    let currentTime = currentDate.toLocaleTimeString('en-GB', { timeStyle: 'short' });
    let currentTimeParts = currentTime.split(':');

    // Header
    context.fillStyle = '#37288f';
    context.fillRect(0, 0, canvas.width, 40);
    let text = `[Nobyar Schedule] [${getSeasonWithYear(currentDate)}] ${currentDay.charAt(0).toUpperCase()+currentDay.slice(1)}, ${currentTime}`;
    context.font = `${fontSize}px` + ' ' + context.font.split(' ')[context.font.split(' ').length - 1];
    context.fillStyle = 'white';
    context.fillText(text, 10, defaultHeight);

    function getSeasonWithYear(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // JavaScript months are zero-based (0-11)
    
        let season = "";
    
        if (month >= 1 && month <= 3) {
            season = "Winter";
        } else if (month >= 4 && month <= 6) {
            season = "Spring";
        } else if (month >= 7 && month <= 9) {
            season = "Summer";
        } else {
            season = "Fall";
        }
    
        return `${season} ${year}`;
    }

    for (let i = 0; i < data.length; i++) {
        let startTimeParts = data[i].broadcast.start_time.split(':');
        let currentHour = parseInt(currentTimeParts[0]);
        let currentMinute = parseInt(currentTimeParts[1]);
    
        let startHour = parseInt(startTimeParts[0]);
        let startMinute = parseInt(startTimeParts[1]);
    
        // Calculate the time difference in minutes
        let timeDifference = (startHour - currentHour) * 60 + (startMinute - currentMinute);
        console.warn(timeDifference,data[i].title);
    
        if (data[i].broadcast.day_of_the_week.toLowerCase() == currentDay) {
            // If Today
            if (timeDifference >= -23 && timeDifference <= 0) {
                // If within a range of 23 minutes, use green color
                context.fillStyle = 'green';
            } else if (timeDifference < -23) {
                // If earlier today, use red color
                context.fillStyle = 'red';
            } else {
                // If later today, use black color
                context.fillStyle = 'black';
            }
        } else if (days.indexOf(data[i].broadcast.day_of_the_week.toLowerCase()) > days.indexOf(currentDay)) {
            // If Tomorrow, use gray color
            context.fillStyle = 'gray';
        } else {
            // If Yesterday, use red color
            context.fillStyle = 'red';
        }
    
        let text = `${data[i].broadcast.day_of_the_week}, ${data[i].broadcast.start_time} > ${data[i].title}`;
        context.font = `${fontSize}px` + ' ' + context.font.split(' ')[context.font.split(' ').length - 1];
        context.fillText(text, 10, textStart + (i * defaultHeight));
    }
    
    canvas.toBlob((blob) => {
        // Now you have a blob containing the canvas content
        // You can proceed to copy it to the clipboard or save it
        navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
        .then(() => {
            // Blob successfully copied to clipboard
        })
        .catch((err) => {
            console.error('Error copying blob to clipboard:', err);
        });
    })

    const dataURI = canvas.toDataURL();
    toast("canvasAlert",dataURI)
    // Remove the canvas after it's been used
    // document.body.removeChild(canvas);
}
} catch (error) {
    toast('notify',`${error}`)
    sendError(error, `List total: ${loadingUserData()[0].list.length}\nWebhook total: ${loadingUserData()[0].config[0].webhook.length}\n`, `Error executing script.js in nobyar`);
}