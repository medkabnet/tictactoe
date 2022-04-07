let playerTurn = "P1";
let playerToShow = "P2";
let modeGame = document.getElementById("modeGame");
// Un conmpteru de cliquer 
let countClick = 0;
// Creer un tabela de score vide 
let position = [[null,null,null],[null,null,null],[null,null,null]];
let score = {};
// La hauteur de notre fenétre 
let h = window.innerHeight;
// La largeur de notre fenétre 
let w = window.innerWidth;
// La valeur d prend la valeur de h
let d = h;
// go une valeur bolean devient vrai en fin de parti 
let go = false;

//Créer un canvas
const canvas = document.createElement("canvas");
const canvasCol = document.getElementById("canvasCOl");
$(document).ready(()=>{
    if(h > w)
        d = w;
    canvas.setAttribute("id","canvas");
    canvas.setAttribute("class","mx-auto d-block");
    if(d%3 == 0 ){
        canvas.setAttribute("width",d+"px");
        canvas.setAttribute("height",d+"px");
        drawBoard(d);
    }
    else{
        for(let nd = d ; nd > 0 ; nd--){
            if(nd%3 == 0){
                canvas.setAttribute("width",nd+"px");
                canvas.setAttribute("height",nd+"px");
                drawBoard(nd);
                break;
            }
        }
    }
    canvasCol.append(canvas);
    setNewScore("P2");
})

$(".new-game").on("click",()=>{
    if(!go){
        $('#newGamePart').modal('show');
    }
    else
        restCanvas();
})
$(".startNewGame").on("click",()=>{
    restCanvas();
})
$(".hideModal").on("click",()=>{
    $('#newGamePart').modal('hide');
    $('#exampleModal').modal('hide');
})

function restCanvas(){
    $('#newGamePart').modal('hide');
    $('#exampleModal').modal('hide'); 
    var clearContext = canvas.getContext('2d');
    clearContext.clearRect(0, 0, d, d);
    drawBoard(d);
    countClick = 0;
    playerToShow = "P2";
    playerTurn = "P1";
    go = false;
    position = [[null,null,null],[null,null,null],[null,null,null]];
}

var context = canvas.getContext("2d");
function drawBoard(d){
    base_image = new Image();
    base_image.src = 'img/bg.png';
    base_image.onload = function(){
        context.drawImage(base_image,0,0, d, d);
    }
    //checkGameMode();
}

function checkGameMode(){
    if(modeGame.checked){
        if(score["JS"]  === undefined ){
            if(score["P2"] !== undefined ){
                if(score["P2"] == 0 && score["P1"] == 0 && countClick == 0)
                    setNewScore("JS");
                else
                    alert ("Perte des score");
            }
            else{
                setNewScore("JS");
            }
        }
    }
    else{
        if(score["P2"]  === undefined){
            if(score["JS"] !== undefined){
                if(score["JS"] == 0 && score["P1"] == 0 && countClick == 0)
                    setNewScore("P2");
                else
                    alert ("Perte des score");
            }
        }
        else {
            setNewScore("P2");
        }
    }
}

