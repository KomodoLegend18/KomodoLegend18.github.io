const menu_active_container = document.getElementById("active-menu"); //active menu container

// Saved Settings
// var username = localStorage.getItem("dicey2_Username")
const username_input = document.getElementById("username")
// var avatar = localStorage.getItem("dicey2_Avatar")
const avatar_input = document.getElementById("avatar")
//
var localDatabase


// Menu Buttons
const playBtn = document.getElementById("play_button"); //menu profile button
var playBtnClose //menu profile close button

const profileBtn = document.getElementById("profile_button"); //menu profile button

var profileData = []
var profileData_saved = localStorage.getItem("dicey2_profileData")


var profileBtnClose //menu profile close button

const settingsBtn = document.getElementById("settings_button"); //menu profile button
var settingsBtnClose //menu profile close button
var settingsUsername
var settingsAvatar



if(profileData_saved==null){ // if no save data found
    // Load item
    profileData = JSON.parse(`[
        {
            "Username":"",
            "Avatar":"",
            "Inventory":{
                "Cards":[0],
                "ChatFX":[0],
                "Character":[0,1]
            },
            "ActiveItems":{
                "Cards":[0],
                "ChatFX":0,
                "Character":0
            }
        }
    ]`)
    console.log("New data created: "+profileData)
    localStorage.setItem("dicey2_profileData",JSON.stringify(profileData)) // Save into Cache
    console.log(localStorage.getItem("dicey2_profileData"))
}else if (profileData_saved!=null){ // if save data found
    // localStorage.removeItem("dicey2_profileData")
    profileData = JSON.parse(profileData_saved)
    console.log(profileData)
    console.log(profileData_saved)
}
function DeleteSave(){
    localStorage.removeItem("dicey2_profileData")
    location.reload()
}



// Updater
const UpdateCharacterDisplay = () => {
    // Load Items Database
    if (localDatabase==null){
        GETDatabase().then(responseData => {
            localDatabase = responseData.response[0]
            console.log(localDatabase)
    
            // Update Name
            let name = localDatabase.characterData[profileData[0].ActiveItems.Character].name
            // console.log(name)
            document.getElementById("header_name").innerText = name
            
            // Update Character Background
            let background = localDatabase.characterData[profileData[0].ActiveItems.Character].background
            document.getElementById("menu_main_content_chara_bg").style = `background-image: url(${background});`
            // Update Character Art
            let art = localDatabase.characterData[profileData[0].ActiveItems.Character].art
            document.getElementById("menu_main_content_chara_art").src = art
        }).catch(err => {
            console.log(err)
        })
    }else{
        // Update Name
        let name = localDatabase.characterData[profileData[0].ActiveItems.Character].name
        // console.log(name)
        document.getElementById("header_name").innerText = name
        
        // Update Character Background
        let background = localDatabase.characterData[profileData[0].ActiveItems.Character].background
        document.getElementById("menu_main_content_chara_bg").style = `background-image: url(${background});`
        // Update Character Art
        let art = localDatabase.characterData[profileData[0].ActiveItems.Character].art
        document.getElementById("menu_main_content_chara_art").src = art
    }
}
const UpdateItemDisplay = () => {
    let inventory_chara_length = profileData[0].Inventory.Character.length
    console.log(`Character owned: ${inventory_chara_length}`)

    for (let i=0; i<inventory_chara_length;i++){
        let id = profileData[0].Inventory.Character[i]
        console.log(id)
        let name = localDatabase.characterData[id].name
        let background = localDatabase.characterData[id].background
        let art = localDatabase.characterData[id].art
        const div = document.createElement("div");
        div.innerHTML = `<img id="menu_profile_items_art" src="${art}" alt="${name}">
        <div style="width:100%;height:100%;position:absolute;z-index:1;cursor:pointer;" onclick="Equip('Chara',${i})"></div>`
        div.id = "menu_profile_items"
        div.style = `background: url(${background})`
        document.getElementById("item_container").appendChild(div)
    }
}
const Equip = (ItemType,Index) => {
    if (ItemType=="Chara"){
        // Define character to save
        let Chara = profileData[0].Inventory.Character[Index]
        // Save defined character to...
        profileData[0].ActiveItems.Character = Chara

        // Autosave
        localStorage.setItem("dicey2_profileData", JSON.stringify(profileData));
        console.log(localDatabase.characterData[Chara].name+" Equipped")

        // Update Character Display
        UpdateCharacterDisplay()
    } else if(ItemType=="Card"){
        let totalCard = profileData[0].ActiveItems.Cards.length
        if (totalCard>5){
            console.log("You already selected 5 cards, Please deselect another card to select this card")
        } else{
            console.log("Card selected")
        }
    } else if(ItemType=="ChatFX"){
        console.log("Chat Effects selected")
    }
}



