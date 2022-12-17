function site_listElement(){ // Create element from save data
if (data_saved==null){ // If no save data found
    const div_card = document.createElement('div'); 
        div_card.className = `card`;
        div_card.innerHTML = `
        <div id="anime_sidebar_card">
            <img src="https://pbs.twimg.com/media/E7xoddlVUAAcGVu?format=jpg&name=orig" alt="Picture of Hoshimachi Suisei">
        </div>
        <div id="anime_result_card">
            <div id="title">
            <h2>Hoshimachi Suisei</h2>
            </div>
            <div id="genre">
                
            </div>
            <div id="description_card">
            <p>Hmm...looks like your list is empty, let's start searching one and adding it to your list</p>
            </div>
        </div>
        <button style="background-color:#FF0000; color: white; width" title="Open Suisei YouTube Channel" onclick="window.open('https://www.youtube.com/channel/UC5CwaMl1eIgY8h02uZw7u8A', '_blank').focus();" type="button">
            <span class="material-symbols-outlined">open_in_new</span>
        </button>
        <button style="background-color:#1DA1F2; color: white; width" title="Image source" onclick="window.open('https://twitter.com/ramdayo1122/status/1422126441450205187', '_blank').focus();" type="button">
            <span class="material-symbols-outlined">image</span>
        </button>
        `;
        document.getElementById('content').appendChild(div_card);
    console.log(jadwal_list) //
} else if (data_saved!=null) { // If save data found
    jadwal_list = JSON.parse(data_saved) //Load jadwal from cache
    
    // Display Console
    console.log("Loaded Jadwal:")
    console.log(jadwal_list);
    console.log(jadwal_list.length);
    console.log(`
        ===========================================
        Last Added: ${jadwal_list[jadwal_list.length-1].title}
        Total Item in Jadwal: ${jadwal_list.length}
        ===========================================
        
    `);
    
    for (let i = jadwal_list.length-1; i > -1; i--) { // loop until all item in jadwal is displayed, sorted by newest to oldest
        const div_card = document.createElement('div'); 
        div_card.className = `card`;
        div_card.innerHTML = `
        <div id="anime_sidebar_card">
            <img src="${jadwal_list[i].main_picture.large}" alt="${jadwal_list[i].mean}] ${jadwal_list[i].title} Picture">
        </div>
        <div id="anime_result_card">
            <div id="title">
            <h2>[${jadwal_list[i].mean}] ${jadwal_list[i].title} (${jadwal_list[i].watched_episode}/${jadwal_list[i].num_episodes})</h2>
            </div>
            <div id="genre">
                ${jadwal_list[i].genres.map(x => x.name).join(", ")}
            </div>
            <div id="description_card">
            <p>${jadwal_list[i].synopsis}</p>
            </div>
        </div>
        <button style="background-color:red; color: white; width" title="Remove from List Jadwal" onclick="delete_item(${i})" type="button">
            <span class="material-symbols-outlined">delete_forever</span>
        </button>
        <button style="background-color:blue; color: white; width" title="Open in MAL" onclick="window.open('https://myanimelist.net/anime/${jadwal_list[i].id}', '_blank').focus();" type="button">
            <span class="material-symbols-outlined">open_in_new</span>
        </button>
        <button style="background-color:white; color: black; width" title="Add Episode" onclick="add_episode(${i})" type="button">
            <span class="material-symbols-outlined">add</span>
        </button>
        <button style="background-color:white; color: black; width" title="Remove Episode" onclick="remove_episode(${i})" type="button">
            <span class="material-symbols-outlined">remove</span>
        </button>
        <button style="background-color:white; color: black; width" title="Set Watching Now" onclick="webhook_post(${i})" type="button">
            <span class="material-symbols-outlined">visibility</span>
        </button>
        `;
        document.getElementById('content').appendChild(div_card);
    } // end of jadwal card display loop
    }
}

