const displayGameSelector = document.querySelector("#display-game-selector");
const displayGameField = document.querySelector("#display-game-field");
const tables = [...document.querySelectorAll("table")];
const easyTable = document.querySelector("#table-easy");
const advancedTable = document.querySelector("#table-advanced");
const extremeTable = document.querySelector("#table-extreme")

const text = document.querySelector("#text")
const nickname = document.querySelector("#nickname")
const winText = document.querySelector("#win")
let time = document.querySelector("#time")
let currentTime = 0;
let timer = null

const btnSave = document.querySelector("#save");
const btnRestart = document.querySelector("#restart");
const btnExit = document.querySelector("#exit");
const btnContinue = document.querySelector("#continue-btn")
const btnDelete = document.querySelector("#delete-results")

let isEasy = false;
let isAdvanced = false;
let isExtreme = false;

const btnEasy = document.querySelector("#easy");
const displayEasy = document.querySelector("#display-easy");
const btnAdvanced = document.querySelector("#advanced");
const displayAdvanced = document.querySelector("#display-advanced");
const btnExtreme = document.querySelector("#extreme");
const displayExtreme = document.querySelector("#display-extreme");

let fieldsCount;
const previousGame = document.querySelector("#previous-game");
let saved = false;
btnContinue.disabled = true;
const footer = document.querySelector("footer")

// local storage
if (JSON.parse(localStorage.getItem("time")) !== null) { // ha van mentett jatek
  previousGame.innerHTML = `${JSON.parse(localStorage.getItem("modeText"))}: ${JSON.parse(localStorage.getItem("name"))} - ${JSON.parse(localStorage.getItem("time"))} másodperc`
  btnContinue.disabled = false;
}
if (JSON.parse(localStorage.getItem("results")) !== null) { // ha vannak korabbi eredmenyek
  btnDelete.style.display = "block";
  let results = JSON.parse(localStorage.getItem("results"));
  document.querySelector("#results").innerHTML = results.join("<br />");
}

// start
btnEasy.addEventListener("click", () => {
  isEasy = true;
  isAdvanced = false;
  isExtreme = false;

  fieldsCount = 49;
  displayGameSelector.style.display = "none";
  displayGameField.style.display = "block";
  displayEasy.style.display = "block";
  displayAdvanced.style.display = "none";
  displayExtreme.style.display = "none";
  text.innerHTML = "Könnyű 7x7-es pálya"

  setAcvtive(easyTable)
  setInacvtive(advancedTable)
  setInacvtive(extremeTable)

  btnSave.style.display = "inline";
  footer.style.display = "none";
  nickname.innerHTML = document.getElementById("name").value === "" ? "Anonymous" : document.getElementById("name").value;
  saved = false
  startTimer();
});

btnAdvanced.addEventListener("click", () => {
  isEasy = false;
  isAdvanced = true;
  isExtreme = false;

  fieldsCount = 49;
  displayGameSelector.style.display = "none";
  displayGameField.style.display = "block";
  displayEasy.style.display = "none";
  displayAdvanced.style.display = "block";
  displayExtreme.style.display = "none";
  text.innerHTML = "Haladó 7x7-es pálya"

  setInacvtive(easyTable)
  setAcvtive(advancedTable)
  setInacvtive(extremeTable)

  btnSave.style.display = "inline";
  footer.style.display = "none";
  nickname.innerHTML = document.getElementById("name").value === "" ? "Anonymous" : document.getElementById("name").value;
  saved = false;
  startTimer();
});

btnExtreme.addEventListener("click", () => {
  isEasy = false;
  isAdvanced = false;
  isExtreme = true;

  fieldsCount = 100;
  displayGameSelector.style.display = "none";
  displayGameField.style.display = "block";
  displayEasy.style.display = "none";
  displayAdvanced.style.display = "none";
  displayExtreme.style.display = "block";
  text.innerHTML = "Extrém 10x10-es pálya"

  setInacvtive(easyTable)
  setInacvtive(advancedTable)
  setAcvtive(extremeTable)

  btnSave.style.display = "inline";
  footer.style.display = "none";
  nickname.innerHTML = document.getElementById("name").value === "" ? "Anonymous" : document.getElementById("name").value;
  saved = false
  startTimer();
});

