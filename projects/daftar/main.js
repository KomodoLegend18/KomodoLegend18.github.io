"use strict";
import { MALClient } from "../modules/MAL.js";
import { clientRequest } from "../modules/xhr.js";
import { AnimeScheduleClient } from "../modules/aniSched.js";
import { userData } from "./scripts/functions.js";

document.querySelector(`[data-func="refresh"]`).addEventListener("click",(event)=>{
    location.reload();
})
document.querySelector(`[data-func="reset"]`).addEventListener("click",(event)=>{
    userData.reset("DaFTAR");
})
document.querySelector(`[data-func="schedule"]`).addEventListener("click",(event)=>{
    document.querySelector("main").innerHTML = ""
    document.querySelector(`[data-func="schedule"]`).style = `display:none`

    AnimeScheduleClient.checkSchedule("all").then(resp => {
        console.warn("Schedule", resp);
    
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('u');
    
        MALClient.user({ username }).then(response => {
            console.warn(response);
    
            const save_data = userData.load("DaFTAR");
            console.warn(save_data);
    
            const responseIds = new Set(response.data.map(item => item.node.id));
            const storedRoutes = new Set(save_data.map(item => item.route));
    
            const filteredSchedule = resp.filter(item => {
                const correspondingSaveData = save_data.find(dataItem => dataItem.route === item.route);
                return correspondingSaveData && responseIds.has(correspondingSaveData.id);
            });
            filteredSchedule.forEach(item=>{
                const day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
                const date = new Date(item.episodeDate)
                const dateOpt = {
                    year: 'numeric',
                    month: 'long', // Use 'short' for abbreviated month names
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: true // Change to false for 24-hour time
                }
                const dateFormat = new Intl.DateTimeFormat("en-US",dateOpt)

                const schedCard = document.createElement("div")
                schedCard.innerText = `
                ${day[date.getDay()]}
                ${dateFormat.format(date)}
                `
                schedCard.style = `grid-column:span var(--card-column-count); display:grid; grid-template-columns: repeat(3, 1fr);padding:10px;border-radius:10px;box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.267);`
                if (new Date().getTime()>date.getTime()) {
                    schedCard.style.background = `var(--menu-color)`
                }

                const poster = document.createElement("div")
                poster.style.background = `url(https://img.animeschedule.net/production/assets/public/img/${item.imageVersionRoute}) no-repeat`
                poster.style.backgroundSize = `cover`
                poster.style.width = `100%`
                poster.style.aspectRatio = `3/4`

                const detail = document.createElement("div")
                detail.style.float = `left`
                detail.style.padding = `10px`
                detail.innerText = `
                ${item.title}
                \n
                Ep.${item.episodeNumber}/Ep.${item.episodes}
                `

                schedCard.appendChild(poster)
                schedCard.appendChild(detail)

                document.querySelector("main").appendChild(schedCard)

                document.querySelector(`[data-func="refresh"]`).style = ``
            })
            console.log("Filtered Schedule:", filteredSchedule);
    
        }).catch(err => {
            console.error(err);
        });
    }).catch(err => {
        console.error("Error fetching schedule:", err);
    });
})

