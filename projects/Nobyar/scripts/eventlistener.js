loadEvent()
function loadEvent(){
    let save = document.getElementsByClassName(`inputSave`)
    if (save){
        for (let i = 0; i < save.length; i++){
            save[i].addEventListener(`change`, webhook_config_save)
        }
    }

    let settingButton = document.getElementById(`settings`);
    if (settingButton){
        settingButton.addEventListener(`click`, settingsOpen)
        // console.warn(`Event added`)
    }
    let settingButtonClose = document.getElementById(`settingsCloseButton`);
    if (settingButtonClose){
        settingButtonClose.addEventListener(`click`, settingsClose)
    }
    


    if (document.visibilityState==`visible`){
        document.title = `MyNobyarList`
    } else {
        let date = new Date()
        let hr = date.getHours()
        let mn = date.getMinutes()
        let sc = date.getSeconds()
        if (hr<10){
            hr = `0`+hr
        }
        if (mn<10){
            mn = `0`+mn
        }
        if (sc<10){
            sc = `0`+sc
        }
        document.title = `${hr}:${mn}:${sc}`
    }
    
    setTimeout(loadEvent,100)
}


let search = document.getElementById(`input_id`)
if (search){
    search.addEventListener(`change`, function(){
        let searchType = document.getElementById("input_type").value
        getAnime(searchType,search.value).then(response=>{
        data_get = response
        delete_prev_result(); // Clear all previous result(s)
        if (searchType==`title`){
            for (let i=0; i < response.length; i++){
                let data = response[i].node
                listElement(data,i)
                console.warn(data.title)
            }
        } else {
            let data = response
            listElement(data)
            console.warn(data.title)
        }
        document.getElementById('content').scrollTop = 0
        console.log(response)
        }).catch(err=>{
            console.error(err)
            delete_prev_result(); // Clear all previous result(s)
            listElementError(err)
        })
    })
}