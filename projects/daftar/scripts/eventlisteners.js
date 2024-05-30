"use strict";
import { config } from "./config.js";
import { userData, update, component } from "./functions.js";

export const Eclick = {
    resultClick: (event,dataResults) => {
        if (!event.target.attributes["data-index"]) return; 
        // Check if a valid data-index attribute exists

        const selectedIndex = parseInt(event.target.attributes["data-index"].value);
        const selectedData = dataResults.data[selectedIndex]?.node; // Use optional chaining to safely access data
        console.log("Selected data: ",selectedData);

        if (!selectedData) return; // Exit if data is missing

        const savedata = userData.load()
        const list = savedata?.list || [];

        // Check for duplicates
        const isDuplicate = list.some(item => item.id === selectedData.id);

        if(isDuplicate){
            // Handle duplicate item (if needed)
            component.create.notify("notify", `Duplicate found, entry is already in your list`);
            return console.warn("duplicate",isDuplicate)
        }

        list.push(selectedData);
        // console.warn(list,savedata);
        savedata.list = list; // Update the list in savedata
        userData.save(savedata, "Add from search, Non duplicate")

        update.home.createEntryCard(selectedData.list)

        // localStorage.setItem("nobyarV2", JSON.stringify(savedata));
        // createcard(data, list.length - 1);
        
        console.log(list.length - 1);
        component.create.notify("notify", `Adding <b>"${selectedData.title}"</b> to the list`);

        // Remove the "empty" list message if it exists
        const emptyMessage = document.querySelector("#empty");
        if (emptyMessage) {
            emptyMessage.style.display = "none";
        }

        // console.log(e.target);
    },
    cardClick: (e) => {
        let selectIndex = e.target.children[1].attributes["data-index"].value
        let selectNode = userData.load().list[selectIndex]
        component.library.detailWindow(selectNode,selectIndex,null)
        console.log("Selected: ",selectNode,e);
    },
    detailClose: (e) => {
        const buttonTrigger = e.target
        const toClose = e.target.parentElement.parentElement;
        buttonTrigger.removeEventListener("click",Eclick.detailClose);
        console.log(e.target.parentElement.parentElement);
        toClose.style = "opacity:0%;transition:150ms ease-out;transtion-property:all;"
        const timer = setTimeout(() => {
            toClose.remove() 
            clearTimeout(timer)
        }, 150);
    }
}

document.querySelector("body > header > .material-symbols-outlined[data-btn-type='menu']").addEventListener("click", function(e){
    if (document.querySelector("body > aside").getAttribute("data-visible")==="true"){
        document.querySelector("body > aside").setAttribute("data-visible","false")
    }else{
        document.querySelector("body > aside").setAttribute("data-visible","true")
    }
});