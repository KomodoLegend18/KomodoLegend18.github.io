"use strict";
import { debug, component, userData, update } from "./functions.js";
import { MALClient } from "../request.js";
import { config } from "../config.js";
import { Eclick } from "./eventlisteners.js";

try {
    const searchInput = document.querySelector("#header-section > input[type=text]")
    console.log(searchInput);
    // ========================================================
    searchInput.addEventListener("focus", function(e){
        // console.log("Dim count: ",document.querySelector("#fadeDim").childElementCount)
        // console.log(e)
        component.search.bgDim()
        if(e.target.value.length>=3){
            document.getElementById("search-result-overlay").style="pointer-events: auto;display:block"
        }
        // console.warn("dim applied")
        // console.log(query)
    })
// ========================================================
let search_timer
searchInput.addEventListener("input", function(e) {
    let query = e.target.value
    if (query.length>=3){ // If query is longer than/equal to 3 characters
        console.log("Search query: ",query.length,`"${query}"`)

        clearTimeout(search_timer);
        search_timer = setTimeout(() => {
            console.log("> Searching: ",query.length,`"${query}"`)
            MALClient.search(query).then(response => {
                console.warn("Search result:",response);
                const result = document.getElementById("search-result-overlay");
                component.search.resetSearchResults(result)
                result.style.pointerEvents = "auto";
                component.search.searchResults(response);
            }).catch(err => {
                if (err.status < 500) {
                    console.error(err);
                    sendError(err, query, "");
                } else {
                    console.error(err);
                }
            });
        }, 1000);
    } else if (query.length<3){ // If search query is empty, clear search results
        clearTimeout(search_timer);
        const prevresult = document.getElementById("search-result-overlay")
        component.search.resetSearchResults(prevresult)
        prevresult.style="pointer-events:none"
    }
})
} catch (error) {
    console.error(`[Search] ${error}`);
}