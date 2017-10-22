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
var ocdMode=false;

//mobile controls
var mousex=-100;
var mousey=-100;
var dragging=false;

//sounds
var isSoundEnabled=true;
var bgmusic = new Audio("Sound/20170917.mp3");
bgmusic.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
bgmusic.addEventListener('timeupdate', function(){
            var buffer = .44
            if(this.currentTime > this.duration - buffer){
                this.currentTime = 0
                this.play()
            }}, false);
var snd1 = new Audio("Sound/4.wav");
var snd4 = new Audio("Sound/4.wav");
var snd8 = new Audio("Sound/4.wav");
bgmusic.play();

//setup
canvas = document.getElementById("g");
ctx = canvas.getContext("2d");
canvasW=canvas.width  = window.innerWidth;
canvasH=canvas.height = window.innerHeight;
canvasW=(canvasH/800)*1200;
/*canvasW=1200;
canvasH=800;*/
var colorTypes=['','','#DDD','#c1ba00','#D00','#50D','#050','#0DD','#D50','#D55','#5D5','#0F0'];


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
window.addEventListener('keyup',keyUp,false);

level=0;
generateLevel();
activeTask=setInterval(run, 33);

function generateLevel()
{
    drawableObjects=[];
    obstacleObjects=[];
    selectedObject=null;
    hoveredObject=null;
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
    tmp.color=colorTypes[level+3];
    tmp.isFilled=true;
    tmp.alpha=1;
    drawableObjects.push(tmp); 
    exitObject=tmp;
    if(level==0)
    {
         addObstacle(canvasW/2-400,110,800,150,[""]);
         addObstacle(50,450,280,60,["","Don't worry, you will learn through the way."]);
         addObstacle(canvasW/2-50,canvasH-200,100,100,[""]);
         exitObject.size=45;
         exitObject.x=canvasW/2;
         exitObject.y=canvasH-150;
         addRandomObject(3);
         for(i=0;i<3;i++)
         {
             addRandomObject(2);
             addRandomObject(4);
             addRandomObject(5);
             addRandomObject(6);
             addRandomObject(7);
             addRandomObject(8);
             addRandomObject(9);
             addRandomObject(10);
             addRandomObject(11);
         }
    }
    else if(level==1)
    {
        addObstacle(200,200,200,45,["LOST: unable to find the way.",
                            "                  -Merriam-Webster"]);
        addObstacle(150,300,435,30,["Sometimes, you don't even know WHAT is the way you need to find"]);
        if(ocdMode)
        {
            for(i=0;i<2;i++)
                addRandomObject(3);
        }
        else
        {
            for(i=0;i<3;i++)
                addRandomObject(3);
            for(i=0;i<77;i++)
                addRandomObject(2);
        }
        
    }
    else if(level==2)
    {
        addObstacle(150,200,340,45,["If you are feeling some confusion, it's perfectly fine.","It's really hard to find our way in life"]);
        if(ocdMode)
        {
            addRandomObject(4);
            for(i=0;i<2;i++)
                addRandomObject(3);
        }
        else
        {
            addRandomObject(4);
            for(i=0;i<5;i++)
                addRandomObject(3);
            for(i=0;i<15;i++)
                addRandomObject(2);
        }
    }
    else if(level==3)
    {
        addObstacle(150,200,650,45,["Have you ever tried to hit something that is moving, while you are also moving in a different direction?",
                                    "That's what finding our way in life feels like."]);
        addObstacle(420,500,240,30,["Because we're all work-in-progress."]);
        if(ocdMode)
        {
            addRandomObject(5);
            for(i=0;i<4;i++)
                addRandomObject(3);
        }
        else
        {
            addRandomObject(5);
            for(i=0;i<11;i++)
                addRandomObject(3);
            for(i=0;i<9;i++)
                addRandomObject(2);
        }
    }
    else if(level==4)
    {
        addObstacle(150,200,530,65,["One day some things matter, and another day those things doesn't matter anymore.",
                                    "You'll never know.",
                                    "You can't predict what will matter someday."]);
        addObstacle(150,400,320,30,["Do you know what REALLY matter in this world?"]);
        addObstacle(550,480,120,30,["CONNECTIONS"]);
        if(ocdMode)
        {
            for(i=0;i<3;i++)
                addRandomObject(5);
            for(i=0;i<4;i++)
                addRandomObject(3);
        }
        else
        {
            for(i=0;i<3;i++)
                addRandomObject(5);
            for(i=0;i<19;i++)
                addRandomObject(3);
            for(i=0;i<9;i++)
                addRandomObject(2);
        }
    }
    else if(level==5)
    {
        addObstacle(150,200,290,30,["You will not be able to connect to everyone."]);
        addObstacle(150,300,345,30,["You need to find someone that is kinda similar to you."]);
        addObstacle(150,400,250,30,["The people you know will change you."]);
        addObstacle(150,500,500,30,["And, surprisingly, you will find connections in people you wasn't able to relate."]);
        addObstacle(440,600,210,65,["Wait.","","You had already figured it out?"]);
        if(ocdMode)
        {
            for(i=0;i<2;i++)
                addRandomObject(6);
            for(i=0;i<16;i++)
                addRandomObject(3);
        }
        else
        {
            for(i=0;i<2;i++)
                addRandomObject(6);
            for(i=0;i<33;i++)
                addRandomObject(3);
            for(i=0;i<7;i++)
                addRandomObject(2);
        }
        
    }
    else if(level==6)
    {
        addObstacle(150,200,390,280,["The research for your way in life is endless.",
                                    "It's something biologically attached to our DNA,",
                                    "something that helped the mankind to evolve until this point.",
                                    "",
                                    "Every great discovery was done because someone",
                                    "missed something. Wanted to get more from his life.",
                                    "",
                                    "Do you really think that internet was made for cats?",
                                    "It was made to gain access to all existing",
                                    "information, in a single second.",
                                    "So, you can browse searching for a purpose.",
                                    "",
                                    "We constantly need something more.",
                                    "We are never satisfied.",
                                    "So we will always search new stimuli.",
                                    "",
                                    "And this research will never end."]);
        addObstacle(580,520,125,35,["Unlike this game."]);
        if(ocdMode)
        {
            addRandomObject(7);
            for(i=0;i<2;i++)
                addRandomObject(6);
            for(i=0;i<3;i++)
                addRandomObject(5);
            for(i=0;i<7;i++)
                addRandomObject(4);
            for(i=0;i<6;i++)
                addRandomObject(3);
        }
        else
        {
            addRandomObject(7);
            addRandomObject(6);
            addRandomObject(6);
            addRandomObject(5);
            addRandomObject(5);
            addRandomObject(5);
            addRandomObject(4);
            addRandomObject(4);
            addRandomObject(4);
            addRandomObject(4);
            addRandomObject(4);
            addRandomObject(4);
            addRandomObject(4);
            for(i=0;i<87;i++)
                addRandomObject(3);
            for(i=0;i<3;i++)
                addRandomObject(2);
        }            
    }
    else if(level==7)
    {
        addObstacle(150,100,135,50,["This game will end","But so is your life."]);
        addObstacle(250,200,200,50,["The end will be disappointing","Like your life."]);
        addObstacle(30,300,160,50,["Filled with negativity.","Like your life."]);
        addObstacle(250,400,170,50,["You will want to give up","Like in your life"]);
        addObstacle(50,550,380,50,["Everyhing you have done to reach this point will be useless","Like.. well, you get it."]);
        addObstacle(380,620,50,35,["But.."]);
        if(ocdMode)
        {
            for(i=0;i<128;i++)
                addRandomObject(3);
        }
        else
        {
            for(i=0;i<255;i++)
                addRandomObject(3);
            for(i=0;i<5;i++)
                addRandomObject(2);    
        }
    }
    else if(level==8)
    {
        addObstacle(150,100,270,100,["Life is not about finding the way.",
                                    "It's not about reaching your destination.",
                                    "",
                                    "It's all about the journey.",
                                    "And about what you will learn during it."]);
        addObstacle(10,300,270,35,["And I think you learned something here.."]);
        if(ocdMode)
        {
            addRandomObject(10);
            addRandomObject(9);
            addRandomObject(8);
            addRandomObject(7);
            addRandomObject(6);
            addRandomObject(5);
            addRandomObject(4);
            for(i=0;i<2;i++)
                addRandomObject(3);
        }
        else
        {
            addRandomObject(10);
            addRandomObject(9);
            addRandomObject(9);
            addRandomObject(8);
            addRandomObject(8);
            addRandomObject(8);
            addRandomObject(7);
            addRandomObject(7);
            addRandomObject(7);
            addRandomObject(6);
            addRandomObject(6);
            addRandomObject(6);
            addRandomObject(6);
            addRandomObject(5);
            addRandomObject(5);
            addRandomObject(5);
            addRandomObject(5);
            addRandomObject(5);
            addRandomObject(4);
            addRandomObject(4);
            addRandomObject(4);
            addRandomObject(4);
            addRandomObject(4);
            addRandomObject(4);
            for(i=0;i<131;i++)
                addRandomObject(3);
            for(i=0;i<9;i++)
                addRandomObject(2);
        }
    }
    else if(level==9)
    {
        if(ocdMode)
        {
            addObstacle(canvasW/2-150,canvasH/2-150,300,300,[""]);
            kongregate.stats.submit("OCDgameCompleted",1);
        }   
        else
        {
            kongregate.stats.submit("gameCompleted",1);
            addObstacle(canvasW/2-150,canvasH/2-150,300,300,["","","","","","","","","                 Perfection is useless","","                     keep your edges"]);
        }
        tmp=new Object();
        tmp.alpha=0;
        tmp.size=120;
        tmp.rotation=0;
        tmp.dx=0;
        tmp.dy=0;
        tmp.dr=0;
        tmp.x=canvasW/2;
        tmp.y=canvasH/2;
        tmp.type=11;
        tmp.color="#00F";
        tmp.isFilled=false;
        tmp.ignoreCollision=true;
        drawableObjects.push(tmp);
        tmp=new Object();
        tmp.alpha=-1;
        tmp.size=170;
        tmp.rotation=0;
        tmp.dx=0;
        tmp.dy=0;
        tmp.dr=1;
        tmp.x=canvasW/2;
        tmp.y=canvasH/2;
        tmp.type=10;
        tmp.color="#0F0";
        tmp.isFilled=false;
        tmp.ignoreCollision=true;
        drawableObjects.push(tmp);
        tmp=new Object();
        tmp.alpha=-2;
        tmp.size=190;
        tmp.rotation=0;
        tmp.dx=0;
        tmp.dy=0;
        tmp.dr=-1;
        tmp.x=canvasW/2;
        tmp.y=canvasH/2;
        tmp.type=9;
        tmp.color="#F00";
        tmp.isFilled=false;
        tmp.ignoreCollision=true;
        drawableObjects.push(tmp);
        tmp=new Object();
        tmp.alpha=-3;
        tmp.size=210;
        tmp.rotation=0;
        tmp.dx=0;
        tmp.dy=0;
        tmp.dr=1;
        tmp.x=canvasW/2;
        tmp.y=canvasH/2;
        tmp.type=8;
        tmp.color="#F0F";
        tmp.isFilled=false;
        tmp.ignoreCollision=true;
        drawableObjects.push(tmp);
        tmp=new Object();
        tmp.alpha=-4;
        tmp.size=230;
        tmp.rotation=0;
        tmp.dx=0;
        tmp.dy=0;
        tmp.dr=-1;
        tmp.x=canvasW/2;
        tmp.y=canvasH/2;
        tmp.type=7;
        tmp.color="#FF0";
        tmp.isFilled=false;
        tmp.ignoreCollision=true;
        drawableObjects.push(tmp);
        tmp=new Object();
        tmp.alpha=-5;
        tmp.size=250;
        tmp.rotation=0;
        tmp.dx=0;
        tmp.dy=0;
        tmp.dr=1;
        tmp.x=canvasW/2;
        tmp.y=canvasH/2;
        tmp.type=6;
        tmp.color="#0FF";
        tmp.isFilled=false;
        tmp.ignoreCollision=true;
        drawableObjects.push(tmp);

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
    tmp.alpha=0;
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
    tmp.dx=rand(-4,4);
    tmp.dy=rand(-4,4);
    tmp.dr=rand(-4,4);
    tmp.type=type;
    tmp.color=colorTypes[tmp.type];
    tmp.isFilled=false;
    tmp.ignoreCollision=false;
    tmp.alpha=-0.1*type;
    drawableObjects.push(tmp); 
}
//check if there are obstacles in the middle of A and B
function ammissiblePath(a,b)
{
    var res=true;
    if(b==exitObject || ocdMode)
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

    if(level<9 && level!=0)
    {
        ctx.fillStyle="#FFF";
        ctx.fillRect(canvasW-180,canvasH-80,250,2);
        ctx.fillRect(canvasW-180,canvasH-80,2,80);
        ctx.font = "20px Arial";
        ctx.fillText("NEXT",canvasW-90,canvasH-50);
        ctx.fillText("LEVEL",canvasW-90,canvasH-20);
    }

    noneSelected=true;
    hover=false;
    //draw and move all objects
    drawableObjects.forEach(function(e)
    {
        if(e.alpha<1) e.alpha+=0.05;
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
            if(level==6660)
            {
                drawableObjects.forEach(function(o)
                {
                    //inside X
                    if(o!=e && e.x+e.size>o.x && e.x-e.size<o.x+o.size && e.y+e.size+e.dy>o.y && e.y-e.size+e.dy<o.y+o.size)
                        e.dy*=-1;
                    //inside Y
                    if(o!=e && e.y+e.size>o.y && e.y-e.size<o.y+o.size && e.x+e.size+e.dx>o.x && e.x-e.size+e.dx<o.x+o.size)
                        e.dx*=-1;
                });
            }
        }
    });
    //draw obstacles
    obstacleObjects.forEach(function(e)
    {
        if(e.alpha<1) e.alpha+=0.05;
        ctx.globalAlpha=e.alpha;
        ctx.fillStyle="#FFF";
        ctx.fillRect(e.x,e.y,e.width,2);
        ctx.fillRect(e.x,e.y,2,e.height);
        ctx.fillRect(e.x+e.width-2,e.y,2,e.height);
        ctx.fillRect(e.x,e.y+e.height-2,e.width,2);
        ctx.font = "14px Arial";
        for(i=0;i<e.text.length;i++)
            ctx.fillText(e.text[i],e.x+10,20+e.y+i*15);
        ctx.globalAlpha=1;
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
    else if(selectedObject!=null && level!=0)
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
    if(mergeObjectA!=null && mergeObjectB!=null && (mergeObjectA.x - mergeObjectB.x)*(mergeObjectA.x - mergeObjectB.x)<1 && (mergeObjectA.y - mergeObjectB.y)*(mergeObjectA.y - mergeObjectB.y)<1)
    {
        mergeObjectC.type=mergeObjectA.type+1;
        mergeObjectC.x=mergeObjectA.x;
        mergeObjectC.y=mergeObjectA.y;
        mergeObjectC.color=colorTypes[mergeObjectC.type];
        mergeObjectC.size=(mergeObjectA.size+mergeObjectB.size)/2;            

        drawableObjects.splice(drawableObjects.indexOf(mergeObjectA), 1);
        drawableObjects.splice(drawableObjects.indexOf(mergeObjectB), 1);
        drawableObjects.push(mergeObjectC);
        //sound effect
        if(!isSoundEnabled)
            level=level;
        else if(mergeObjectC.type>9)
            snd8.play();
        else if(mergeObjectC.type>6)
            snd4.play();
        else if(mergeObjectC.type>3)
            snd1.play();

        if(mergeObjectB==exitObject)
        {
            level++;
            generateLevel();
        }
        mergeObjectA=null;
        mergeObjectB=null;
    }

    //menu
    if(level==0)
    {
        ctx.fillStyle="#FFF";
        ctx.font = "50px Arial";
        ctx.fillText("Have you missed the",canvasW/2-390,160);
        ctx.font = "80px Arial";
        ctx.fillText("TUTORIAL for LIFE?",canvasW/2-350,240);
        ctx.fillStyle="#000";
        ctx.font = "20px Arial";
        ctx.fillText("PLAY",canvasW/2-25,canvasH-145);
        selectedObject=drawableObjects[1];
        ctx.fillStyle="#FFF";
        ctx.font = "12px Arial";
        ctx.fillText("By Infernet89",canvasW-75,canvasH-5);
        ctx.fillText("Made for JS13k Competition",5,canvasH-5);
        ctx.fillText("Music by ABSolid",5+canvasW/2,canvasH-5);

        //check OCD mode
        nFilledObjects=0;
        drawableObjects.forEach(function(e)
        {
            if(e.isFilled)
                nFilledObjects++;
        });
        if(nFilledObjects>=25)
        {
            ctx.fillText("OCD mode",canvasW/2-30,canvasH-130);
            ocdMode=true;
        }
    }
    if(level==9 && !ocdMode)
    {
        ctx.font = "9px Arial";
        ctx.fillText("psst.. fill all shapes on the menu to unlock relaxing mode",canvasW-230,canvasH-5);
    }
}
function getObjectInsideMouse()
{
    for(i=0;i<drawableObjects.length;i++)
        if(mousex+20>drawableObjects[i].x-drawableObjects[i].size && mousex<drawableObjects[i].x+drawableObjects[i].size && mousey+20>drawableObjects[i].y-drawableObjects[i].size && mousey<drawableObjects[i].y+drawableObjects[i].size)
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
    ctx.globalAlpha = (o.alpha>0) ? o.alpha : 0;
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
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*window.innerWidth;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*window.innerHeight;
//< >
    if(level==0 && mousey>canvasH-15 && mousex>5+canvasW/2 && mousex<100+canvasW/2)
    {
        //console.log("THIS");
        window.open("https://soundcloud.com/absolid",'_newtab');
    }
    //else console.log(mousex);

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
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*window.innerWidth;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*window.innerHeight;

    if(selectedObject!=null)
    {
        hoveredObject=getObjectInsideMouse();
        if(hoveredObject!=null && hoveredObject.type!=selectedObject.type)
            hoveredObject=null;
        if(level==0 && hoveredObject!=exitObject)
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
        if(hoveredObject!=null && hoveredObject!=selectedObject && ammissiblePath(selectedObject,hoveredObject) && mergeObjectA==null && mergeObjectB==null)
        {
            hoveredObject.isFilled=true;
            mergeObjectA=selectedObject;
            mergeObjectB=hoveredObject;
            
            mergeObjectC=new Object();
            mergeObjectC.dx=mergeObjectA.dx+mergeObjectB.dx;
            mergeObjectC.dx=mergeObjectC.dx%4;
            mergeObjectC.dy=mergeObjectA.dy+mergeObjectB.dy;
            mergeObjectC.dy=mergeObjectC.dy%4;
            //todo match rotation
            mergeObjectA.rotation=mergeObjectA.rotation%360;
            mergeObjectB.rotation=mergeObjectB.rotation%360;
            mergeObjectC.rotation=(mergeObjectA.rotation+mergeObjectB.rotation)/2;
            mergeObjectC.dr=(mergeObjectA.dr+mergeObjectB.dr)/2;
            mergeObjectA.dr=(mergeObjectA.rotation-mergeObjectC.rotation)/20;
            mergeObjectB.dr=(mergeObjectB.rotation-mergeObjectC.rotation)/20;


            mergeObjectC.alpha=0.5;
            mergeObjectC.dr=mergeObjectC.dr%4;
            mergeObjectC.ignoreCollision=false;
            //change dx and dy in order to put them together, fast
            cx=(mergeObjectA.x+mergeObjectB.x)/2;
            cy=(mergeObjectA.y+mergeObjectB.y)/2;
            mergeObjectA.dx=(cx-mergeObjectA.x)/20;
            mergeObjectA.dy=(cy-mergeObjectA.y)/20;
            mergeObjectA.ignoreCollision=true;
            mergeObjectB.ignoreCollision=true;
            if(mergeObjectB!=exitObject)
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
function keyUp(e) {
    //alert(e.keyCode);
    if(e.keyCode==77 || e.keyCode==83)//m OR s
    {
        isSoundEnabled=!isSoundEnabled;
        if(isSoundEnabled) bgmusic.play();
        else bgmusic.pause();
    }
}
window.AutoScaler = function(element, initialWidth, initialHeight, skewAllowance){
    var self = this;
    
    this.viewportWidth  = 0;
    this.viewportHeight = 0;
    
    if (typeof element === "string")
        element = document.getElementById(element);
    
    this.element = element;
    this.gameAspect = initialWidth/initialHeight;
    this.skewAllowance = skewAllowance || 0;
    
    this.checkRescale = function() {
        if (window.innerWidth == self.viewportWidth && 
            window.innerHeight == self.viewportHeight) return;
        
        var w = window.innerWidth;
        var h = window.innerHeight;
        
        var windowAspect = w/h;
        var targetW = 0;
        var targetH = 0;
        
        targetW = w;
        targetH = h;
        
        if (Math.abs(windowAspect - self.gameAspect) > self.skewAllowance) {
            if (windowAspect < self.gameAspect)
                targetH = w / self.gameAspect;
            else
                targetW = h * self.gameAspect;
        }
        
        self.element.style.width  = targetW + "px";
        self.element.style.height = targetH + "px";
    
        self.element.style.marginLeft = ((w - targetW)/2) + "px";
        self.element.style.marginTop  = ((h - targetH)/2) + "px";
    
        self.viewportWidth  = w;
        self.viewportHeight = h;
        
    }
    
    // Ensure our element is going to behave:
    self.element.style.display = 'block';
    self.element.style.margin  = '0';
    self.element.style.padding = '0';
    
    // Add event listeners and timer based rescale checks:
    window.addEventListener('resize', this.checkRescale);
    rescalercheck=setInterval(this.checkRescale, 150);
};