function listElement(data,i){
    if (data){
        let dataID = data.id
        let dataTitle = data.title
        let dataSynopsis = data.synopsis
        let dataGenre = data.genres.map(x => x.name).join(", "); // display all genre name separated by comma
        let dataScore = data.mean
        let dataPicture = data.main_picture.large
        const div_card = document.createElement('div');
        div_card.className = `card`;
        div_card.innerHTML = `
        <div id="anime_sidebar_card">
            <img src="${dataPicture}" alt="${dataTitle} Picture">
        </div>
        <div id="anime_result_card">
            <div id="title">
            <h2>[${dataScore}] ${dataTitle}</h2>
            </div>
            <div id="genre">
                ${dataGenre}
            </div>
            <div id="description_card">
            <p>${dataSynopsis}</p>
            </div>
        </div>
        <div>
            <button class="addToList" title="Add to List Jadwal" type="button">
            <span class="material-symbols-outlined">playlist_add</span>
            </button>
            <button title="Open in MAL" onclick="window.open('https://myanimelist.net/anime/${dataID}', '_blank').focus();" type="button">
            <span class="material-symbols-outlined">open_in_new</span>
            </button>
            <button title="Copy Anime ID to Clipboard" onclick="navigator.clipboard.writeText('${dataID}');" type="button">
            <span class="material-symbols-outlined">content_copy</span>
            </button>   
        </div>
        `;
        div_card.addEventListener(`click`, function(){
            addToList(i,data)
        })
        document.getElementById('content').appendChild(div_card);
    }
}
function listElementError(error){
    if (error) {
        let dataID = error.status
        let dataTitle = error.response[0].error
        let dataSynopsis = error.response[0].error
        let dataGenre = error.response[0].message
        let dataScore = error.status
        let dataPicture = null
        const div_card = document.createElement('div');
        div_card.className = `card`;
        div_card.innerHTML = `
        <div id="anime_sidebar_card">
        </div>
        <div id="anime_result_card">
            <div id="title">
            <h2>[${dataScore}] ${dataTitle}</h2>
            </div>
            <div id="genre">
                ${dataGenre}
            </div>
            <div id="description_card">
            <p>${dataSynopsis}</p>
            </div>
        </div>
        `;
        document.getElementById('content').appendChild(div_card);
    }
}
function addToList(index,data){
    console.log(`Hello! `,index)

    let push = data
    push[`watched_episode`] = 0
    console.log(push)

    jadwal_list.push(JSON.parse(JSON.stringify(push)));
    console.log(jadwal_list)

    localStorage.setItem(`saved_jadwal`, JSON.stringify(jadwal_list));
}


function display_input(){
    if (document.getElementById("input_type").value=="title"){
      document.getElementById("input_id").type="text"
      document.getElementById("input_id").placeholder="example: \"akira\""
    }
    if (document.getElementById("input_type").value=="id"){
      document.getElementById("input_id").type="number"
      document.getElementById("input_id").placeholder="example: \"42310\""
    }
  }

function delete_prev_result(){ // Clear previous result called by get_anime() function
    document.getElementById('content').innerHTML = ""
  }

function delete_item(index){ // function to delete an item from jadwal
    jadwal_list.splice(index, 1)
    if (jadwal_list.length!=0){
      localStorage.setItem("saved_jadwal", JSON.stringify(jadwal_list));
    } else {
      localStorage.removeItem("saved_jadwal");
    }
    
    location.reload();
  }

function settingsOpen(){
    let webhookURL = localStorage.getItem("webhook_url_saved")
    let webhookUsername = localStorage.getItem("webhook_name_saved")
    let webhookAvatar = localStorage.getItem("webhook_avatarurl_saved")
    let webhookTitle = localStorage.getItem("webhook_title_saved")
    let webhookTitleURL = localStorage.getItem("webhook_titleurl_saved")
    if (webhookURL==null){
        webhookURL = ``
    }
    if (webhookUsername==null){
        webhookUsername = ``
    } 
    if (webhookAvatar==null){
        webhookAvatar = ``
    } 
    if (webhookTitle==null){
        webhookTitle = ``
    } 
    if (webhookTitleURL==null){
        webhookTitleURL = ``
    }

    const settingsWindow = document.createElement('div'); 
    settingsWindow.className = `settingsBackground`;
    settingsWindow.innerHTML = `
    <div class="settingsContainer">
      <div class="settingsHeader">
        <div class="settingsHeaderSection">
          <!-- header title here -->
        </div>
        <div class="settingsHeaderSection">
          <div id="settingsCloseButton">
            <!-- close menu -->
            <span class="material-symbols-outlined">close</span>
          </div>
        </div>
      </div>

      <div class="settingsSidebar">
        <!-- menu category -->
        <div class="settingsButton">
          Delete save
        </div>
      </div>
      <div class="settingsContent">
        <div class="settingsCard">
          <input id="webhook_url" class="inputSave" class="settingsInput" placeholder="Webhook URL" type="text" value="${webhookURL}">
          <input id="webhook_name" class="inputSave" class="settingsInput" placeholder="Webhook Username" type="text" value="${webhookUsername}">
          <input id="webhook_avatarurl" class="inputSave" class="settingsInput" placeholder="Webhook Avatar URL" type="text" value="${webhookAvatar}">
          <input id="webhook_title" class="inputSave" class="settingsInput" placeholder="Webhook Title" type="text" value="${webhookTitle}">
          <input id="webhook_titleurl" class="inputSave" class="settingsInput" placeholder="Webhook Title URL" type="text" value="${webhookTitleURL}">
        </div>
      </div>
    </div>
    <p>hello</p>`;
    document.getElementById(`elem`).appendChild(settingsWindow)
}

function settingsClose(){
    let element = document.getElementsByClassName(`settingsBackground`)
    element[0].parentNode.removeChild(element[0]);
}