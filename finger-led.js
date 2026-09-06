// Five Finger LED
let cam;
let fingerCount = 0;
let ledOn = false;
let fingerBox = document.getElementById("fingerStatus");
let ledBox = document.getElementById("ledStatus");

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("kameraHold");
  cam = createCapture(VIDEO, camReady);
}

function camReady() {
  cam.size(640, 480);
  cam.hide();
  startHand(cam);
}

function draw() {
  tegnBaggrund();
  tegnKameraSomSpejl();
  opdaterProjektState();
  sendStateTilArduino();
  tegnHaandPunkter();
  tegnTekstPaaCanvas();
  opdaterHtmlBokse();
}

function tegnBaggrund() {
  //  Mørkere baggrund ind så kameraet og teksten er lettere  at se, beige nej.
  background(34, 28, 27);
}

function tegnKameraSomSpejl() {
  push();
  translate(width, 0);
  scale(-1, 1);
  image(cam, 0, 0, width, height);
  pop();
}

function opdaterProjektState() {
  // Hvis ml5 har fundet en hånd, så tæeller jeg fingre. Hvis ikke, er tallet 0.
  fingerCount = hands.length > 0 ? countFingers(hands[0]) : 0;

  // Her præcis 5 fingre betyder at LED skal være tændt.
  ledOn = fingerCount === 5;
}

function sendStateTilArduino() {
  let besked = ledOn ? "1" : "0";
  sendToArduino(besked);
}

function tegnHaandPunkter() {
  for (let h of hands) {
    let pts = getPoints(h);
    if (!pts) continue;

    for (let p of pts) {
      tegnEtPunkt(p);
    }
  }
}

function tegnEtPunkt(p) {
  noStroke();
  fill(112, 255, 152);
  circle(width - p.x, p.y, 8);
}

function tegnTekstPaaCanvas() {
  tegnTekstBaggrund();
  tegnTalOgLedTekst();
}

function tegnTekstBaggrund() {
  noStroke();
  fill(28, 24, 22, 205);
  rect(14, 14, 300, 94, 10);
}

function tegnTalOgLedTekst() {
  fill(255, 240, 225);
  textAlign(LEFT, TOP);

  textSize(21);
  text("Fingre: " + fingerCount, 28, 28);

  textSize(18);
  text(ledOn ? "LED: ON" : "LED: off", 28, 58);

  textSize(13);
  text("5 fingre = 1, ellers 0", 28, 84);
}

function opdaterHtmlBokse() {
  fingerBox.textContent = "Fingre: " + fingerCount;
  ledBox.textContent = ledOn ? "LED: 1 / on" : "LED: 0 / off";

  // Data on til CSS så boksen kan skifte farve når LED er tændt.
  ledBox.dataset.on = ledOn ? "true" : "false";
}

// . codex-test-physical-01

// . codex-test-physical-02

// . codex-test-physical-03

// . codex-test-physical-04

// . codex-test-physical-05
