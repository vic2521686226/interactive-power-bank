// State
let batteryLevel = 70;
let cable1 = "disconnected";
let cable2 = "disconnected";

const batteryInput = document.querySelector("#battery");
const firstCable = document.querySelector("#cable-1");
const secondCable = document.querySelector("#cable-2");

// Transition rules
function toggleCable(state) {
  if (state !== "disconnected") {
    return "disconnected";
  }

  if (batteryLevel >= 50) {
    return "charging";
  } else {
    return "waiting";
  }
}

function getChargingCount() {
  return [cable1, cable2].filter(state => state === "charging").length;
}

function setBatteryLevel(level) {
  batteryLevel = Math.max(0, level);

  if (batteryLevel === 0) {
    if (cable1 === "charging") cable1 = "waiting";
    if (cable2 === "charging") cable2 = "waiting";
  }

  render();
}

// Visual feedback
function renderCable(panel, state, deviceName) {
  panel.dataset.state = state;
  const status = state === "waiting" && batteryLevel === 0
    ? "Waiting (battery empty)"
    : state[0].toUpperCase() + state.slice(1);
  panel.querySelector(".state-label").textContent = status;
  const action = state === "disconnected" ? "Plug in" : "Unplug";
  panel.querySelector("button").textContent = `${action} ${deviceName}`;
}

function render() {
  batteryInput.value = batteryLevel;
  document.querySelector("#battery-value").textContent = `${batteryLevel}%`;
  renderCable(firstCable, cable1, "phone");
  renderCable(secondCable, cable2, "earbuds");
  const count = getChargingCount();
  const deviceLabel = count === 1 ? "device" : "devices";
  document.querySelector("#summary").textContent = `${count} ${deviceLabel} charging`;
}

// Event handlers
batteryInput.addEventListener("input", () => {
  setBatteryLevel(Number(batteryInput.value));
});

firstCable.querySelector("button").addEventListener("click", () => {
  cable1 = toggleCable(cable1);
  render();
});

secondCable.querySelector("button").addEventListener("click", () => {
  cable2 = toggleCable(cable2);
  render();
});

document.querySelector("#power").addEventListener("click", () => {
  if (batteryLevel === 0) return;

  if (cable1 === "waiting") {
    cable1 = "charging";
  }
  if (cable2 === "waiting") {
    cable2 = "charging";
  }
  render();
});

// Drain one percentage point per charging device every two seconds.
setInterval(() => {
  const chargingCount = getChargingCount();
  if (chargingCount > 0) {
    setBatteryLevel(batteryLevel - chargingCount);
  }
}, 2000);

render();
