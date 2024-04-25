let bird = document.getElementById("bird");
let sky = document.getElementById("sky");
let ground = document.getElementById("ground");
let gameArea = document.getElementById("main-container");
let timer = document.querySelector(".timer");
let start = document.querySelector(".start-button")

let skyWidth = parseFloat(window.getComputedStyle(sky).width);
let skyHeight = parseFloat(window.getComputedStyle(sky).height);
let groundWidth = parseFloat(window.getComputedStyle(ground).width);
let groundHeight = parseFloat(window.getComputedStyle(ground).height);

let obstacles = []
let inverted;

let birdBottom;
let birdLeft;
let birdTop;

let obstacleTop;
let obstacleBottom;
let obstacleLeft;
let obstacleGap;

let leftTimerId;
let upTimerId;
let downTimerId;
let doubleJumpId;
let collisionId;

let countDownId;
let countDownTimer = 5;
let score = 0

let isJumping = false;
let isFalling = false;
let isGameOver;

let upCount;





function createBird() {

    if (skyWidth < 800){
        bird.style.width = 30 + 'px';
        bird.style.height = 30 + 'px';
    }
    birdBottom = skyHeight/2;
    birdLeft = skyWidth/25;
    birdTop = (skyHeight + groundHeight) - birdBottom;
    bird.style.left = birdLeft + 'px';
    bird.style.bottom = birdBottom + 'px';
    bird.style.visibility = "visible"; 
}



class newObs {
    constructor(obstacleLeft,width,i){

        if (i == 1 || i == 3){
            this.obstacleLeft = obstacleLeft;
            this.obstacleTop = 0;
            this.height = ((skyHeight/2)/2) + (Math.random() * (skyHeight/2)/2);
            this.width = width;
            this.visual = document.createElement("div");

            let visual = this.visual;
            gameArea.appendChild(visual);
            visual.style.left = this.obstacleLeft + 'px';
            visual.style.top = this.obstacleTop + 'px';
            visual.style.height = this.height + 'px';
            visual.style.width = this.width + 'px';
            visual.classList.add("obstacle");
            visual.style.backgroundImage = "url('./images/pipe.png')"

        }else{
            
            this.obstacleLeft = obstacleLeft;
            this.obstacleBottom = 10 + (Math.random() * (groundHeight - 10));
            this.height = (skyHeight/2) + Math.random() * ((skyHeight/2)/2);
            this.width = width;
            this.visual = document.createElement('div');

            let visual = this.visual;
            gameArea.appendChild(visual);
            visual.style.left = this.obstacleLeft + 'px';
            visual.style.bottom = this.obstacleBottom + 'px';
            visual.style.height = this.height + 'px';
            visual.style.width = this.width + 'px';
            visual.classList.add("obstacle");
        }
    }
}



function createObstacle() {

    if (skyWidth < 800){
        for (let i=0 ; i<2 ; i++){
            width = 30;
            obstacleGap = (skyWidth/2);
            obstacleLeft = obstacleGap + i*obstacleGap;
            let newObstacle = new newObs(obstacleLeft,width,i); 
            obstacles.push(newObstacle);
            console.log("case 1 activated")
        }
       

    }  else if (skyWidth > 800){
        for (let i=0 ; i<4 ; i++){
            if (i == 1 || i ==3){
                width = 40;
            }else{
                width = 50;
            }
        
            obstacleGap = (skyWidth/2)/2;
            obstacleLeft = obstacleGap + (i*obstacleGap);
            let newObstacle = new newObs(obstacleLeft,width,i); 
            obstacles.push(newObstacle);
            console.log("case 2 activated")
        }
    }
}



function moveObstacle() {

    obstacles.forEach((obs)=>{
        obs.obstacleLeft -= 4;
        obstacleLeft = obs.obstacleLeft;
        obs.visual.style.left = obstacleLeft + 'px';
        

        if (obstacleLeft <= -50){
            obs.visual.visibility = "hidden";
            score ++;
            timer.innerHTML = score;
            obstacleLeft = skyWidth;
            obs.obstacleLeft = obstacleLeft;
            obs.visual.style.left = obstacleLeft + 'px';
            if (obs.obstacleBottom){
                obs.obstacleBottom = 10 + (Math.random() * (groundHeight - 10));
                obs.height = ((skyHeight/2) + Math.random() * ((skyHeight/2)/2));
                obs.visual.style.bottom = obs.obstacleBottom + 'px';
                obs.visual.style.height = obs.height + 'px';
            }else{
                obs.height =  ((skyHeight/2)/2) + (Math.random() * (skyHeight/2)/2);
                obs.visual.style.height = obs.height + 'px';
            }
            obs.visual.style.visibility = "visible";
               
        }
    })
}



