// var key = prompt("Input KEY:");
var data_get
var jadwal_list = []
var data_saved = localStorage.getItem("saved_jadwal")
console.log("Saved Jadwal (Cache): ")
console.log(JSON.parse(data_saved))
// console.log(data_saved.length)
// localStorage.removeItem("saved_jadwal");


var key = "a5f40eba77d1d8f6e092d31aa2780f74" //REMIND ME TO MAKE THIS A USER INPUT INSTEAD

webhook_config_load()

// var anime_id = prompt("Input Anime ID:")

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
        <h2>[${jadwal_list[i].mean}] ${jadwal_list[i].title} (${jadwal_list[i].watched_episodes}/${jadwal_list[i].num_episodes})</h2>
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

// setInterval(test_cors, 5000);


function delete_item(index){ // function to delete an item from jadwal
  jadwal_list.splice(index, 1)
  if (jadwal_list.length!=0){
    localStorage.setItem("saved_jadwal", JSON.stringify(jadwal_list));
  } else {
    localStorage.removeItem("saved_jadwal");
  }
  
  location.reload();
}

function get_anime(){ // function to get search data
  anime_search  = document.getElementById(`input_id`).value;

  if (document.getElementById("input_type").value=="title"){
    var req = new XMLHttpRequest(); // Create a new request
    req.responseType = 'json';

    req.open('GET', `https://cors-anywhere.herokuapp.com/https://api.myanimelist.net/v2/anime?q=${anime_search}&limit=10&fields=id,title,main_picture,alternative_titles,synopsis,genres,mean,num_episodes`, true); // "https://cors-anywhere.herokuapp.com" is used because for some reason MAL API does not include CORS header ("https://myanimelist.net/forum/?topicid=1924562")

    req.setRequestHeader("X-MAL-CLIENT-ID", key) // Add Client ID header with "key" value provided by user
    req.onload  = function() {
    delete_prev_result(); // Clear all previous result(s)
    var jsonResponse = req.response;
    data_get = jsonResponse // Copy response into a variable, just in case
    console.log(jsonResponse.status)
    // Display Console
    console.log(`
      API Returned ${jsonResponse.data.length} data
    `);
    console.log(jsonResponse);
    

    for (let i = 0; i < jsonResponse.data.length; i++) { // loop get search data and display it
      var anime_identify = jsonResponse.data[i].node.id;
      var anime_title = jsonResponse.data[i].node.alternative_titles.en; // get the english title by default
      if (anime_title==null||anime_title==""){ // if there's no english title, fallback to romaji title
        anime_title = jsonResponse.data[i].node.title
      }
      var anime_desc = jsonResponse.data[i].node.synopsis;
      var anime_genres = jsonResponse.data[i].node.genres.map(x => x.name).join(", "); // display all genre name separated by comma
      var anime_rating = jsonResponse.data[i].node.mean;
      var anime_pic = jsonResponse.data[i].node.main_picture.large;

      // Display Console
      console.log(`
        [${anime_identify}]
        ${anime_title}
        |   title: ${jsonResponse.data[i].node.title}
        |   en: ${jsonResponse.data[i].node.alternative_titles.en}
        |   ja:${jsonResponse.data[i].node.alternative_titles.ja}
        ##########################################################

        ${anime_desc}

        ##########################################################
        [${anime_genres}]
        ${anime_rating}
        ${anime_pic}
      `)


      // document.write(`
      //   <h1>${anime_title} [${anime_rating}]</h1>
      //   <p>${anime_desc}</p>
      //   <p>ID: ${anime_identify}</p>
      //   <p>Genre: ${anime_genres}</p>
      //   <img src="${anime_pic}" alt="">
      // `);
      const div_card = document.createElement('div');
      div_card.className = `card`;
      div_card.innerHTML = `
        <div id="anime_sidebar_card">
          <img src="${anime_pic}" alt="${anime_title} Picture">
        </div>
        <div id="anime_result_card">
          <div id="title">
          <h2>[${anime_rating}] ${anime_title}</h2>
          </div>
          <div id="genre">
              ${anime_genres}
          </div>
          <div id="description_card">
            <p>${anime_desc}</p>
          </div>
        </div>
        <div>
          <button title="Add to List Jadwal" onclick="add_jadwal_list(${i})" type="button">
            <span class="material-symbols-outlined">playlist_add</span>
          </button>
          <button title="Open in MAL" onclick="window.open('https://myanimelist.net/anime/${anime_identify}', '_blank').focus();" type="button">
            <span class="material-symbols-outlined">open_in_new</span>
          </button>
          <button title="Copy Anime ID to Clipboard" onclick="navigator.clipboard.writeText('${anime_identify}');" type="button">
            <span class="material-symbols-outlined">content_copy</span>
          </button>   
        </div>
      `;
      document.getElementById('content').appendChild(div_card);
    }
  };
  req.send(null);
  }
  if (document.getElementById("input_type").value=="id"){
    var req = new XMLHttpRequest(); // Create a new request
    req.responseType = 'json';

    req.open('GET', `https://cors-anywhere.herokuapp.com/https://api.myanimelist.net/v2/anime/${anime_search}?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics`, true); // "https://cors-anywhere.herokuapp.com" is used because for some reason MAL API does not include CORS header ("https://myanimelist.net/forum/?topicid=1924562")

    req.setRequestHeader("X-MAL-CLIENT-ID", key) // Add Client ID header with "key" value provided by user
    req.onload  = function() {
    delete_prev_result(); // Clear all previous result(s)
    var jsonResponse = req.response;
    data_get = jsonResponse // Copy response into a variable, just in case
    console.log(jsonResponse.status)
    console.log(jsonResponse);
    

    
      var anime_identify = jsonResponse.id;
      var anime_title = jsonResponse.alternative_titles.en; // get the english title by default
      if (anime_title==null||anime_title==""){ // if there's no english title, fallback to romaji title
        anime_title = jsonResponse.title
      }
      var anime_desc = jsonResponse.synopsis;
      if (jsonResponse.genres==null){
        var anime_genres = "";
      }else{
        var anime_genres = jsonResponse.genres.map(x => x.name).join(", ");
      }
       // display all genre name separated by comma
      var anime_rating = jsonResponse.mean;
      var anime_pic = jsonResponse.main_picture.large;

      // Display Console
      console.log(`
        [${anime_identify}]
        ${anime_title}
        |   title: ${jsonResponse.title}
        |   en: ${jsonResponse.alternative_titles.en}
        |   ja:${jsonResponse.alternative_titles.ja}
        ##########################################################

        ${anime_desc}

        ##########################################################
        [${anime_genres}]
        ${anime_rating}
        ${anime_pic}
      `)


      // document.write(`
      //   <h1>${anime_title} [${anime_rating}]</h1>
      //   <p>${anime_desc}</p>
      //   <p>ID: ${anime_identify}</p>
      //   <p>Genre: ${anime_genres}</p>
      //   <img src="${anime_pic}" alt="">
      // `);
      const div_card = document.createElement('div');
      div_card.className = `card`;
      div_card.innerHTML = `
        <div id="anime_sidebar_card">
          <img src="${anime_pic}" alt="${anime_title} Picture">
        </div>
        <div id="anime_result_card">
          <div id="title">
          <h2>[${anime_rating}] ${anime_title}</h2>
          </div>
          <div id="genre">
              ${anime_genres}
          </div>
          <div id="description_card">
            <p>${anime_desc}</p>
          </div>
        </div>
        <div>
          <button title="Add to List Jadwal" onclick="add_jadwal_list(0)" type="button">
            <span class="material-symbols-outlined">playlist_add</span>
          </button>
          <button title="Open in MAL" onclick="window.open('https://myanimelist.net/anime/${anime_identify}', '_blank').focus();" type="button">
            <span class="material-symbols-outlined">open_in_new</span>
          </button>
          <button title="Copy Anime ID to Clipboard" onclick="navigator.clipboard.writeText('${anime_identify}');" type="button">
            <span class="material-symbols-outlined">content_copy</span>
          </button>   
        </div>
      `;
      document.getElementById('content').appendChild(div_card);
    
  };
  req.send(null);
  }

  
  
}