function setNewScore(ad){
    if(ad == "JS"){
        score = {
            'P1' : 0,
            'JS' : 0
        }
    }
    else{
        score = {
            'P1' : 0,
            'P2' : 0
        }
    }
}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    var newPlay = canvas.getContext("2d");
    let iX = 0;
    let iY = 0;
    let pX = 0;
    let pY = 0;
    if(x <= (d / 3) * 2 &&  x > d/3){
        iX = (d / 3) ;
        pY = 1;
    }else if(x > (d/3)*2 && x <= d){
        iX = (d / 3) *2;
        pY = 2;
    }
    if(y <= (d / 3) * 2 &&  y > d/3){
        iY = (d / 3) ;
        pX = 1;
    }else if(y > (d/3)*2 && y <= d){
        iY = (d / 3) *2;
        pX = 2;
    }
    if(position[pX][pY]!== null)
        return;
    countClick++;
    position[pX][pY] = playerTurn;
    base_image = new Image();
    if(playerTurn == "P1"){
        base_image.src = 'img/o.png';
        playerTurn = "P2";
        playerToShow = "P1";
    }
    else if(playerTurn == "P2"){
        base_image.src = 'img/x.png';
        playerTurn = "P1";
        playerToShow = "P2";
    }
    base_image.onload = function(){
        newPlay.drawImage(base_image,iX,iY, d/3, d/3);
    }
    //console.log(position);
    if(countClick > 4)
        var r = checkIfWin();
        console.log(r);
        if(r != false && r !== undefined){
            if( r == "go"){
                //alert("Égaliter" );
                $("#endGameMsg").html("Egalité");
                $('#exampleModal').modal('show'); 
            }
            else if(r.startsWith("Win-")){
                $("#endGameMsg").html(playerToShow+" gagne la parti");
                setWinner();
                r = r.replace("Win-",'');
                barWin(r);
            }
            go = true;
            
        }
            
}

function checkIfWin(){
    for (let index = 0; index < position.length; index++) {
        const row = position[index];
        if(row[0] ==  row[1]  && row[0] == row [2]&& row [0] !== null){
            return "Win-X"+index;
        }
    }
    for (let index = 0; index < position.length; index++) {
        if(position[0][index] ==  position[1][index]  && position[0][index] == position[2][index] && position[0][index] !== null){
            return "Win-Y"+index;
        }
    }
    if(position[0][0] == position[1][1] && position[0][0] == position[2][2] && position[0][0]  !== null ){
        return "Win-as";
    }
    if(position[0][2] == position[1][1] && position[0][2] == position[2][0] && position[0][2]  !== null){
        return "Win-s";
    }
    if(countClick == 9)
        return "go";
    return false;
}

canvas.addEventListener("mousedown", function(e)
{
    //if(countClick == 0)

    if(!go && countClick < 9)
        getMousePosition(canvas, e);
});

function barWin(bar){
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    console.log(bar);
    switch (bar) {
        case "as":
            ctx.moveTo(0, 0);
            ctx.lineTo(d, d);
            break;
        case "s":
            ctx.moveTo(0, d);
            ctx.lineTo(d, 0);
            break;
        case "Y0":
            ctx.moveTo( (d/3)/2 , d );
            ctx.lineTo( (d/3)/2 , 0);
            break;
        case "Y1":
            ctx.moveTo( (d/3)*(1.5), d );
            ctx.lineTo( (d/3)*(1.5) , 0);
            break;
        case "Y2":
            ctx.moveTo( (d/3)*(2.5)  , d );
            ctx.lineTo( (d/3)*(2.5) , 0);
            break;
        case "X0":
            ctx.moveTo(d , (d/3)*(0.5)  );
            ctx.lineTo(0 , (d/3)*(0.5) );
            break;
        case "X1":
            ctx.moveTo(d , (d/3)*(1.5)  );
            ctx.lineTo(0 , (d/3)*(1.5) );
            break;
        case "X2":
            ctx.moveTo(d , (d/3)*(2.5)  );
            ctx.lineTo(0 , (d/3)*(2.5) );
            break;
        default:
            break;
    }
    context.strokeStyle = '#28ad4b';
    ctx.lineWidth = 5;
    ctx.stroke();
}
function setWinner(){
    console.log(score[playerToShow]);
    score[playerToShow] = Number(score[playerToShow]) + 1;
    console.log(score[playerToShow]);
    if(playerToShow == "P1"){
        document.getElementById("s1").innerHTML = score[playerToShow];
        document.getElementById("ms1").innerHTML = score[playerToShow];
    }
       
    else if(playerToShow == "P2" || playerToShow == "JS"){
        document.getElementById("s2").innerHTML = score[playerToShow];
        document.getElementById("ms2").innerHTML = score[playerToShow];
    }
    $('#exampleModal').modal('show'); 
       
}