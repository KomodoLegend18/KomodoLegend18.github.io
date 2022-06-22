var canvas = document.createElement('canvas');
var ctx    = canvas.getContext('2d');
canvas.style.border = "1px solid black";
document.body.appendChild(canvas);

function todo(ctx, text, fontSize, fontColor) {
    var max_width  = 120;
    var fontSize   =  18;
    var lines      =  new Array();
    var width = 0, i, j;
    var result;
    var color = fontColor || "white";

    // Font and size is required for ctx.measureText()
    ctx.font   = fontSize + "px Arial";

    
    // Start calculation
    while ( text.length ) {
    	for( i=text.length; ctx.measureText(text.substr(0,i)).width > max_width; i-- );
    
    	result = text.substr(0,i);
    
    	if ( i !== text.length )
    		for( j=0; result.indexOf(" ",j) !== -1; j=result.indexOf(" ",j)+1 );
    	
    	lines.push( result.substr(0, j|| result.length) );
    	width = Math.max( width, ctx.measureText(lines[ lines.length-1 ]).width );
    	text  = text.substr( lines[ lines.length-1 ].length, text.length );
    }
    
    
    // Calculate canvas size, add margin
    ctx.canvas.width  = 14 + width;
    ctx.canvas.height =  8 + ( fontSize + 5 ) * lines.length;
    ctx.font   = fontSize + "px Arial";

    // Render
    ctx.fillStyle = color;
    for ( i=0, j=lines.length; i<j; ++i ) {
    	ctx.fillText( lines[i], 8, 5 + fontSize + (fontSize+5) * i );
    }
}

todo(ctx, "somebody once told me the world is gonna rolllllll me, never gonna give you up, ababababa", 12, "black");