function jump_2() {
    if (!isJumping){
        
        doubleJumpId = setInterval(()=>{
            if (upCount >= 100){
                clearInterval(doubleJumpId);
                fall()
            }else{
                upCount ++;
                birdBottom += 1.8;
                bird.style.bottom = birdBottom + 'px';
                birdTop = ((skyHeight + groundHeight) - birdBottom) - 50;
            }
        },5)
    }
}



function jump(){
    if (doubleJumpId) {
        clearInterval(doubleJumpId);
        
    };
    if (downTimerId) clearInterval(downTimerId); 
    if(isJumping) {
        clearInterval(upTimerId);
        
        isJumping = false;
        jump_2()
    }else {
        upCount = 0
        isJumping = true;
        isFalling = false;
        
        upTimerId = setInterval(()=>{
            if (upCount >= 40){
                clearInterval(upTimerId);
                fall()
            }else{
                upCount ++;
                birdBottom += 1.5;
                bird.style.bottom = birdBottom + 'px';
                birdTop = ((skyHeight + groundHeight) - birdBottom) - 50;
            }
        },5)

    }
}



function fall() {
    
    isJumping = false;
    isFalling = true;
    downTimerId = setInterval(()=>{
        birdBottom -= 1;
        bird.style.bottom = birdBottom + 'px';
        birdTop = ((skyHeight + groundHeight) - birdBottom) - 50;
    },4)
}



function gameOver (){
    console.log("collision spotted")
    clearInterval(collisionId);
    clearInterval(leftTimerId);
    clearInterval(downTimerId);
    clearInterval(upTimerId);
    clearInterval(doubleJumpId);
    removeEventListener("keyup",jump)
}



function collision(){
    obstacles.forEach((obs)=>{
        
        if (obs.obstacleLeft <= (birdLeft+obs.width+1) &&
            (obs.obstacleLeft+obs.width) >= birdLeft &&
            birdBottom <= (obs.obstacleBottom + obs.height) && 
            obs.obstacleLeft <= (skyWidth/2 )){
                gameOver()
            }
            else if ( (obs.obstacleTop == 0) &&
            obs.obstacleLeft <= (birdLeft+50) &&
            (obs.obstacleLeft+obs.width) >= birdLeft &&
            birdTop <= (obs.height) && 
            obs.obstacleLeft <= (skyWidth/2 )){
                console.log(obs.width)
                gameOver()
            }
    })

    if (birdBottom <= groundHeight || birdTop <= -25){
        console.log("gameoverred")
        gameOver()
    }





}

let countdown = function (){
    countDownId = setInterval(()=>{
        timer.innerHTML = countDownTimer;
        countDownTimer -= 1;
        if (countDownTimer < 0){
           
            clearInterval(countDownId);
            addEventListener("keyup",jump)
            document.addEventListener("click",jump)

            collisionId = setInterval(collision,1)
            leftTimerId = setInterval(moveObstacle,30)    
        }
    },1000)
}



start.addEventListener(("click"),()=>{
    start.style.visibility = "hidden";
    gameArea.style.visibility = "visibile";
    createBird()
    createObstacle()
    console.log("clicked")
    countdown()
})











 































// let jumpState = 0; // 0 for regular jump, 1 for double jump

// function jump_2() {
//     if (!isJumping) {
//         console.log("jump_2 activated");
//         doubleJumpId = setInterval(() => {
//             if (upCount >= 200) {
//                 clearInterval(doubleJumpId);
//                 fall();
//             } else {
//                 upCount++;
//                 birdBottom += 1.8;
//                 bird.style.bottom = birdBottom + 'px';
//             }
//         }, 5);
//     }
// }

// function jump() {
//     if (downTimerId) clearInterval(downTimerId);

//     if (jumpState === 0) {
//         // Regular jump
//         if (!isJumping) {
//             isJumping = true;
//             console.log("jump activated and isJumping true");
//             upCount = 0;
//             upTimerId = setInterval(() => {
//                 if (upCount >= 40) {
//                     clearInterval(upTimerId);
//                     fall();
//                 } else {
//                     upCount++;
//                     birdBottom += 1.8;
//                     bird.style.bottom = birdBottom + 'px';
//                 }
//             }, 5);
//         } else {
//             // Switch to double jump
//             clearInterval(upTimerId);
//             console.log("upTimerCleared & isJumping false");
//             isJumping = false;
//             jumpState = 1;
//             jump_2();
//         }
//     } else {
//         // Double jump
//         clearInterval(doubleJumpId);
//         console.log("doubleJumpId Cleared");
//         jumpState = 0; // Reset jump state to regular jump
//         if (!isJumping) {
//             upCount = 0;
//             isJumping = true;
//             console.log("jump activated and isJumping true");
//             upTimerId = setInterval(() => {
//                 if (upCount >= 40) {
//                     clearInterval(upTimerId);
//                     fall();
//                 } else {
//                     upCount++;
//                     birdBottom += 1.8;
//                     bird.style.bottom = birdBottom + 'px';
//                 }
//             }, 5);
//         }
//     }
// }






