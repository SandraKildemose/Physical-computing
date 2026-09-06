// Arduino serial part

let arduinoPort = null;
let arduinoWriter = null;
let arduinoOk = false;
let lastCmd = "";

// HTML tingene  knappen og statusteksten kan skifte.
const statusBox = document.getElementById("serialStatus");
const connectBtn = document.getElementById("connectArduino");

connectBtn.addEventListener("click", connectArduino);

function setStatus(msg) {
  statusBox.textContent = msg;
}

async function connectArduino() {
  // Web Serial virker ikke i alle browsere, så jeg tjekker det først.
  if (!("serial" in navigator)) {
    setStatus("Brug Chrome eller Edge.");
    return;
  }

  try {
    setStatus("Vaelg port...");
    arduinoPort = await navigator.serial.requestPort();

    // viggigt at BaudRate med Serial.begin(9600) i Arduino koden, som fundet på git
    await arduinoPort.open({ baudRate: 9600 });

    arduinoWriter = arduinoPort.writable.getWriter();
    arduinoOk = true;

    connectBtn.textContent = "Forbundet";
    connectBtn.disabled = true;
    setStatus("Klar. Vis 5 fingre.");
  } catch (e) {
    // Hvis nu der vælges forkert port
    setStatus("Kunne ikke forbinde.");
  }
}

async function sendToArduino(cmd) {
  if (!arduinoOk || !arduinoWriter) return;

  if (cmd === lastCmd) return;
  lastCmd = cmd;

  let bytes = new TextEncoder().encode(cmd + "\n");
  await arduinoWriter.write(bytes);
}
