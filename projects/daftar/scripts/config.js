export const config = {
    resetLS: () => {
        resetLocalstorage();
    }
};

const sites = [
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

// note: doesnt return if there is query
// const cors_proxy = "https://corsmirror.com/v1?url="
// const cors_proxy = "https://cors-anywhere.herokuapp.com/"



const errMSG = {
    "URL":"Entry does not have valid URL",
}

function resetLocalstorage(){
    // if (confirm("RESETTING NOBYAR DATA\nAre you SURE?")) {
        localStorage.removeItem("nobyarV2");
        // debugger
        location.reload()
    // }
}