function process(param) {
    const {data} = param
    // console.log("param\n",data);
    // const storedID = userData.load("DaFTAR").map(item => item.id);

    // check for ids not stored yet
    // const ids = data.map(item => item.node.id).filter(id => !storedID.includes(id));
    const MALids = data.map(item => item.node.id);

    const IDfound = []
    AnimeScheduleClient.searchByMALID({id:MALids}).then(resp=>{
        // console.log(resp);
        resp.forEach(anisched => {
            if (anisched.websites && anisched.websites.mal) {
                // Loop through each ID
                MALids.forEach(id => {
                    // Check if MAL website URL contains the current ID
                    if (anisched.websites.mal.includes(id)) {
                        console.warn(`Anime ID ${id} has a MAL website: ${anisched.websites.mal}`);
                        IDfound.push(id)
                        const saved = userData.load("DaFTAR")
                        const existingEntryIndex = saved.findIndex(item => item.id === id);
                        if (existingEntryIndex !== -1) {
                            // Update the existing entry
                            saved[existingEntryIndex] = {
                                id: id,
                                route: anisched.route,
                                websites: {
                                    ...anisched.websites,
                                    kurama:`kuramanime.boo/anime?order_by=updated&search=${anisched.title.replace(/ /g, '+')}`
                                    
                                }
                            };
                            console.warn(`${id} already stored`);
                        } else {
                            // Add a new entry
                            saved.push({
                                id: id,
                                route: anisched.route,
                                websites: anisched.websites
                            });
                            console.warn(`${id} data created`);
                        }
                        userData.save("DaFTAR",saved,`${id}/${anisched.title}`)
                        card.update(id,{
                            websites:userData.load("DaFTAR")[userData.load("DaFTAR").findIndex(item=>item.id===id)].websites
                        })
                    }
                });
            }
        });
        AnimeScheduleClient.checkSchedule("all").then(resp=>{
            const save_data = userData.load("DaFTAR")
            const stored_route = save_data.map(item => item.route)
            // console.log("Stored:",stored_route);
            // filter only schedule with the same route as in saved data
            const sched = resp.filter(item => stored_route.includes(item.route))
            console.log("Sched:",sched);

            // Check each filtered schedule
            sched.forEach(AniSched=>{
                try {
                    // check for stored save data
                    const storedIndex = stored_route.findIndex(item => item === AniSched.route);
                    
                    // if save data found
                    if (storedIndex!==-1) {
                        // check each mal data
                        data.forEach(({node})=>{
                            // if mal data id match with id in save data
                            if (node.id===save_data[storedIndex].id) {
                                // console.log("MAL Data:",MAL.node);
                                console.warn("Entry found!\n",`Save data: no.${storedIndex}\n`,userData.load("DaFTAR")[storedIndex],"Anischedule:\n",AniSched,"MAL:\n",node);

                                proceedUpdate(node,AniSched)
                            }
                        })
                    }
                    function proceedUpdate(inputMAL,inputAS) {
                        console.log(`Updating card for ${inputMAL.id}`);
                        if (inputAS.airingStatus=="unaired"||inputAS.airingStatus=="delayed-air") {
                            card.update(inputMAL.id,{
                                episode_aired:inputAS.episodeNumber-1,
                                episode_total:inputMAL.num_episodes
                            })
                        } else {
                            card.update(inputMAL.id,{
                                episode_aired:inputAS.episodeNumber,
                                episode_total:inputMAL.num_episodes
                            })
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            })
        });
        // Output IDs that were not found in any MAL website
        const IDnotFound = MALids.filter(id => !IDfound.includes(id));
        if (IDnotFound.length > 0) {
            IDnotFound.forEach(id => {
                const card = document.querySelector(`[data-id="${id}"]`)
                if (card.querySelector(".card-stream").children.length===0) {
                    card.querySelector(".card-stream").setAttribute("data-hide","true")
                }
                // if (elem.querySelector(".card-stream").childElementCount<1) {
                //     console.log(elem.querySelector(".card-stream"));
                //     elem.querySelector(".card-stream").setAttribute("data-hide","true")
                // }
                console.error(`Unable to find Anime ID ${id} in AniSched Database`);
            });
        }
        // console.warn(userData.load("DaFTAR"));
    }).catch(err=>{
        console.error(err);
        // if (JSON.parse(err).data.status==404) {
        //     console.error("unable to find certain entry.\n","requested ids:\n"+MALids);
        // }else{
        // }
    })
}
const card = {
    update: function (id,data,resp) {
        const {
            episode_aired,
            episode_total,
            websites
        } = data
        const elem = document.querySelector(`[data-id="${id}"]`)
        console.log(data);
        Object.keys(data).forEach(key => {
            const tag = elem.querySelector(`[data-info="${key}"]`)
            if(key=="episode_aired"){
                elem.querySelector(".episode-aired").style.width = `${(data["episode_aired"]/data["episode_total"]) * 100}%`
                elem.querySelector(".episode-watched").style.width = `0%`
                tag.innerHTML = `${data[key]} /`
            } else if(key=="websites"){
                const link_container = elem.querySelector(".card-stream")
                Object.keys(data["websites"]).forEach(key=>{
                    // console.error(data["websites"][key]);
                    const url = new URL(`https://${data["websites"][key]}`)
                    const sitename = key
                    // console.error("Name:",key);
                    // console.error("Host:",url.hostname);
                    const elem = document.createElement("span")
                    elem.classList.add("stream-button")
                    elem.innerHTML = `
                    <a href="${url}" target="_blank" title="${sitename}">
                        <img src="https://www.google.com/s2/favicons?domain=${url.hostname}/&sz=24">
                    </a>`
                    link_container.appendChild(elem)
                })
                // for (let i = 0; i < data[websites].length; i++) {
                    // const elem = document.createElement("span")
                    // elem.innerHTML = `
                    // <span class="stream-button">
                    //     <a href="${data[key]}">
                    //         <img src="https://www.google.com/s2/favicons?domain=https://myanimelist.net/&sz=24">
                    //     </a>
                    // </span>`
                // }
            } else {
                // insert data to innerHTMl
                tag.innerHTML = data[key]
            }
            // console.log(elem.querySelector(".card-stream").childElementCount);
        });

    },
    load: function(input){
        for (let i = 0; i < input.data.length; i++) {
            card.create(input.data[i]);
        }
    },
    create: function(data) {
        const entry = data.node
        // console.warn(entry);
        const elem = document.createElement("div")
        elem.classList = "card"
        elem.style = `background-image:url(${entry.main_picture.large})`
        elem.innerHTML = `
        <div class="card-score">
            <span class="material-symbols-outlined">star</span>
            <span>${entry.mean}</span>
        </div>
        <div class="card-episode">
            <div class="episode-bar">
                <div class="episode-watched"></div>
                <div class="episode-aired"></div>
            </div>
            <span data-info="episode_aired"></span>
            <span data-info="episode_total">${entry.num_episodes} Ep</span>
        </div>
        <div class="card-stream">
            
        </div>
        <div class="card-title">
            <p>${entry.title}</p>
        </div>`
        elem.setAttribute("data-id", entry.id)
        const openDetail = document.createElement("div")
        openDetail.style = `width:100%;height:100%`
        elem.appendChild(openDetail)
        openDetail.addEventListener("click",function(){
            window.open(`${window.location.origin}/projects/daftar/details/?id=${entry.id}`)
        })
        document.querySelector("main").appendChild(elem)
        console.log(`[Card > Create] ${entry.title}`);
    }
}
const urlParams = new URLSearchParams(window.location.search);
const checkParam = urlParams.has("u")
if (checkParam) {
    document.querySelector(".header-title").innerHTML = `${urlParams.get('u')} > Currently Watching`
    userSearch()
    MALClient.user({
        username:`${urlParams.get('u')}`
    }).then(response=>{
        console.warn(response);
        process({data:response.data})
        card.load(response)
        // userData.save("DaFTAR",response,"[MAL LIST] Saved")
    }).catch(err=>{
        console.error(err);
    })
}else{
    document.querySelector(".header-title").innerHTML = `Welcome`
    userSearch()
    // MALClient.user({
    //     username:`KomodoLegend18`
    // }).then(response=>{
    //     console.warn(response);
    //     process({data:response.data})
    //     card.load(response)
    //     // userData.save("DaFTAR",response,"[MAL LIST] Saved")
    // }).catch(err=>{
    //     console.error(err);
    // })
}

function userSearch() {
    // Create a new form element
    const formElement = document.createElement('form');
    formElement.id = "userInput"
    // Create a new input element (text type)
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.placeholder = 'MAL Username';
    inputElement.name = 'textInput'; // Set name attribute for form submission

    // Create a new submit button element
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerHTML = `<span class="material-symbols-outlined">
    search
    </span>`;

    // Append input and submit button elements to the form
    formElement.appendChild(inputElement);
    formElement.appendChild(submitButton);

    // Add event listener to form submission
    formElement.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        inputElement.placeholder = `Submitting...`


        // Get form data using FormData API
        const formData = new FormData(formElement);
        const inputValue = formData.get('textInput'); // Get input value by name

        console.log('Submitted username:', inputValue);
        MALClient.user({
            username:inputValue
        }).then(response=>{
            window.location.href = `${window.location.origin}/projects/daftar/?u=${inputValue}`
            console.warn(response);
            // process({data:response.data})
            // card.load(response)
            // userData.save("DaFTAR",response,"[MAL LIST] Saved")
        }).catch(err=>{
            inputElement.placeholder = err
            console.error(err);
        })

        // Example action with input value (log to console)

        // Optionally, clear the input field after submission
        inputElement.value = '';
    });

    // Append the form element to the body or any desired parent element
    document.body.querySelector("main").appendChild(formElement);
}

window.addEventListener("load", (event) => {
    console.log("Page Loaded",event);
    
    // console.warn(userData.load("DaFTAR"));
    // userData.reset("DaFTAR")
    
    // clientRequest({
    //     cors:true,
    //     url:"https://kuramanime.cam/anime?search=Ookami+to+Koushinryou%3A+Merchant+Meets+the+Wise+Wolf&order_by=oldest"
    // }).then(response=>{
    //     const parser = new DOMParser();
    //     const parsedHTML = parser.parseFromString(response, "text/html")
    //     console.log(parsedHTML.querySelector("#animeList"))
    // }).catch(err=>{
    //     console.error(err);
    // })

    // AnimeScheduleClient.testSlug("")
    // AnimeScheduleClient.checkSchedule().then(resp=>{
    //     console.warn(resp);
    // }).catch(err=>{
    //     console.error(err);
    // })

    // AnimeScheduleClient.searchByAllMALID({ids:[51122,53516,55315]}).then(resp=>{
    //     console.warn(resp);
    // }).catch(err=>{
    //     console.error(err);
    // })
});