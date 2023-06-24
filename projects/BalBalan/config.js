// ====================Configs=====================
const monthName = [`Januari`,`Februari`,`Maret`,`April`,`Mei`,`Juni`,`Juli`,`Agustus`,`September`,`Oktober`,`November`,`Desember`]
const dayName = [`Minggu`,`Senin`,`Selasa`,`Rabu`,`Kamis`,`Jum'at`,`Sabtu`]

var counter = 0
const fieldsAll = []
const embedAll = []
const finishedField = []
var prevEmbed
// var prevUpcoming = ``

// Kamar
// var URLWebhook = "https://discord.com/api/webhooks/871795497881440278/PGB-ytcBMwXtz27-t_2EMkz7MT8VtYGrucuDIR_etDDKTqq5FMnZj_iJeDSH0qlgOFez"
// Jadwal
// var URLWebhook = "https://discord.com/api/webhooks/979944457350823986/btUsQ7W2rjoTF8HcqST1qvFBHc1gYAHv2nfUOo-R_UAQPDeS8od0z7Ymh5nxRkoMv1Ji"



var webhookName = "BalBalan"


var siteUpcomingInterval = 60000*60 //60 minute
var siteLiveInterval = 1000*10 // 10sec
var updateInterval = 1000*5 //10sec

// Save Data
var saveData = JSON.parse(localStorage.getItem("balbalan_save"))
var URLWebhook = saveData[0].Settings.webhookURL
// var timeOffset = saveData[0].Settings.timeOffset
var timeOffset = 8



