// < >
var DEBUG=0;
//costant
var TO_RADIANS = Math.PI/180; 

//global variables
var canvas;
var canvasW;
var canvasH;
var ctx;
var activeTask;
var level=1;
var drawableObjects=[];

//mobile controls
var mousex=-100;
var mousey=-100;
var dragging=false;

//setup
canvas = document.getElementById("g");
ctx = canvas.getContext("2d");
canvasW=canvas.width  = window.innerWidth;
canvasH=canvas.height = window.innerHeight;

for(i=0;i<200;i++)
{
    tmp=new Object();
    tmp.size=16;
    tmp.x=rand(tmp.size,canvasW-tmp.size);
    tmp.y=rand(tmp.size*2,canvasH-tmp.size);
    tmp.rotation=rand(0,360);
    tmp.dx=rand(-8,8);
    tmp.dy=rand(-8,8);
    tmp.dr=rand(0,5);
    tmp.type=rand(3,8);//actually, number of edges
    
    drawableObjects.push(tmp); 
}


/*if (window.navigator.pointerEnabled) {
    canvas.addEventListener("pointermove", mossoMouse, false);
    canvas.addEventListener("pointerup", rilasciatoTap, false);
}
else
{
    canvas.addEventListener("touchmove", mossoTap);
    canvas.addEventListener("touchstart", cliccatoTap);
    canvas.addEventListener("touchend", rilasciatoTap);
}
canvas.addEventListener("mousemove",mossoMouse);
canvas.addEventListener("mousedown",cliccatoMouse);
canvas.addEventListener("mouseup",rilasciatoMouse);*/

activeTask=setInterval(run, 33);

function run()
{
	ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle="#000";
    ctx.fillRect(0,0,canvasW,canvasH);

    ctx.fillStyle="#FFF";
    ctx.fillRect(0,0,canvasW,1);
    ctx.fillRect(0,canvasH-1,canvasW,1);
    ctx.fillRect(0,0,1,canvasH);
    ctx.fillRect(canvasW-1,0,1,canvasH);

    if(level==1)
    {
        drawableObjects.forEach(function(e)
        {
            drawOject(e);
            e.x+=e.dx;
            e.y+=e.dy;
            e.rotation+=e.dr;
            if(e.x+e.dx+e.size>canvasW || e.x+e.dx<e.size)
                e.dx*=-1;
            if(e.y+e.dy>canvasH || e.y+e.dy<e.size*2)
                e.dy*=-1;
        });
    }
}
function drawOject(o)
{
    var s=o.size;
    ctx.strokeStyle="#FFF";
    ctx.save();
    ctx.translate(o.x-s,o.y-s);
    ctx.rotate(o.rotation*Math.PI/180);
    ctx.beginPath();
    if(o.type==3)
    {//triangle
        ctx.moveTo(0,-s);
        ctx.lineTo(-s,s);
        ctx.lineTo(s,s);
        ctx.lineTo(0,-s);
    }
    else if(o.type==4)
    {//square
        ctx.moveTo(-s,-s);
        ctx.lineTo(s,-s);
        ctx.lineTo(s,s);
        ctx.lineTo(-s,s);
        ctx.lineTo(-s,-s);
    }
    else if(o.type==5)
    {//pentagon
        ctx.moveTo(0,-s);
        ctx.lineTo(s,-s/5);

        ctx.lineTo(s/2,s);
        ctx.lineTo(-s/2,s);

        ctx.lineTo(-s,-s/5);
        ctx.lineTo(0,-s);
    }
    else if(o.type==6)
    {//hexagon
        ctx.moveTo(-s,0);
        ctx.lineTo(-s/2,-s);
        ctx.lineTo(s/2,-s);
        ctx.lineTo(s,0);
        ctx.lineTo(s/2,s);
        ctx.lineTo(-s/2,s);

        ctx.lineTo(-s,0);
    }
    else if(o.type==7)
    {//heptagon
        ctx.moveTo(0,-s);
        ctx.lineTo(s-s/5,-s/2);
        ctx.lineTo(s,s/2);
        ctx.lineTo(s/2,s);
        ctx.lineTo(-s/2,s);
        ctx.lineTo(-s,s/2);
        ctx.lineTo(-s+s/5,-s/2);
        ctx.lineTo(0,-s);
    }
    else if(o.type==8)
    {//octagon
        ctx.moveTo(-s/2,-s);
        ctx.lineTo(s/2,-s);
        ctx.lineTo(s,-s/2);
        ctx.lineTo(s,s/2);
        ctx.lineTo(s/2,s);
        ctx.lineTo(-s/2,s);
        ctx.lineTo(-s,s/2);
        ctx.lineTo(-s,-s/2);
        ctx.lineTo(-s/2,-s);
    }
    ctx.stroke();
    ctx.restore();
}
/*#############
    Funzioni Utili
##############*/
function rand(da, a)
{
    if(da>a) return rand(a,da);
    a=a+1;
    return Math.floor(Math.random()*(a-da)+da);
}

//controlli mobile
function mossoTap(evt)
{
    evt.preventDefault();
    dragging=true;
    var rect = canvas.getBoundingClientRect();
    mousex = evt.targetTouches[0].pageX,
    mousey = evt.targetTouches[0].pageY;
}
function cliccatoTap(evt)
{
    evt.preventDefault();
    var rect = canvas.getBoundingClientRect();
    mousex = evt.targetTouches[0].pageX,
    mousey = evt.targetTouches[0].pageY;
}
function rilasciatoTap(evt)
{
    evt.preventDefault();
    dragging=false;
    mousey=-100;
    mousex=-100;
}
//uindows
function cliccatoMouse(evt)
{
    dragging=true;
    var rect = canvas.getBoundingClientRect();
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasH;
}
function mossoMouse(evt)
{
    var rect = canvas.getBoundingClientRect();
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasH;
}
function rilasciatoMouse(evt)
{
    dragging=false;
}