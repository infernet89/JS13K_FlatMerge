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
var level=0;
var drawableObjects=[];
var selectedObject=null;
var hoveredObject=null;
var exitObject;
var cooldown;
var mergeObjectA=null;
var mergeObjectB=null;
var mergeObjectC=null;
var obstacleObjects=[]

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

level=1;//TODO il menu, sullo ZERO.
generateLevel();
activeTask=setInterval(run, 33);

function generateLevel()
{
    drawableObjects=[];
    obstacleObjects=[];
    //next level button
    tmp=new Object();
    tmp.size=20;
    tmp.x=canvasW-140;
    tmp.y=canvasH-40;
    tmp.rotation=rand(0,360);
    tmp.dx=0;
    tmp.dy=0;
    tmp.dr=0.5;
    tmp.type=level+3;//actually, number of edges
    tmp.color="#0F0";
    tmp.isFilled=true;
    drawableObjects.push(tmp); 
    exitObject=tmp;
    if(level==1)
    {
        addObstacle(200,200,200,45,["LOST: unable to find the way.",
                            "                  -Merriam-Webster"]);
        addObstacle(150,300,430,30,["Sometimes, you don't even know what is the way you need to find"]);
        for(i=0;i<3;i++)
            addRandomObject(3);
        for(i=0;i<77;i++)
            addRandomObject(2);
    }
    else if(level==2)
    {
        addObstacle(150,200,340,45,["If you are feeling some confusion, it's perfectly fine.","It's really hard to find our way in life"]);
        for(i=0;i<7;i++)
            addRandomObject(3);
        for(i=0;i<3;i++)
            addRandomObject(2);
    }
    else if(level==3)
    {
        addObstacle(150,200,650,45,["Have you ever tried to hit something that is moving, while you are also moving in a different direction?",
                                    "That's what finding our way in life feels like."]);
        addObstacle(420,500,240,30,["Because we're all work-in-progress."]);
        for(i=0;i<15;i++)
            addRandomObject(3);
        for(i=0;i<5;i++)
            addRandomObject(2);
    }
    else if(level==4)
    {
        addObstacle(150,200,530,65,["One day some things matter, and another day some things doen't matter anymore.",
                                    "You'll never know.",
                                    "You can't predict what will matter someday."]);
        addObstacle(150,400,320,30,["Do you know what REALLY matter in this world?"]);
        addObstacle(550,480,120,30,["CONNECTIONS."]);
        for(i=0;i<31;i++)
            addRandomObject(3);
        for(i=0;i<9;i++)
            addRandomObject(2);
    }
    else if(level==5)
    {
        for(i=0;i<63;i++)
            addRandomObject(3);
        for(i=0;i<7;i++)
            addRandomObject(2);
    }
    else if(level==6)
    {
        for(i=0;i<127;i++)
            addRandomObject(3);
        for(i=0;i<3;i++)
            addRandomObject(2);
    }
    else if(level==7)
    {
        for(i=0;i<255;i++)
            addRandomObject(3);
        for(i=0;i<5;i++)
            addRandomObject(2);
    }
    else if(level==8)
    {
        for(i=0;i<511;i++)
            addRandomObject(3);
        for(i=0;i<9;i++)
            addRandomObject(2);
    }
    else if(level==9)
    {
        //You won.
    }
}
function addObstacle(x,y,w,h,text)
{
    tmp=new Object();
    tmp.x=x;
    tmp.y=y;
    tmp.width=w;
    tmp.height=h;
    tmp.color="#FFF";
    tmp.text=text;
    obstacleObjects.push(tmp);
}
function addRandomObject(type)
{
    unplaceable=true;
    tmp=new Object();
    tmp.size=16;
    do
    {
        tmp.x=rand(tmp.size*2,canvasW-tmp.size);
        tmp.y=rand(tmp.size*2,canvasH-tmp.size);
    }
    while(insideObstacle(tmp));
    tmp.rotation=rand(0,360);
    tmp.dx=rand(-5,5);
    tmp.dy=rand(-5,5);
    tmp.dr=rand(-5,5);
    tmp.type=type;
    tmp.color=colorTypes[tmp.type];
    tmp.isFilled=false;
    tmp.ignoreCollision=false;
    drawableObjects.push(tmp); 
}
//check if there are obstacles in the middle of A and B
function ammissiblePath(a,b)
{
    var res=true;
    if(b==exitObject)
        return true;
    cx=(a.x+b.x)/2;
    cy=(a.y+b.y)/2;
    tmp=new Object();
    tmp.size=a.size;
    tmp.x=a.x;
    tmp.y=a.y;
    tmp.dx=(cx-a.x)/20;
    tmp.dy=(cy-a.y)/20;

    for(i=0;i<40;i++)
    {
        tmp.x+=tmp.dx;
        tmp.y+=tmp.dy;
        if(insideObstacle(tmp))
        {
            res=false;
            break;
        }
    }
    return res;
}
//return true if thing is inside one of the obstacleObjects
function insideObstacle(thing)
{
    var res=false;
    if(thing.x+thing.size>canvasW-180 && thing.y+thing.size>canvasH-80)
        return true;
    obstacleObjects.forEach(function(e)
    {
        if(thing.x+thing.size>e.x && thing.x-thing.size<e.x+e.width && thing.y+thing.size>e.y && thing.y-thing.size<e.y+e.height)
        {
            res=true;
            return true;
        }
    });
    return res;
}
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

    if(level>0)
    {
        ctx.fillStyle="#FFF";
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

            drawOject(e);
            e.x+=e.dx;
            e.y+=e.dy;
            e.rotation+=e.dr;
            //collisions
            if(!e.ignoreCollision)
            {
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
                //obstacles
                obstacleObjects.forEach(function(o)
                {
                    //inside X
                    if(e.x+e.size>o.x && e.x-e.size<o.x+o.width && e.y+e.size+e.dy>o.y && e.y-e.size+e.dy<o.y+o.height)
                        e.dy*=-1;
                    //inside Y
                    if(e.y+e.size>o.y && e.y-e.size<o.y+o.height && e.x+e.size+e.dx>o.x && e.x-e.size+e.dx<o.x+o.width)
                        e.dx*=-1;
                });
            }
        });
        //draw obstacles
        obstacleObjects.forEach(function(e)
        {
            ctx.fillStyle="#FFF";
            ctx.fillRect(e.x,e.y,e.width,2);
            ctx.fillRect(e.x,e.y,2,e.height);
            ctx.fillRect(e.x+e.width-2,e.y,2,e.height);
            ctx.fillRect(e.x,e.y+e.height-2,e.width,2);
            ctx.font = "14px Arial";
            for(i=0;i<e.text.length;i++)
                ctx.fillText(e.text[i],e.x+10,20+e.y+i*15);
        });
        //something is selected
        if(selectedObject!=null && hoveredObject!=null)
        {
            ctx.beginPath();
            //check if we have obstacles in the middle
            if(ammissiblePath(selectedObject,hoveredObject))
                ctx.strokeStyle="#6F6";
            else
                ctx.strokeStyle="#600";  
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

            drawableObjects.splice(drawableObjects.indexOf(mergeObjectA), 1);
            drawableObjects.splice(drawableObjects.indexOf(mergeObjectB), 1);
            drawableObjects.push(mergeObjectC);
            if(mergeObjectB==exitObject)
            {
                level++;
                generateLevel();
            }
            mergeObjectA=null;
            mergeObjectB=null;
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
    //console.log("mouse "+mousex+" "+mousey);        
}
function rilasciatoMouse(evt)
{
    dragging=false;

    if(selectedObject!=null)
    {
        //we need to merge
        if(hoveredObject!=null && ammissiblePath(selectedObject,hoveredObject))
        {
            hoveredObject.isFilled=true;
            mergeObjectA=selectedObject;
            mergeObjectB=hoveredObject;
            
            mergeObjectC=new Object();
            mergeObjectC.dx=mergeObjectA.dx+mergeObjectB.dx;
            mergeObjectC.dx=mergeObjectC.dx%5;
            mergeObjectC.dy=mergeObjectA.dy+mergeObjectB.dy;
            mergeObjectC.dy=mergeObjectC.dy%5;
            mergeObjectC.rotation=0;
            mergeObjectC.dr=mergeObjectA.dr+mergeObjectB.dr;
            mergeObjectC.ignoreCollision=false;
            //change dx and dy in order to put them together, fast
            cx=(mergeObjectA.x+mergeObjectB.x)/2;
            cy=(mergeObjectA.y+mergeObjectB.y)/2;
            mergeObjectA.dx=(cx-mergeObjectA.x)/20;
            mergeObjectA.dy=(cy-mergeObjectA.y)/20;
            if(mergeObjectB==exitObject)
            {
                mergeObjectA.ignoreCollision=true;
            }
            else
            {
                mergeObjectB.dx=(cx-mergeObjectB.x)/20;
                mergeObjectB.dy=(cy-mergeObjectB.y)/20;
            }
        }
        else
            selectedObject.isFilled=false;
    }
    selectedObject=null;
    hoveredObject=null;
}