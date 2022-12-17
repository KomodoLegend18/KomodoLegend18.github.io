// var key = prompt("Input KEY:");
var data_get
var jadwal_list = []
var data_saved = localStorage.getItem("saved_jadwal")
console.log("Saved Jadwal (Cache): ")
console.log(JSON.parse(data_saved))
// console.log(data_saved.length)

load_site();


// var anime_id = prompt("Input Anime ID:")



// setInterval(test_cors, 5000);




function delete_save(){
  localStorage.removeItem("saved_jadwal");
  location.reload();
}



function add_jadwal_list(index){ // Add item to jadwal

  if (document.getElementById("input_type").value=="title"){ // if search input is by Title
    if (data_get.data[index].node.mean==null){ // If item does not have mean/score yet, display "???" instead of "Undefined"
      data_get.data[index].node.mean="???"
    }
  
    // Load item
    var pushed_list = data_get.data[index].node
    pushed_list[`watched_episodes`] = 0
    // let formated_list = JSON.stringify(pushed_list)
    console.log(pushed_list)
    jadwal_list.push(JSON.parse(JSON.stringify(pushed_list))); // Insert loaded item into array\

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
  if (document.getElementById("input_type").value=="id"){ // if search input is by ID
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
  jadwal_list[index].watched_episode = jadwal_list[index].watched_episode+1
  console.log(jadwal_list[index])
  localStorage.setItem("saved_jadwal", JSON.stringify(jadwal_list));
  // document.getElementById("title")[index].innerHTML = `<h2>[${jadwal_list[index].mean}] ${jadwal_list[index].title} (${jadwal_list[index].watched_episodes}/${jadwal_list[index].num_episodes})</h2>`
  // console.log(localStorage.getItem("saved_jadwal"))
  // location.reload();
}
function remove_episode(index){
  jadwal_list[index].watched_episode = jadwal_list[index].watched_episode-1
  console.log(jadwal_list[index])
  localStorage.setItem("saved_jadwal", JSON.stringify(jadwal_list));
  // document.getElementById("title").innerHTML = `<h2>[${jadwal_list[index].mean}] ${jadwal_list[index].title} (${jadwal_list[index].watched_episodes}/${jadwal_list[index].num_episodes})</h2>`
  // console.log(localStorage.getItem("saved_jadwal"))
  location.reload();
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
  function mapped_title(index){
    return [`${index.title} | Next episode <t:1665846000:R>`]
  }
  // var embed_desc = `${jadwal_list.map(x => x.title).join(`\\n`)}`
  var embed_desc = jadwal_list.map(mapped_title).join(`\\n`)
  console.log(embed_desc)

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

function test_cors(){ // Test if request is allowed
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", "https://corsproxy.io/?https://api.myanimelist.net/v2/anime?q=lupin", false ); // false for synchronous request
  xmlHttp.setRequestHeader("X-MAL-CLIENT-ID", key) 
  xmlHttp.send( null );
  // console.log(xmlHttp.responseText)
  if (xmlHttp.status==403){
    console.log(`
      403 FORBIDDEN
      
      Please visit "https://cors-anywhere.herokuapp.com" and request for temporary access to demo server

      "Why?"
      MAL API does not include CORS header (https://myanimelist.net/forum/?topicid=1924562), thus making any request return "Cross-Origin Request Blocked".
      So... the workaround for now is to host your own proxy server or use the demo server like this :\\
    `)
  } else {
    console.log(JSON.parse(xmlHttp.response))
  }
}



// for (i = 0; i < localStorage.length; i++){ // Display ALL available saved data/cache in this domain
//     console.log("LISTED|",localStorage.key(i) + "=\n", localStorage.getItem(localStorage.key(i)));
// }



function export_json(){
  let dataStr = localStorage.getItem("saved_jadwal");
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  let exportFileDefaultName = 'data.json';

  let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function import_json(){
  file = document.getElementById("input_file").files[0];
  
  let json_reader = new FileReader();
  json_reader.onload= function(){
    var json_content = JSON.parse(json_reader.result)
    // var json_content_parsed = `
    // File Loaded!
    // ID: ${json_content[0].id}

    // ${json_content[0].title} [${json_content[0].mean}]

    // ${json_content[0].synopsis}
    // `
    // alert(json_content_parsed)
    for (i = 0; i < json_content.length; i++){
      jadwal_list.push(json_content[i]);
      localStorage.setItem("saved_jadwal", JSON.stringify(jadwal_list));
    }
     // Insert loaded item into array
    location.reload();
    console.log(jadwal_list)
     // Save jadwal into Cache
  }
  json_reader.readAsText(file);
}