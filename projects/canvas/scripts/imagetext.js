function textimagecanvas() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
    ctx.drawImage(image.src, 10, 10);
    ctx.font = "30px Arial";
    ctx.textAlign = "center"; 
    ctx.fillText("Hello World",120,50);
};