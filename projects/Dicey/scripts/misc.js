var playerhp = 100
var playerhp_old
var enemyhp = 100
var enemyhp_old
var chara = document.getElementById("chara_illust");
var log_stat_player = 0
var log_stat_draw = 0
var log_stat_enemy = 0
function attack(){
    player_roll = Math.floor((Math.random() * 6) + 1);
    enemy_roll = Math.floor((Math.random() * 6) + 1);
    hurt_rng = Math.floor((Math.random() * 2) + 1);
    // var hp
    if (player_roll > enemy_roll){
        hurtanim()
        enemyhp_old = enemyhp
        enemyhp = enemyhp-player_roll
        
        const log_history = document.createElement("div");
        log_history.setAttribute(`class`, `log_history`);
        log_history.setAttribute(`id`,`log_player`)
        log_history.textContent=`PLAYER TURN \r\n${enemyhp_old}-${player_roll}=${enemyhp}`
        document.getElementById("log_display").appendChild(log_history)
        document.getElementById("log_display").scrollTop=document.getElementById("log_display").scrollHeight

        log_stat_track(1,0,0)
        
        normalizeHP()
        updatehpbar();
    } else if (enemy_roll > player_roll){
        playerhp_old = playerhp
        playerhp = playerhp-enemy_roll

        const log_history = document.createElement("div");
        log_history.setAttribute(`class`, `log_history`);
        log_history.setAttribute(`id`,`log_enemy`)
        log_history.textContent=`ENEMY TURN \r\n${playerhp_old}-${enemy_roll}=${playerhp}`
        document.getElementById("log_display").appendChild(log_history)
        document.getElementById("log_display").scrollTop=document.getElementById("log_display").scrollHeight

        log_stat_track(0,0,1)

        normalizeHP()
        updatehpbar();
    } else if (player_roll==enemy_roll){
        const log_history = document.createElement("div");
        log_history.setAttribute(`class`, `log_history`);
        log_history.setAttribute(`id`,`log_draw`)
        log_history.textContent=`DRAW... \r\n${enemy_roll} vs ${player_roll}`
        document.getElementById("log_display").appendChild(log_history)
        document.getElementById("log_display").scrollTop=document.getElementById("log_display").scrollHeight

        log_stat_track(0,1,0)
    }
    endgame_check();

    function endgame_check(){
        if (playerhp<=0){
            // alert("you lose")
            setTimeout(function () {
                restarthp(Math.floor((Math.random() * 5) + 1))
            }, 1000);
            
        } else if (enemyhp<=0){
            // alert("you win")
            setTimeout(function () {
                restarthp(Math.floor((Math.random() * 5) + 1))
            }, 1000);
        }
    }
    function normalizeHP(){
        if (playerhp<0){
            document.getElementById("log_display").innerHTML = ``
        document.getElementById("main_content_player_deck").innerHTML=``
            playerhp = 0
        } else if(enemyhp<0){
            document.getElementById("log_display").innerHTML = ``
        document.getElementById("main_content_player_deck").innerHTML=``
            enemyhp = 0
        }
    }
    
    function log_stat_track(player,draw,enemy){
        log_stat_player = log_stat_player+player
        document.getElementById("log_header_stat_player").innerText = `PLAYER:\n${log_stat_player}`

        log_stat_draw = log_stat_draw+draw
        document.getElementById("log_header_stat_draw").innerText = `DRAW:\n${log_stat_draw}`

        log_stat_enemy = log_stat_enemy+enemy
        document.getElementById("log_header_stat_enemy").innerText = `ENEMY:\n${log_stat_enemy}`
    }
    

    function hurtanim() {
        // var audio = new Audio('https://audio-previews.elements.envatousercontent.com/files/113089285/preview.mp3?response-content-disposition=attachment%3B+filename%3D%22C6MJZLP-slash-at-body.mp3%22');
        var audio = new Audio('../assets/IMPACT_Generic_03_mono.wav');
        audio.mozPreservesPitch = false;
        audio.playbackRate=hurt_rng
        audio.play();
        chara.classList.add(`hurt${hurt_rng}`);
        setTimeout(function () {
            chara.classList.remove(`hurt1`)
        }, 500);
        setTimeout(function () {
            chara.classList.remove(`hurt2`)
        }, 500);
    }

    function restarthp(rng){
        playerhp = 100
        playerhp_old = playerhp
        enemyhp = 100
        enemyhp_old = enemyhp

        let i = 0
        while (i < rng) {
            const div_card = document.createElement('div'); 
            div_card.className = `main_content_player_card`;
            div_card.setAttribute(`id`,`attack`)
            div_card.setAttribute(`onclick`,`attack()`)
            div_card.innerHTML = `
            <span class="material-symbols-rounded">
                            casino
                        </span>
            `;
            document.getElementById('main_content_player_deck').appendChild(div_card);
            // your code
            i++
            console.log(i)
            console.error()
            if (document.getElementById("main_content_player_deck").children.length >5){
                document.getElementById("main_content_player_deck").children[Math.floor((Math.random() * 5) + 1)].remove()
            }
        }
            
                
                     
            
            
        
        updatehpbar()
    }
    function updatehpbar(){
        document.getElementById("main_content_playerhp_bar").style.width = `${playerhp}%`
        document.getElementById("main_content_playerhp_damage").style.width = `${playerhp}%`

        document.getElementById("main_content_enemyhp_bar").style.width = `${enemyhp}%`
        document.getElementById("main_content_enemyhp_damage").style.width = `${enemyhp}%`
    }
    
}

// ===============================================
setInterval(loadtwemoji,1000)
function loadtwemoji(){
    twemoji.parse(document.body)    
}