function delete_prev_result(){ // Clear previous result called by get_anime() function
  document.getElementById('content').innerHTML = ""
}

function add_jadwal_list(index){ // Add item to jadwal

  if (document.getElementById("input_type").value=="title"){
    if (data_get.data[index].node.mean==null){ // If item does not have mean/score yet, display "???" instead of "Undefined"
      data_get.data[index].node.mean="???"
    }
  
    // Load item
    var pushed_list = JSON.parse(`
    {
      "id": ${data_get.data[index].node.id},
      "title": "${data_get.data[index].node.title}",
      "main_picture": {
          "medium": "${data_get.data[index].node.main_picture.medium}",
          "large": "${data_get.data[index].node.main_picture.large}"
      },
      "alternative_titles": {
          "synonyms": [
          "${data_get.data[index].node.alternative_titles.synonyms}"
          ],
          "en": "${data_get.data[index].node.alternative_titles.en}",
          "ja": "${data_get.data[index].node.alternative_titles.ja}"
      },
      "synopsis": ${JSON.stringify(data_get.data[index].node.synopsis)},
      "genres": ${JSON.stringify(data_get.data[index].node.genres)},
      "mean": ${JSON.stringify(data_get.data[index].node.mean)},
      "num_episodes": ${JSON.stringify(data_get.data[index].node.num_episodes)},
      "watched_episodes": 0
    }
    `)
    jadwal_list.push(pushed_list); // Insert loaded item into array
  
    console.log(jadwal_list)
    localStorage.setItem("saved_jadwal", JSON.stringify(jadwal_list)); // Save jadwal into Cache
    console.log(localStorage.getItem("saved_jadwal"))
    console.log(`
      ADDED TO LIST:
      ${data_get.data[index].node.id}
      ${data_get.data[index].node.title}
      ${data_get.data[index].node.alternative_titles.en}
      ${data_get.data[index].node.alternative_titles.ja}
      ${JSON.stringify(data_get.data[index].node.genres)}
    `)
    // localStorage.setItem("saved_jadwal", JSON.stringify(jadwal_list));
  }
  if (document.getElementById("input_type").value=="id"){
    if (data_get.mean==null){ // If item does not have mean/score yet, display "???" instead of "Undefined"
      data_get.mean="???"
    }
    if (data_get.genres==null){
      var pushed_list = JSON.parse(`
    {
      "id": ${data_get.id},
      "title": "${data_get.title}",
      "main_picture": {
          "medium": "${data_get.main_picture.medium}",
          "large": "${data_get.main_picture.large}"
      },
      "alternative_titles": {
          "synonyms": [
          "${data_get.alternative_titles.synonyms}"
          ],
          "en": "${data_get.alternative_titles.en}",
          "ja": "${data_get.alternative_titles.ja}"
      },
      "synopsis": ${JSON.stringify(data_get.synopsis)},
      "genres": [
        {
        "id": 99999999,
        "name": "undefined"
        }
      ],
      "mean": ${JSON.stringify(data_get.mean)},
      "num_episodes": ${JSON.stringify(data_get.num_episodes)},
      "watched_episodes": 0
    }
    `)
    } else{
      var pushed_list = JSON.parse(`
    {
      "id": ${data_get.id},
      "title": "${data_get.title}",
      "main_picture": {
          "medium": "${data_get.main_picture.medium}",
          "large": "${data_get.main_picture.large}"
      },
      "alternative_titles": {
          "synonyms": [
          "${data_get.alternative_titles.synonyms}"
          ],
          "en": "${data_get.alternative_titles.en}",
          "ja": "${data_get.alternative_titles.ja}"
      },
      "synopsis": ${JSON.stringify(data_get.synopsis)},
      "genres": ${JSON.stringify(data_get.genres)},
      "mean": ${JSON.stringify(data_get.mean)},
      "num_episodes": ${JSON.stringify(data_get.num_episodes)},
      "watched_episodes": 0
    }
    `)
    }
  
    // Load item
    jadwal_list.push(pushed_list); // Insert loaded item into array
  
    console.log(jadwal_list)
    localStorage.setItem("saved_jadwal", JSON.stringify(jadwal_list)); // Save jadwal into Cache
    console.log(localStorage.getItem("saved_jadwal"))
    console.log(`
      ADDED TO LIST:
      ${data_get.id}
      ${data_get.title}
      ${data_get.alternative_titles.en}
      ${data_get.alternative_titles.ja}
      ${JSON.stringify(data_get.genres)}
    `)
    // localStorage.setItem("saved_jadwal", JSON.stringify(jadwal_list));
  }

  
}
function add_episode(index){
  jadwal_list[index].watched_episodes = jadwal_list[index].watched_episodes+1
  console.log(jadwal_list[index])
  localStorage.setItem("saved_jadwal", JSON.stringify(jadwal_list));
  // document.getElementById("title")[index].innerHTML = `<h2>[${jadwal_list[index].mean}] ${jadwal_list[index].title} (${jadwal_list[index].watched_episodes}/${jadwal_list[index].num_episodes})</h2>`
  // console.log(localStorage.getItem("saved_jadwal"))
  location.reload();
}
function remove_episode(index){
  jadwal_list[index].watched_episodes = jadwal_list[index].watched_episodes-1
  console.log(jadwal_list[index])
  localStorage.setItem("saved_jadwal", JSON.stringify(jadwal_list));
  // document.getElementById("title").innerHTML = `<h2>[${jadwal_list[index].mean}] ${jadwal_list[index].title} (${jadwal_list[index].watched_episodes}/${jadwal_list[index].num_episodes})</h2>`
  // console.log(localStorage.getItem("saved_jadwal"))
  location.reload();
}