// save
btnSave.addEventListener("click", () => {
  const sec = currentTime;
  let data = null;
  let mode = null;
  let modeText = "";
  if (isEasy) {
    data = document.getElementById("table-easy")
    mode = "easy"
    modeText = "Könnyű 7x7-es pálya"
  } else if (isAdvanced) {
    data = document.getElementById("table-advanced")
    mode = "advanced"
    modeText = "Haladó 7x7-es pálya"
  } else {
    data = document.getElementById("table-extreme")
    mode = "extreme"
    modeText = "Extrém 10x10-es pálya"
  }
  localStorage.setItem("table", JSON.stringify(data.innerHTML));
  localStorage.setItem("mode", JSON.stringify(mode))
  localStorage.setItem("modeText", JSON.stringify(modeText))
  localStorage.setItem("name", JSON.stringify(nickname.innerHTML));
  localStorage.setItem("time", JSON.stringify(sec));

  // jatek folytatasa szoveg frissitese
  previousGame.innerHTML = `${modeText}: ${nickname.innerHTML} - ${sec} másodperc`
  btnContinue.disabled = false;
});

// restart
btnRestart.addEventListener("click", () => { 
  reset();
  btnSave.style.display = "inline";
  startTimer();
});

// exit
btnExit.addEventListener("click", () => {
  displayGameField.style.display = "none";
  displayGameSelector.style.display = "block";
  footer.style.display = "block"
  reset();
});

function reset() {
  stopTimer();
  winText.style.display = "none"

  let rows = [];
    myTable = tables.filter(e => !e.classList.contains("inactive"))[0]
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

function inacvtive(table) {
  let rows = [...table.firstChild.nextSibling.childNodes];
  rows = rows.filter((table, i) => i % 2 === 0); // osszes tr egy tombben

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

  cells.map(e => e.classList.add("inactive"));
}

function setInacvtive(table) {
  let cells = getCells(table)
  cells.map(e => e.classList.add("inactive"));
  table.classList.add("inactive")
}

function setAcvtive(table) {
  let cells = getCells(table)
  cells.map(e => e.classList.remove("inactive"));
  table.classList.remove("inactive")
}


function getCells(table) {
  let rows = [...table.firstChild.nextSibling.childNodes];
  rows = rows.filter((table, i) => i % 2 === 0); // osszes tr egy tombben

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

function startTimer() {
  time.innerHTML = currentTime
  timer = setInterval(function () {
    time.innerHTML = ++currentTime
  }, 1000);
}

function stopTimer() {
  currentTime = 0;
  clearInterval(timer);
}

// folytatas
document.getElementById("continue").addEventListener("click", () => {
  const mode = JSON.parse(localStorage.getItem("mode"));
  const savedTable = JSON.parse(localStorage.getItem("table"))

  if (mode === "easy") {
    isEasy = true;
    isAdvanced = false;
    isExtreme = false;
    fieldsCount = 49;
    displayGameSelector.style.display = "none";
    displayGameField.style.display = "block";
    displayEasy.style.display = "block";
    displayAdvanced.style.display = "none";
    displayExtreme.style.display = "none";
    text.innerHTML = "Könnyű 7x7-es pálya"
    setAcvtive(easyTable)
    setInacvtive(advancedTable)
    setInacvtive(extremeTable)
    easyTable.innerHTML = savedTable
  } else if (mode === "advanced") {
    isEasy = false;
    isAdvanced = true;
    isExtreme = false;
    fieldsCount = 49;
    displayGameSelector.style.display = "none";
    displayGameField.style.display = "block";
    displayEasy.style.display = "none";
    displayAdvanced.style.display = "block";
    displayExtreme.style.display = "none";
    text.innerHTML = "Haladó 7x7-es pálya"
    setInacvtive(easyTable)
    setAcvtive(advancedTable)
    setInacvtive(extremeTable)
    advancedTable.innerHTML = savedTable
  } else {
    isEasy = false;
    isAdvanced = false;
    isExtreme = true;
    fieldsCount = 100;
    displayGameSelector.style.display = "none";
    displayGameField.style.display = "block";
    displayEasy.style.display = "none";
    displayAdvanced.style.display = "none";
    displayExtreme.style.display = "block";
    text.innerHTML = "Extrém 10x10-es pálya"
    setInacvtive(easyTable)
    setInacvtive(advancedTable)
    setAcvtive(extremeTable)
    extremeTable.innerHTML = savedTable
  }

  footer.style.display = "none"
  saved = true
  nickname.innerHTML = JSON.parse(localStorage.getItem("name"));
  currentTime = JSON.parse(localStorage.getItem("time"));
  startTimer();
})

// local storage korabbi eredmenyek uritese
btnDelete.addEventListener("click", () => {
  if (confirm("Biztosan törölni szeretnéd a korábbi eredményeket?")) {
    localStorage.removeItem("results")
    document.querySelector("#results").innerHTML = "<i>Nincsenek korábbi eredmények.</i>"
    btnDelete.style.display = "none"
  } 
})