const displayGameSelector = document.querySelector("#display-game-selector");
const displayGameField = document.querySelector("#display-game-field");
const tables = [...document.querySelectorAll("table")];
const results = document.querySelector("#results");
const text = document.querySelector("#text");
const nickname = document.querySelector("#nickname");
const playerName = document.querySelector("#name");
const winText = document.querySelector("#win");
const btns = [...document.querySelectorAll(".difficulty")];
const btnSave = document.querySelector("#save");
const btnRestart = document.querySelector("#restart");
const btnExit = document.querySelector("#exit");
const btnContinue = document.querySelector("#continue-btn");
const btnDelete = document.querySelector("#delete-results");
const previousGame = document.querySelector("#previous-game");
const footer = document.querySelector("footer");

const timer = new Timer(document.querySelector("#time"));
let currentDifficulty = null;
let fieldsCount;
let saved = false;
const texts = {
  easy: "Könnyű 7x7-es pálya",
  advanced: "Haladó 7x7-es pálya",
  extreme: "Extrém 10x10-es pálya",
};
const difficulties = ["easy", "advanced", "extreme"];

// local storage
if (JSON.parse(localStorage.getItem("time")) !== null) { // ha van mentett jatek
  previousGame.innerHTML = `${texts[JSON.parse(localStorage.getItem("difficulty"))]}: ${JSON.parse(localStorage.getItem("name"))} - ${JSON.parse(localStorage.getItem("time"))} másodperc`
  btnContinue.disabled = false;
} else {
  btnContinue.disabled = true;
}
if (JSON.parse(localStorage.getItem("results")) !== null) { // ha vannak korabbi eredmenyek
  btnDelete.style.display = "block";
  results.innerHTML = JSON.parse(localStorage.getItem("results")).join("<br />");
}

// start
btns.map((btn) => btn.addEventListener("click", (e) => {
  currentDifficulty = e.target.id;

  fieldsCount = currentDifficulty === "extreme" ? 100 : 49;
  displayGameSelector.style.display = "none";
  displayGameField.style.display = "block";
  document.querySelector("#display-" + currentDifficulty).style.display = "block";
  difficulties.filter((diff) => diff !== currentDifficulty).map((diff) => document.querySelector("#display-" + diff).style.display = "none");
  text.innerHTML = texts[currentDifficulty];

  setActive(document.querySelector("#table-" + currentDifficulty));
  difficulties.filter((diff) => diff !== currentDifficulty).map((diff) => setInactive(document.querySelector("#table-" + diff)));

  btnSave.style.display = "inline";
  footer.style.display = "none";
  nickname.innerHTML = playerName.value === "" ? "Anonymous" : playerName.value;
  saved = false;

  timer.start();
}));

// save
btnSave.addEventListener("click", () => {
  localStorage.setItem("table", JSON.stringify(document.querySelector("#table-" + currentDifficulty).innerHTML));
  localStorage.setItem("difficulty", JSON.stringify(currentDifficulty));
  localStorage.setItem("name", JSON.stringify(nickname.innerHTML));
  localStorage.setItem("time", JSON.stringify(timer.currentTime));

  // jatek folytatasa, szoveg frissitese
  previousGame.innerHTML = `${texts[currentDifficulty]}: ${nickname.innerHTML} - ${timer.currentTime} másodperc`;
  btnContinue.disabled = false;
});

// restart
btnRestart.addEventListener("click", () => { 
  reset();
  btnSave.style.display = "inline";
  timer.start();
});

// exit
btnExit.addEventListener("click", () => {
  displayGameField.style.display = "none";
  displayGameSelector.style.display = "block";
  footer.style.display = "block"
  reset();
});

// folytatas
btnContinue.addEventListener("click", () => {
  currentDifficulty = JSON.parse(localStorage.getItem("difficulty"));
  const savedTable = JSON.parse(localStorage.getItem("table"));

  fieldsCount = currentDifficulty === "extreme" ? 100 : 49;
  displayGameSelector.style.display = "none";
  displayGameField.style.display = "block";
  document.querySelector("#display-" + currentDifficulty).style.display = "block";
  difficulties.filter((diff) => diff !== currentDifficulty).map((diff) => document.querySelector("#display-" + diff).style.display = "none");
  text.innerHTML = texts[currentDifficulty];
  setActive(document.querySelector("#table-" + currentDifficulty));
  difficulties.filter((diff) => diff !== currentDifficulty).map((diff) => setInactive(document.querySelector("#table-" + diff)));
  document.querySelector("#table-" + currentDifficulty).innerHTML = savedTable;

  footer.style.display = "none";
  saved = true;
  nickname.innerHTML = JSON.parse(localStorage.getItem("name"));

  timer.currentTime = JSON.parse(localStorage.getItem("time"));
  timer.start();
});

// local storage korabbi eredmenyek uritese
btnDelete.addEventListener("click", () => {
  if (confirm("Biztosan törölni szeretnéd a korábbi eredményeket?")) {
    localStorage.removeItem("results");
    results.innerHTML = "<i>Nincsenek korábbi eredmények.</i>";
    btnDelete.style.display = "none";
  } 
});

function reset() {
  timer.stop();
  winText.style.display = "none";

  let rows = [];
    myTable = tables.filter(e => !e.classList.contains("inactive"))[0];
    rows = [...myTable.firstChild.nextSibling.childNodes];
    rows = rows.filter((myTable, i) => i % 2 === 0); // osszes tr egy tombben

  let cells = [];
  rows.forEach((e) => {
    if (e.firstChild !== null && e.firstChild.nextSibling !== null) {
      e = e.firstChild.nextSibling;
      cells.push(e); // sor 1 cellajanak berakasa
      while (e.nextSibling !== null && e.nextSibling.nextSibling !== null) {
        e = e.nextSibling.nextSibling;
        cells.push(e); // sor tobbi cellajanak berakasa
      }
    }
  });

  cells.map((e) => {
    // visszaallitas
    if (e.classList.contains("black")) {
      if (e.innerHTML === "0") e.style.color = "";
      else if (e.innerHTML !== "") e.style.color = "red";
    } else {
      e.classList.remove("wrong");
      e.classList.remove("light");
      e.innerHTML = "";
    }
  });
}

function setInactive(table) {
  let cells = getCells(table);
  cells.map(e => e.classList.add("inactive"));
  table.classList.add("inactive");
}

function setActive(table) {
  let cells = getCells(table);
  cells.map(e => e.classList.remove("inactive"));
  table.classList.remove("inactive");
}

function getCells(table) {
  let rows = [...table.firstChild.nextSibling.childNodes];
  rows = rows.filter((_, i) => i % 2 === 0); // osszes tr egy tombben

  let cells = [];
  rows.forEach((e) => {
    if (e.firstChild !== null && e.firstChild.nextSibling !== null) {
      e = e.firstChild.nextSibling;
      cells.push(e); // sor 1 cellajanak berakasa
      while (e.nextSibling !== null && e.nextSibling.nextSibling !== null) {
        e = e.nextSibling.nextSibling;
        cells.push(e); // sor tobbi cellajanak berakasa
      }
    }
  });

  return cells
}