function webhook_config_load(){
  document.getElementById("webhook_url").value = localStorage.getItem("webhook_url_saved")
  document.getElementById("webhook_name").value = localStorage.getItem("webhook_name_saved")
  document.getElementById("webhook_avatarurl").value = localStorage.getItem("webhook_avatarurl_saved")
  document.getElementById("webhook_title").value = localStorage.getItem("webhook_title_saved")
  document.getElementById("webhook_titleurl").value = localStorage.getItem("webhook_titleurl_saved")
}
function webhook_config_save(){
  var webhook_url = document.getElementById("webhook_url").value
  var webhook_name = document.getElementById("webhook_name").value
  var webhook_avatarurl = document.getElementById("webhook_avatarurl").value
  var webhook_title = document.getElementById("webhook_title").value
  var webhook_titleurl = document.getElementById("webhook_titleurl").value
  localStorage.setItem("webhook_url_saved", webhook_url);
  localStorage.setItem("webhook_name_saved", webhook_name);
  localStorage.setItem("webhook_avatarurl_saved", webhook_avatarurl);
  localStorage.setItem("webhook_title_saved", webhook_title);
  localStorage.setItem("webhook_titleurl_saved", webhook_titleurl);
}

function webhook_post(index){
  var embed_desc = `${jadwal_list.map(x => x.title).join(`\\n`)}`

  var embeds = JSON.parse(`{
      "title": "${localStorage.getItem("webhook_title_saved")} | Sesi <t:${Math.round(Date.now()/1000)}:D>",
      "description": "${embed_desc}",
      "url": "${localStorage.getItem("webhook_titleurl_saved")}",
      "color": 15597654,
      "fields": [
        {
          "name": "${jadwal_list[index].title}/${jadwal_list[index].alternative_titles.ja}",
          "value": "Score: ${jadwal_list[index].mean}\\nGenre: \`${jadwal_list[index].genres.map(x => x.name).join(", ")}\`\\n${jadwal_list[index].watched_episodes}/${jadwal_list[index].num_episodes} Episodes\\n\\n[Open on MyAnimeList](https://myanimelist.net/anime/${jadwal_list[index].id})",
          "inline": true
        }
      ],
      "footer": {
        "text": "\\"adakah jadwal?\\""
      },
      "image": {
        "url": "${jadwal_list[index].main_picture.large}"
      }
  }`)
  var msgdest = localStorage.getItem("webhook_url_saved");
  // var msg = prompt("Input Message:");
  sendMessage();
  function sendMessage() {
    // var span_Text = document.getElementById("tosend").innerText;
    // console.log(span_Text)
    var request = new XMLHttpRequest();
    request.open("POST", `${msgdest}?wait=true`, false);

    request.setRequestHeader('Content-type', 'application/json');

    var params = {
      username: localStorage.getItem("webhook_name_saved"),
      avatar_url: localStorage.getItem("webhook_avatarurl_saved"),
      embeds: [embeds]
    }
    if (request.readyState == XMLHttpRequest.DONE) {
      alert(request.responseText);
      console.log(request.responseText);
    }
    request.send(JSON.stringify(params));
    console.log(request.responseText);
    var request_response = JSON.parse(request.response)
    console.log(`
      Webhook sent with ID: ${request_response.id}
      by: ${request_response.author.username}
    `);
  }
}

function test_cors(){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", "https://cors-anywhere.herokuapp.com/https://api.myanimelist.net/v2/anime?q=lupin", false ); // false for synchronous request
  xmlHttp.setRequestHeader("X-MAL-CLIENT-ID", key) 
  xmlHttp.send( null );
  console.log(xmlHttp.responseText)
  if (xmlHttp.status==403){
    console.log(`
      403 FORBIDDEN
      
      Please visit "https://cors-anywhere.herokuapp.com" and request for temporary access to demo server

      "Why?"
      MAL API does not include CORS header (https://myanimelist.net/forum/?topicid=1924562), thus making any request return "Cross-Origin Request Blocked".
      So... the workaround for now is to host your own proxy server or use the demo server like this :\\
    `)
  }
}

for (i = 0; i < localStorage.length; i++){ // Display ALL available saved data/cache in this domain
    console.log("LISTED|",localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
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
