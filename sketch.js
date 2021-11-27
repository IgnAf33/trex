const PLAY = 1;
const END = 0;
let gameState = PLAY;
let score = 0;

let trex, trex_running, trex_collided;
let ground, invisibleGround, groundImage;

let cloudsGroup, cloudImage;
let obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3,
  obstacle4,
  obstacle5,
  obstacle6;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSnd = loadSound("jump.mp3");
  dieSnd = loadSound("die.mp3");
  checkPointSnd = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  //crea obstáculos y grupos de nubes
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  // trex.setCollider("rectangle", 0, 0, 200, trex.height);
  trex.setCollider("circle", 0, 0, 55);
  //trex.debug = true;

  gameOver = createSprite(300, 100, 100, 30);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  restart = createSprite(300, 140, 30, 30);
  restart.addImage(restartImg);
  restart.scale = 0.5;
}

function draw() {
  background(180);
  //muestra la puntuación
  text("Puntuación: " + score, 490, 40);
  // console.log("This is ", gameState);
  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    //mueve el suelo
    ground.velocityX = -(6 + (1 * score) / 100);
    //puntuación
    score += Math.round(getFrameRate() / 60);
    trex.changeAnimation("running", trex_running)
    //Cuando el score se divide entre 100 y el residuo es === 0 se reproduce el sonido
    if (score > 0 && score % 100 === 0) {
      checkPointSnd.play();
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //salta cuando se presiona la barra espaciadora
    if (keyDown("space") && trex.y >= 155) {
      trex.velocityY = -13;
      jumpSnd.play();
    }

    //agrega gravedad
    trex.velocityY += 0.8;

    //aparece las nubes
    spawnClouds();

    //aparece obstáculos en el suelo
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      // trex.velocityY = -12;
      // jumpSnd.play();
      gameState = END;
      dieSnd.play();
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    if (mousePressedOver(restart)) {
      reset();
    }

    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("collided", trex_collided);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    //Ciclo de vida obstáculos y nubes
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }

  //evita que el Trex caiga
  trex.collide(invisibleGround);

  drawSprites();
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  score = 0;
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(550, 165, 10, 40);
    obstacle.velocityX = -(6 + (1 * score) / 100);

    //genera obstáculos al azar
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //asigna escala y ciclo de vida a los obstáculos
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //agrega obstáculo al grupo
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //escribe el código aquí para aparecer las nubes
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.y = Math.round(random(10, 60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //asigna un ciclo de vida a la variable
    cloud.lifetime = 200;

    //ajusta la profundidad
    cloud.depth = trex.depth;
    trex.depth++;

    //agrega la nuble al grupo
    cloudsGroup.add(cloud);
  }
}
