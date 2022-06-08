var human_hp
var human_hp_prev
var bot_hp
var bot_hp_prev
var human_dice
var bot_dice
var rng_char
function singleplayer_roll(){
    human_dice = Math.floor((Math.random() * 6) + 1);
    bot_dice = Math.floor((Math.random() * 6) + 1);
    if (human_dice > bot_dice){
        bot_hp_prev = bot_hp
        bot_hp = bot_hp-human_dice
        console.log(`PREV:${bot_hp_prev}\nNOW:${bot_hp}`)
        HPNormalize();
        document.getElementById("enemy_hp").innerHTML = `${bot_hp}/100`
        document.getElementById("enemy_hpbar").value = `${bot_hp}`
        for (i = bot_hp_prev; i > bot_hp; i--){
            console.log(i)
            setTimeout(function(){
                // bot_hp_prev--
                // document.getElementById("enemy_hpbardamaged").value--
                var bar = document.getElementById("enemy_hpbardamaged");
                bar.style.width = `${bot_hp}%`;
            }, 500);
        }
        // singleplayer_human_atk();
        console.log(`${human_dice} vs ${bot_dice}\nHuman Attacked BOT\n-${human_dice}HP\nHuman(${human_hp}HP) vs BOT(${bot_hp}HP)`)
    } else if (bot_dice > human_dice){
        human_hp_prev = human_hp
        human_hp = human_hp-bot_dice
        HPNormalize();
        document.getElementById("player_hp").innerHTML = `${human_hp}/100`
        document.getElementById("player_hpbar").value = `${human_hp}`
        for (i = human_hp_prev; i > human_hp; i--){
            console.log(i)
            setTimeout(function(){
                var bar = document.getElementById("player_hpbardamaged");
                bar.style.width = `${human_hp}%`;
            }, 500);
        }
        // singleplayer_bot_atk();
        console.log(`${human_dice} vs ${bot_dice}\nBOT Attacked Human\n-${bot_dice}HP\nHuman(${human_hp}HP) vs BOT(${bot_hp}HP)`)
    } else if (bot_dice = human_dice){
        // singleplayer_bot_atk();
        console.log(`${human_dice} vs ${bot_dice}\nDraw!\nHuman(${human_hp}HP) vs BOT(${bot_hp}HP)`)
    } else if (human_dice = bot_dice){
        // singleplayer_bot_atk();
        console.log(`${human_dice} vs ${bot_dice}\nDraw!\nHuman(${human_hp}HP) vs BOT(${bot_hp}HP)`)
    }
    endgame();
};
function endgame(){
    if (human_hp <= 0){
        console.log(`Game Over`)
        document.getElementById("roll_button").style = `visibility: hidden;`
        setTimeout(function(){
            load();
        }, 5000);
    } else if (bot_hp <= 0){
        console.log(`You Win`)
        document.getElementById("roll_button").style = `visibility: hidden;`
        setTimeout(function(){
            load();
        }, 5000);
    }
}

function load(){
    rng_char = Math.floor((Math.random() * 2) + 1);
    console.log(`RNG = ${rng_char}`)
    // rng_char = 2
    human_hp = 100
    bot_hp = 100
    document.getElementById("enemy_hp").innerHTML = `${bot_hp}/100`
    document.getElementById("enemy_hpbardamaged").style.width = `${bot_hp}%`;
    document.getElementById("enemy_hpbar").value = `${bot_hp}`
    // document.getElementById("enemy_hpbardamaged").value = `${bot_hp}`
    document.getElementById("player_hp").innerHTML = `${human_hp}/100`
    document.getElementById("player_hpbar").value = `${human_hp}`
    document.getElementById("roll_button").style = `visibility: visible;`
    console.log(`Game Loaded.\nHuman(${human_hp}HP) vs BOT(${bot_hp}HP)`)
    for (i = 0; i < localStorage.length; i++)   {
        console.log("LISTED|",localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
    }
    load_playerdata();
}
function load_playerdata(){
    if (rng_char==1){
        document.getElementById("enemy_nameplate").innerHTML = `Hoshimachi Suisei (kmd #Sui53X)`
        document.getElementById("enemy_chara").style = `background-image:url(../Dicey/assets/Sui_Capcom.png) ; background-size: 80%; background-repeat: no-repeat; background-position: center 10%;`
    } else {
        // document.getElementById("enemy_nameplate").innerHTML = `Calliope Mori (kmd #${localStorage.UserID})`
        document.getElementById("enemy_nameplate").innerHTML = `Calliope Mori (kmd #Sui53X)`
        document.getElementById("enemy_chara").style = `background-image:url(../Dicey/assets/kv_calliope_min.png) ; background-size: 100%; background-repeat: no-repeat; background-position: center 14%;`
    }
    
}
function load_json(){
    var statjson
    const xhr = new XMLHttpRequest(),
    method = "GET",
    url = "https://komodolegend18.github.io/projects/Dicey/stats.json";

    xhr.open(method, url, true);
    xhr.onreadystatechange = function () {
    // In local files, status is 0 upon success in Mozilla Firefox
    if(xhr.readyState === XMLHttpRequest.DONE) {
        var status = xhr.status;
        if (status === 0 || (status >= 200 && status < 400)) {
        // The request has been completed successfully
        statjson=JSON.parse(xhr.responseText);
        console.log(statjson);
        // console.log(`respond: ${xhr.responseText}`);
        } else {
        // Oh no! There has been an error with the request!
        }
    }
    };
    xhr.send();    
}
function HPNormalize(){
    if (bot_hp<0){
        bot_hp = 0
    } else if (human_hp<0){
        human_hp = 0
    }
}