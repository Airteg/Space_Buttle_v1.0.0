let universe = document.querySelector(".universe");
let rightBorder = Math.floor(universe.getBoundingClientRect().right),
  downBorder = Math.floor(universe.getBoundingClientRect().bottom);
let points = 0,
  rocketS = [],
  rocketSpeed = 1,
  intervalCounter = 5000,
  rahunok = 0,
  enSpeed = 1,
  enemyArmy = [],
  maxEnemyArmyUnit = 3,
  overlap = false;
let fps = 1000 / 30;
let pco = {
    el: false,
    x: Math.round(rightBorder / 2) - 55,
    y: downBorder - 98,
    step: 10,
    run: false,
    dir: "left", //or right
    w: 78,
    h: 77,
    hp: 2
  },
  enemy = {
    x: 0,
    y: 0,
    speedX: 2,
    speedY: 0,
    dir: "l", // or "r"
    type: "01" //or "02"
  },
  ints = {
    run: false,
    rocket: false,
    enemy: false,
    generateEnemy: false,
    test: false
  };
// ----------------------------------------------------------------
const blin = (a) => (document.getElementById("info").textContent = a);

function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function init() {
  universe.innerHTML += `<div class="pco" style="left: ${pco.x}px; top:${pco.y}px"> </div>`;
}

function shotAdd() {
  universe.innerHTML += `<div class="rocket" style="left: ${
    pco.x + 50
  }px; top:${pco.y - 20}px"></div>`;
}

function enemyAdd(x, y, dir, type) {
  let addClass = `enemy e_${dir}_${type}`; //additional class
  enemy.y = y;
  enemy.x = x;
  universe.innerHTML += `<div class="${addClass}" style="left: ${enemy.x}px; top:${enemy.y}px"></div>`;
  // console.log(`addClass: ${addClass};`);
}

function enemyGenerate() {
  enemyArmy = document.querySelectorAll(".enemy");
  if (enemyArmy.length > maxEnemyArmyUnit) return;
  let x, y, dir, type;
  y = randomInteger(55, downBorder - 150);
  randomInteger(1, 2) === 1 ? (dir = "l") : (dir = "r");
  dir === "l" ? (x = rightBorder) : (x = 0);
  randomInteger(1, 2) === 1 ? (type = "01") : (type = "02");
  enemyAdd(x, y, dir, type);
}

document.addEventListener("keydown", (e) => {
  // console.log(e.code);
  switch (e.code) {
    case "ArrowLeft":
      pco.run = true;
      pco.dir = "left";
      break;
    case "ArrowRight":
      pco.run = true;
      pco.dir = "right";
      break;
    case "Space":
      if (document.querySelectorAll(".rocket").length < 10) shotAdd();
      break;
    default:
      break;
  }
  // console.log(` pco.run=${pco.run}; pco.dir=${pco.dir}`);
});

document.addEventListener("keyup", (e) => {
  pco.run = false;
});
// ____________________________________________________
function intervals() {
  // лічильник інтервалів
  intervalCounter--;
  //Рух проти-космічної оборони вправо-вліво
  ints.run = setInterval(() => {
    if (pco.run) {
      switch (pco.dir) {
        case "left":
          if (pco.x > 0) {
            pco.x -= pco.step;
          }
          break;
        case "right":
          if (pco.x < rightBorder - 110) {
            pco.x += pco.step;
          }
          break;
        default:
          break;
      }
      document.querySelector(".pco").style.left = `${pco.x}px`;
    }
  }, fps);
  // Рух ракети, випущеної з PCO по ворогу
  ints.rocket = setInterval(() => {
    rocketS = document.querySelectorAll(".rocket");
    rocketS.forEach((rocket) => {
      rocket.style.top =
        rocket.getBoundingClientRect().top - rocketSpeed + "px";

      if (rocket.getBoundingClientRect().top < 0)
        rocket.parentNode.removeChild(rocket);
    });
  }, fps);

  // створення ворога making an enemy
  ints.enemy = setInterval(() => {
    enemyArmy.length < 4 ? enemyGenerate() : enemyArmy.length;
    enemyArmy = document.querySelectorAll(".enemy");

    enemyArmy.forEach((enSoldier) => {
      // Габарити ворога
      let EnStX = enSoldier.getBoundingClientRect().left,
        EnEndX = enSoldier.getBoundingClientRect().left + 163,
        EnStY = enSoldier.getBoundingClientRect().top,
        EnEndY = enSoldier.getBoundingClientRect().bottom;
      // Рух ворога
      let speed = enSpeed;
      enSoldier.classList[1][2] === "l"
        ? (speed = enSpeed * -1)
        : (speed = enSpeed);
      enSoldier.style.left = EnStX + speed + "px";

      // Перевірка зіткнення ворога з ракетою
      rocketS.forEach((rocket) => {
        // Кординати носа ракети
        const Rx = rocket.getBoundingClientRect().left;
        const Ry = rocket.getBoundingClientRect().top;

        // Якщо зіткнення - видалити ворога та ракету
        if (Rx >= EnStX && Rx <= EnEndX && Ry >= EnStY && Ry <= EnEndY) {
          blin(`Що він тобі зробив?:${++rahunok} `);
          rocket.parentNode.removeChild(rocket);
          enSoldier.parentNode.removeChild(enSoldier);
        }
      });
      // видалити ракету яка за екраном і рухається вправо
      if (EnStX > rightBorder && enSoldier.classList[1][2] === "r")
        enSoldier.parentNode.removeChild(enSoldier);
      // видалити ракету яка за екраном і рухається вправо
      if (EnStX < -163 && enSoldier.classList[1][2] === "l")
        enSoldier.parentNode.removeChild(enSoldier);
    });
  }, fps);
}
// ____________________________________________________
function game() {
  console.log("start");
  init();
  intervals();
}

game();
