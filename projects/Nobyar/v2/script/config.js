var user_data = localStorage.getItem("nobyarV2")
var searchInput = document.querySelector("#header-section > input[type=text]")
var overlayDim = document.querySelectorAll(".dim")

var sites = [
    {
        "url":"https://yugenanime.tv"
    },
    {
        "url":"https://kuramanime.net"
    },
    {
        "url":"https://zoro.to"
    }
]

var errMSG = {
    "URL":"Entry does not have valid URL",
}