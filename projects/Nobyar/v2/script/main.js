"use strict";
import {config} from "../script/config.js"
import { component,userData,update } from "./component/functions.js";
import "../script/component/search.js"
import "../script/component/eventlisteners.js"

console.clear()
// config.resetLS()

try {
    let data = userData.load()
    // console.log(data[0].list.length)
    if(!data){ 
        // If save data somehow doesn't exist, refresh
        location.reload()
    }
    if (data.list.length==0){ 
        // If list is empty, display a message
        // display random face just for fun :\
        component.create.listEmpty(data.list)
    } else if(data.list.length!=0){ 
        // Else if list is not empty, display user lists
        console.warn(data.list);
        data.list = data.list.filter((obj) => Object.keys(obj).length !== 0);
        // localStorage.setItem("nobyarV2", JSON.stringify(data))
        userData.save(data, "Page load, List not empty")
        update.home.createEntryCard(data.list)
    }

    const loading = document.createElement("div")
    loading.id = "loading"
    loading.style = "width:100%;height:100%;position:absolute;background:black;z-index:999;transition:150ms ease-out;"
    loading.innerText = "Loading..."
    document.querySelector("#container > #overlay").appendChild(loading)
    window.onload = (e) => {
        document.querySelector("#container > #overlay > #loading").style = "width:100%;height:100%;position:absolute;background:black;z-index:999;transition:150ms ease-out;opacity:0%"
        const timer = setTimeout(() => {
            document.querySelector("#container > #overlay > #loading").remove()
            clearTimeout(timer)
        }, 150);
        console.warn("page Loaded",e);
    }
} catch (error) {
    // sendError(error,JSON.parse(localStorage.getItem("nobyarV2")),"Error loading page, page_loadlist():327")
    console.error(error)
}