var versusPlayerData = [
    {
        "username":"username",
        "avatar":"https://cdn.discordapp.com/avatars/626849987984228355/cb716d2f03886ae89ee14a91acb3934d.png?size=100",
        "charID":"charID",
        "title":"title",
        "chatFX":"chatFX",
        "chatID":"-",
        "HP":50 // due to testing purpose, it is set to 50 
    },
    {
        "username":"username",
        "avatar":"https://cdn.discordapp.com/avatars/626849987984228355/cb716d2f03886ae89ee14a91acb3934d.png?size=100",
        "charID":"charID",
        "title":"title",
        "chatFX":"chatFX",
        "chatID":"-",
        "HP":50
    }
]
var role

var saveData = JSON.parse(localStorage.getItem("dicey2_profileData"))

function storeVersusPlayer(){
    if (role=="host"){
        versusPlayerData[0].username = saveData[0].Username
        versusPlayerData[0].avatar = saveData[0].Avatar
        versusPlayerData[0].charID = saveData[0].ActiveItems.Character
        versusPlayerData[0].title = "-"
        versusPlayerData[0].chatFX = saveData[0].ActiveItems.ChatFX
        versusPlayerData[0].chatID = "-"

        console.warn(versusPlayerData)
    } else {
        versusPlayerData[1].username = saveData[0].Username
        versusPlayerData[1].avatar = saveData[0].Avatar
        versusPlayerData[1].charID = saveData[0].ActiveItems.Character
        versusPlayerData[1].title = "-"
        versusPlayerData[1].chatFX = saveData[0].ActiveItems.ChatFX
        versusPlayerData[1].chatID = "-"

        console.warn(versusPlayerData)
    }
}