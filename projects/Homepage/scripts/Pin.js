function addPinCells() {
    let iconrow = document.getElementById("PinnedSite").rows[0]; //define icon row
    let titlerow = document.getElementById("PinnedSite").rows[1]; //define title row
    let cellnum = document.getElementById("PinnedSite").rows[0].cells.length; //get number of cells in row
    let x = iconrow.insertCell(cellnum); //add cell to icon row
    let y = titlerow.insertCell(cellnum); //add cell to title row
    let pinurl = prompt("Input URL to pin"); //ask url
    let pintitle = prompt("Input title to display"); //ask title
    x.innerHTML = `<a href="${pinurl}"><img width="50px" height="50px" src='https://s2.googleusercontent.com/s2/favicons?sz=64&domain_url=${pinurl}' title='${pintitle}'/></a>`; //display icon
    // x.innerHTML = `${pinurl}`; //display url
    y.innerHTML = `${pintitle}`; //display title
}
function deletePinCells() {
    let iconrow = document.getElementById("PinnedSite").rows[0]; //define icon row
    let titlerow = document.getElementById("PinnedSite").rows[1]; //define title row
    let cellnum = document.getElementById("PinnedSite").rows[0].cells.length; //get number of cells in row
    iconrow.deleteCell(cellnum-1); //
    titlerow.deleteCell(cellnum-1); //
}