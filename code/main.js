import kaboom from "kaboom"

// initialize context
kaboom()

// load assets
loadSprite("birdy", "sprites/turtle_king-removebg-preview (1).png");

loadSprite("bg", "sprites/flappy-bg.png");
loadSprite("cano-cima", "sprites/cano-removebg-preview.png");
loadSound("wooosh", "sounds/wooosh.mp3");
loadSound("score", "sounds/score.mp3");

let highScore = 0;
scene("inicio", () => {
  add([
   sprite("bg", {width:width(), height: height()})
  ]);
  
  add([
    text("Flappy Turtle King \nPressione a barra\nde espaco para jogar", {size:30})
  ]);
  keyPress("space", () => {
  go("game")
  });
})
scene("game", () => {
  
const PIPE_GAP = 150;

let score = 0;

add([
  sprite("bg", {width:width(), height: height()})
]);

const scoreText = add([
  text(score, {size: 50})
]);
  
const player = add([
	// list of components
	sprite("birdy"),
  scale(2),
	pos(80, 40),
	area(),
  body(),
]);



function producePipes(){
const offset = rand(-50, 50)
  
add([
  sprite('cano-cima'),
  scale(0.25),
  pos(width(), height()/2 + offset + PIPE_GAP/2),
  "pipe",
  area(),
  {passed: false}
]);

add([
  sprite('cano-cima', {flipY: true}),
  scale(0.25),
  pos(width(), height()/2 + offset - PIPE_GAP/2),
  origin("botleft"),
  "pipe",
  area()
]);
}

loop(1.5, () => {
  producePipes();
});


  
action("pipe", (pipe) => {
  pipe.move(-160,0);

  if (pipe.passed === false && pipe.pos.x < player.pos.x){
    pipe.passed = true;
    play("score");
    score+=1;
    scoreText.text = score;
    //debug.log(score);
  }
});

player.collides("pipe", () => {
  go("gameover", score);
});

player.action(() => {
  if (player.pos.y > height() +30 || player.pos.y < -30){
    go("gameover", score);
  }
});
  
keyPress("space", () => {
  play("wooosh");
  player.jump(400);
  });
});

scene("gameover", (score) => {
  
  add([
  sprite("bg", {width:width(), height: height()})
]);
  
  if(score > highScore){
    highScore = score;
  }
  
  add([
    text("Fim de jogo!\n" + "Pontos: " + score + "\nRecorde: " + highScore)
  ]);

  keyPress("space", () => {
    go("game");
  })
});

go("inicio");