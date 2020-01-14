// Settings
const FPS = 1000 / 60;

// Save File
let save = {
  bytes: 0,
  totalBytes: 0,
  bps: 0,
  player: {
    level: 0,
    nextLevel: 100,
    increase: 3
  },
  power_ups: [],
  upgrades: [
    {
      name: "Intern",
      cost: 50,
      increase: 1.15,
      value: 0.1,
      quantity: 0,
      unlocksAt: 0
    },
    {
      name: "Junior Developer",
      cost: 100,
      increase: 1.2,
      value: 0.5,
      quantity: 0,
      unlocksAt: 1
    }
  ]
}

// Get Main Elements
const bytes_el = document.getElementById('bytes');
const bps_el = document.getElementById('bps');
const upgrades_el = document.getElementById('upgrades');
const lvl_el = document.getElementById('level');

/*
** EVENT LISTENERS
*/
document.addEventListener('keypress', coding);

/*
** FUNCTIONS
*/ 
function increaseBytes(bytes) { // Increase bytes value by 'X'
  save.bytes += bytes;
  save.totalBytes += bytes;
}

function coding() {
  increaseBytes(1);
}

function render() {
  upgrades_el.innerHTML = ""; // Clears list to prevent duplication
  // Render Upgrades
  save.upgrades.forEach(display_upgrades);
}

function display_upgrades(upgrade, i) {
  if (upgrade.unlocksAt <= save.player.level) {
    let button = document.createElement('button');
    button.classList.add('c-button');
    button.innerText = `${upgrade.name} (${upgrade.cost}b)`;
    button.addEventListener('click', () => purchase_upgrade(upgrade, i));
    upgrades_el.appendChild(button);
  } else if (upgrade.unlocksAt - 1 == save.player.level) {
    let button = document.createElement('button');
    button.classList.add('c-button', 'disabled');
    button.innerText = `${upgrade.name} (Unlocks at level: ${upgrade.unlocksAt})`;
    upgrades_el.appendChild(button);
  }
}

function purchase_upgrade (upgrade, i) {
  if (upgrade.cost <= save.bytes) {
    save.bytes -= upgrade.cost;
    save.upgrades[i].quantity++;
    save.upgrades[i].cost = Math.round(upgrade.cost * upgrade.increase);
    render();
  } else {
    alert('You need more Bytes, Keep on coding!');
  }
}

function upgrades() {
  save.bps = 0;
  save.upgrades.forEach(upgrade => {
    save.bps += (upgrade.value * upgrade.quantity);
    increaseBytes((upgrade.value * upgrade.quantity) / FPS);
  });
}

function loop () {
  upgrades();
  bytes_el.innerText = `${Math.round(save.bytes)} bytes`;
  bps_el.innerText = `${save.bps.toFixed(1)} bps`;

  if (save.totalBytes >= save.player.nextLevel) {
    save.player.level++;
    save.player.nextLevel *= save.player.increase;
    render();
  }

  lvl_el.innerText = `Level: ${save.player.level} (${Math.round(save.player.nextLevel - save.totalBytes)} bytes)`;
}

// CALL TO FUNCTIONS
render();
// Game Loop
setInterval(loop, FPS);