// ====Play Menu===============================
const playMenu_open = () => {
    console.log("opened profile")
    const playMenu = document.createElement('div'); 
    playMenu.className = `menu_play-open`;
    playMenu.innerHTML = `<div class="menu_play-open">
    <div class="menu_play_items_container">
        <div id="menu_play_close-button">Return to Main Menu</div>
        <div class="menu_play_tabs">
            <div class="menu_play_tabs_button" id="">Solo</div>
            <div class="menu_play_tabs_button" id="">Multi | Host</div>
            <div class="menu_play_tabs_button" id="">Multi | Join</div>
        </div>
    </div>
</div>`;
    menu_active_container.appendChild
    (playMenu);

    // menu_active_container.children[0].classList.remove(`menu_profile-close`);
    playBtnClose = document.getElementById("menu_play_close-button");
    playBtnClose.addEventListener('click', playMenu_close);
    
}
const playMenu_close = () =>{
    console.log("Profile Closed")
    menu_active_container.children[0].classList.add(`menu_play-close`);
    menu_active_container.children[0].classList.remove(`menu_play-open`);
    
    setTimeout(function () {
        menu_active_container.innerHTML = ""
    }, 130);
}
// ====Profile===============================
const profileMenu_open = () => {
    console.log("opened profile")
    const profileMenu = document.createElement('div'); 
    profileMenu.className = `menu_profile-open`;
    profileMenu.innerHTML = `
    <div class="menu_profile_items_container" id="item_container">
    </div>
    <div id="menu_profile_close-button">Return to Main Menu</div>
    <div class="menu_profile_tabs">
        <div class="menu_profile_tabs_button" id="">Card Deck</div>
        <div class="menu_profile_tabs_button" id="">Chat Effect</div>
        <div class="menu_profile_tabs_button" id="">Character</div>
        <div class="menu_profile_tabs_button" id="">Character Background</div>
    </div>`;
    menu_active_container.appendChild
    (profileMenu);

    // menu_active_container.children[0].classList.remove(`menu_profile-close`);
    profileBtnClose = document.getElementById("menu_profile_close-button");
    profileBtnClose.addEventListener('click', profileMenu_close);
    

    UpdateItemDisplay()
}

const profileMenu_close = () =>{
    console.log("Profile Closed")
    menu_active_container.children[0].classList.add(`menu_profile-close`);
    menu_active_container.children[0].classList.remove(`menu_profile-open`);
    
    setTimeout(function () {
        menu_active_container.innerHTML = ""
    }, 300);
}
// ====Settings===============================
const settingsMenu_open = () => {
    console.log("opened settings")
    const settingsMenu = document.createElement('div'); 
    settingsMenu.className = `menu_settings-open`;
    settingsMenu.innerHTML = `<div class="menu_settings_items_container">
    <div id="menu_settings_item">
        <span>USERNAME: </span>
        <input id="username" type="text" placeholder="Username" value="${profileData[0].Username}" onchange="saveUsername(this)">
        <br>
        <br>
        <span>AVATAR: </span>
        <input id="avatar" type="text" placeholder="Image URL" value="${profileData[0].Avatar}" onchange="saveAvatar(this)">
    </div>
</div>
<div id="menu_settings_close-button">Return to Main Menu</div>
<div class="menu_settings_tabs">
    <div onclick="DeleteSave()" class="menu_settings_tabs_button" id="">Delete Save</div>
</div>`;
    menu_active_container.appendChild
    (settingsMenu);

    // menu_active_container.children[0].classList.remove(`menu_profile-close`);
    settingsBtnClose = document.getElementById("menu_settings_close-button");
    settingsBtnClose.addEventListener('click', settingsMenu_close);

    
}
const settingsMenu_close = () =>{
    console.log("settings Closed")
    menu_active_container.children[0].classList.add(`menu_settings-close`);
    menu_active_container.children[0].classList.remove(`menu_settings-open`);
    
    setTimeout(function () {
        menu_active_container.innerHTML = ""
    }, 300);
}



playBtn.addEventListener('click', playMenu_open);
profileBtn.addEventListener('click', profileMenu_open);
settingsBtn.addEventListener('click', settingsMenu_open);
//

const saveUsername = (e) =>{
    profileData[0].Username = e.value
    localStorage.setItem("dicey2_profileData", JSON.stringify(profileData));
    console.log(profileData[0].Username)
    // console.log(profileData_saved)
}
const saveAvatar = (e) =>{
    profileData[0].Avatar = e.value
    localStorage.setItem("dicey2_profileData", JSON.stringify(profileData));
    console.log(profileData[0].Avatar)
    // console.log(profileData_saved)
}



UpdateCharacterDisplay()