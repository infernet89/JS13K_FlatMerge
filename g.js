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
var selectedObject=null;
var hoveredObject=null;
var exitObject;
var cooldown;
var mergeObjectA=null;
var mergeObjectB=null;
var mergeObjectC=null;


//mobile controls
var mousex=-100;
var mousey=-100;
var dragging=false;

//setup
canvas = document.getElementById("g");
ctx = canvas.getContext("2d");
canvasW=canvas.width  = window.innerWidth;
canvasH=canvas.height = window.innerHeight;
var colorTypes=['','','#F0F','#50F','#32E','#14C','#06A','#088','#0A6','#0C4','#0E2','#0F0'];


//next level button
tmp=new Object();
tmp.size=20;
tmp.x=canvasW-140;
tmp.y=canvasH-40;
tmp.rotation=rand(0,360);
tmp.dx=0;
tmp.dy=0;
tmp.dr=0.5;
tmp.type=11;//actually, number of edges
tmp.color="#0F0";
tmp.isFilled=true;
drawableObjects.push(tmp); 
exitObject=tmp;

//create random objects
for(i=0;i<80;i++)
{
    tmp=new Object();
    tmp.size=16;
    tmp.x=rand(tmp.size*2,canvasW-tmp.size-100);
    tmp.y=rand(tmp.size*2,canvasH-tmp.size-200);
    tmp.rotation=rand(0,360);
    tmp.dx=rand(-5,5);
    tmp.dy=rand(-5,5);
    tmp.dr=rand(-5,5);
    tmp.type=rand(2,10);//actually, number of edges
    tmp.color="#FFF";
    tmp.color=colorTypes[tmp.type];
    tmp.isFilled=false;
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
}*/
canvas.addEventListener("mousemove",mossoMouse);
canvas.addEventListener("mousedown",cliccatoMouse);
canvas.addEventListener("mouseup",rilasciatoMouse);

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
        ctx.fillRect(canvasW-180,canvasH-80,250,2);
        ctx.fillRect(canvasW-180,canvasH-80,2,80);
        ctx.font = "20px Arial";
        ctx.fillText("NEXT",canvasW-90,canvasH-50);
        ctx.fillText("LEVEL",canvasW-90,canvasH-20);

        noneSelected=true;
        hover=false;
        //draw and move all objects
        drawableObjects.forEach(function(e)
        {

            /*ctx.fillStyle="#F00";
            ctx.fillRect(e.x-e.size,e.y-e.size,e.size*2,e.size*2);*/


            //check if need to be selected
            /*if(mergeObject!=null || !noneSelected || hover)
            {
                //we are merging two object, disable controls.
                if(mergeObject!=null && selectedObject==e && (selectedObject.x - mergeObject.x)*(selectedObject.x - mergeObject.x)<selectedObject.size && (selectedObject.y - mergeObject.y)*(selectedObject.y - mergeObject.y)<selectedObject.size)
                {
                    selectedObject.type++;
                    selectedObject.dx=mergedObjectContainer.dx;
                    selectedObject.dy=mergedObjectContainer.dy;
                    drawableObjects.splice(drawableObjects.indexOf(mergeObject), 1);
                    mergeObject=null;
                    selectedObject.isFilled=false;
                    selectedObject=null;
                }
                else if(mergeObject==e)
                {
                    ctx.beginPath();
                    ctx.strokeStyle="#00F";//not blue, for a weird bug
                    ctx.moveTo(e.x,e.y);
                    ctx.lineTo(selectedObject.x,selectedObject.y);
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    ctx.closePath();
                }
            }
            else if(dragging && e.type!=2)
            {
                if(mousex+10>e.x-e.size && mousex<e.x+e.size && mousey+10>e.y-e.size && mousey<e.y+e.size)
                {
                    noneSelected=false;
                    hover=true;
                    cooldown=10;
                    e.isFilled=true;
                    if(selectedObject!=null && selectedObject!=e && selectedObject!=exitObject)
                    {
                        //we need to merge!
                        if(selectedObject.type==e.type)
                        {
                            mergedObjectContainer=new Object();
                            mergedObjectContainer.dx=selectedObject.dx+e.dx;
                            mergedObjectContainer.dy=selectedObject.dy+e.dy;
                            //change dx and dy in order to put them together, fast
                            cx=(selectedObject.x+e.x)/2;
                            cy=(selectedObject.y+e.y)/2;
                            selectedObject.dx=(cx-selectedObject.x)/20;
                            selectedObject.dy=(cy-selectedObject.y)/20;
                            e.dx=(cx-e.x)/20;
                            e.dy=(cy-e.y)/20;

                            mergeObject=selectedObject;
                        }
                        else
                            selectedObject.isFilled=false;
                    }                        
                    selectedObject=e;
                }
            }
            else if(selectedObject!=null && selectedObject!=e && selectedObject.type==e.type && mousex+10>e.x-e.size && mousex<e.x+e.size && mousey+10>e.y-e.size && mousey<e.y+e.size)
            {
                hover=true;
                //linea tra il selected object e quello hovered
                ctx.beginPath();
                ctx.strokeStyle="#FFF";
                ctx.moveTo(e.x,e.y);
                ctx.lineTo(selectedObject.x,selectedObject.y);
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.closePath();
            }*/

            drawOject(e);
            e.x+=e.dx;
            e.y+=e.dy;
            e.rotation+=e.dr;
            //edges of screen
            if(e.x+e.dx>canvasW-e.size || e.x+e.dx<e.size)
                e.dx*=-1;
            if(e.y+e.dy>canvasH-e.size || e.y+e.dy<e.size)
                e.dy*=-1;
            //next button
            if(e.x+e.size>canvasW-180 && e.y+e.dy+e.size>canvasH-80)
                e.dy*=-1;
            if(e.x+e.dx+e.size>canvasW-180 && e.y+e.size>canvasH-80)
                e.dx*=-1;
        });
        //something is selected
        if(selectedObject!=null && hoveredObject!=null)
        {
            ctx.beginPath();
            ctx.strokeStyle="#FFF";
            ctx.moveTo(hoveredObject.x,hoveredObject.y);
            ctx.lineTo(selectedObject.x,selectedObject.y);
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();
        }
        else if(selectedObject!=null)
        {
            ctx.beginPath();
            ctx.strokeStyle="#FFF";
            ctx.moveTo(mousex,mousey);
            ctx.lineTo(selectedObject.x,selectedObject.y);
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();
        }
        //two object need to merge
        if(mergeObjectA!=null && mergeObjectB!=null && (mergeObjectA.x - mergeObjectB.x)*(mergeObjectA.x - mergeObjectB.x)<mergeObjectA.size && (mergeObjectA.y - mergeObjectB.y)*(mergeObjectA.y - mergeObjectB.y)<mergeObjectA.size)
        {
            mergeObjectC.type=mergeObjectA.type+1;
            mergeObjectC.x=mergeObjectA.x;
            mergeObjectC.y=mergeObjectA.y;
            mergeObjectC.color=colorTypes[mergeObjectC.type];
            mergeObjectC.size=(mergeObjectA.size+mergeObjectB.size)/2;
            mergeObjectC.rotation=mergeObjectA.rotation+mergeObjectB.rotation;

            drawableObjects.splice(drawableObjects.indexOf(mergeObjectA), 1);
            drawableObjects.splice(drawableObjects.indexOf(mergeObjectB), 1);
            drawableObjects.push(mergeObjectC);
            mergeObjectA=null;
            mergeObjectB=null;
            console.log("Merged");
        }
    }
}
function getObjectInsideMouse()
{
    for(i=0;i<drawableObjects.length;i++)
        if(mousex+10>drawableObjects[i].x-drawableObjects[i].size && mousex<drawableObjects[i].x+drawableObjects[i].size && mousey+10>drawableObjects[i].y-drawableObjects[i].size && mousey<drawableObjects[i].y+drawableObjects[i].size)
            return drawableObjects[i];
    return null;
}

function drawOject(o)
{//http://www.mathopenref.com/coordpolycalc.html
    var s=o.size;
    ctx.save();
    ctx.translate(o.x,o.y);
    ctx.rotate(o.rotation*Math.PI/180);
    ctx.beginPath();
    if(o.type==2)
    {//asterisk
        ctx.moveTo(0,-s/2);
        ctx.lineTo(0,s/2);
        ctx.moveTo(-s/2,0);
        ctx.lineTo(s/2,0);
        ctx.moveTo(-s/2,-s/2);
        ctx.lineTo(s/2,s/2);
        ctx.moveTo(-s/2,s/2);
        ctx.lineTo(s/2,-s/2);
    }
    else if(o.type==3)
    {//triangle
        ctx.moveTo(0,-s);//0,-100
        ctx.lineTo(s*-0.87,s*0.5);//-87,50
        ctx.lineTo(s*0.87,s*0.5);//87,50
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
        ctx.moveTo(0,-s);//0,-100
        ctx.lineTo(s*-0.95,s*-0.31);//-95,-31
        ctx.lineTo(s*-0.59,s*0.81);//-59,81
        ctx.lineTo(s*0.59,s*0.81);//59,81
        ctx.lineTo(s*0.95,s*-0.31);//95,-31
        ctx.lineTo(0,-s);
    }
    else if(o.type==6)
    {//hexagon
        ctx.moveTo(s*0.5,s*-0.87);//50,-87
        ctx.lineTo(s*-0.5,s*-0.87);//-50,-87
        ctx.lineTo(-s,0);//-100,0
        ctx.lineTo(s*-0.5,s*0.87);//-50,87
        ctx.lineTo(s*0.5,s*0.87);//50,87
        ctx.lineTo(s,0);//100,0
        ctx.lineTo(s*0.5,s*-0.87);
    }
    else if(o.type==7)
    {//heptagon
        ctx.moveTo(0,-s);//0,-100
        ctx.lineTo(s*-0.78,s*-0.62);//-78,-62
        ctx.lineTo(s*-0.97,s*0.22);//-97,22
        ctx.lineTo(s*-0.43,s*0.9);//-43,90
        ctx.lineTo(s*0.43,s*0.9);//43,90
        ctx.lineTo(s*0.97,s*0.22);//97,22
        ctx.lineTo(s*0.78,s*-0.62);//78,-62
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
    else if(o.type==9)
    {//nonagon
        ctx.moveTo(0,-s);//0   -100
        ctx.lineTo(s*-0.64,s*-0.77);//-64 -77
        ctx.lineTo(s*-0.98,s*-0.17);//-98 -17
        ctx.lineTo(s*-0.87,s/2);//-87 50
        ctx.lineTo(s*-0.34,s*0.94);//-34 94
        ctx.lineTo(s*0.34,s*0.94);//34  94
        ctx.lineTo(s*0.87,s/2);//87  50
        ctx.lineTo(s*0.98,s*-0.17);//98  -17
        ctx.lineTo(s*0.64,s*-0.77);//64  -77
        ctx.lineTo(0,-s);
    }
    else if(o.type==10)
    {//decagon
        ctx.moveTo(s*0.31,s*-0.95);//    
        ctx.lineTo(s*-0.31,s*-0.95);// 
        ctx.lineTo(s*-0.81,s*-0.59);// 
        ctx.lineTo(-s,0);//  
        ctx.lineTo(s*-0.81,s*0.59);//
        ctx.lineTo(s*-0.31,s*0.95);//
        ctx.lineTo(s*0.31,s*0.95);// 
        ctx.lineTo(s*0.81,s*0.59);// 
        ctx.lineTo(s,0);
        ctx.lineTo(s*0.81,s*-0.59);//  
        ctx.lineTo(s*0.31,s*-0.95);//  
    }
    else if(o.type==11)
    {//circle
        ctx.arc(0,0,s,0,Math.PI*2,false);
    }
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle=o.color;
    ctx.fillStyle=o.color;
    if(o.isFilled)
        ctx.fill();
    else
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

    //check if something is selected
    if(selectedObject!=null)
        selectedObject.isFilled=false;
    selectedObject=getObjectInsideMouse();
    //something cannot be selected
    if(selectedObject!=null && (selectedObject.type<=2 || selectedObject==exitObject))
        selectedObject=null;

    if(selectedObject!=null)
        selectedObject.isFilled=true;
}
function mossoMouse(evt)
{
    var rect = canvas.getBoundingClientRect();
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasH;

    if(selectedObject!=null)
    {
        hoveredObject=getObjectInsideMouse();
        if(hoveredObject!=null && hoveredObject.type!=selectedObject.type)
            hoveredObject=null;
    }        
}
function rilasciatoMouse(evt)
{
    dragging=false;

    if(selectedObject!=null)
    {
        //we need to merge
        if(hoveredObject!=null)
        {
            hoveredObject.isFilled=true;
            mergeObjectA=selectedObject;
            mergeObjectB=hoveredObject;
            
            mergeObjectC=new Object();
            mergeObjectC.dx=mergeObjectA.dx+mergeObjectB.dx;
            mergeObjectC.dy=mergeObjectA.dy+mergeObjectB.dy;
            //change dx and dy in order to put them together, fast
            cx=(mergeObjectA.x+mergeObjectB.x)/2;
            cy=(mergeObjectA.y+mergeObjectB.y)/2;
            mergeObjectA.dx=(cx-mergeObjectA.x)/20;
            mergeObjectA.dy=(cy-selectedObject.y)/20;
            mergeObjectB.dx=(cx-mergeObjectB.x)/20;
            mergeObjectB.dy=(cy-mergeObjectB.y)/20;
        }
        else
            selectedObject.isFilled=false;
    }
    selectedObject=null;
    hoveredObject=null;
}