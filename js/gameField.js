let gameField = document.querySelector("#game-field");
let table = document.querySelector("#tables");

table.addEventListener("click", (e) => {
  if (!e.target.classList.contains("black")) {
    if (e.target.innerHTML === "💡") {
      turnOffLight(e.target);
    } else {
      turnOnLight(e.target);
    }
    BlackFieldWithNumberNextTo(e.target);
    isCorrect();
  }
});

function turnOffLight(t) {
  // t := e.target
  t.innerHTML = "";
  if (t.classList.contains("wrong")) t.classList.remove("wrong"); // ha piros leveszi rola

  if (!isLightBulbHorizontal(t) || !isLightBulbVertical(t)) {
    if (!isLightBulbHorizontal(t) && !isLightBulbVertical(t))
      t.classList.remove("light");

    if (!isLightBulbHorizontal(t)) {
      // balra
      let field = t;
      while (left(field) !== null && !left(field).classList.contains("black")) {
        field = left(field);
        if (!isLightBulbVertical(field)) field.classList.remove("light");
      }

      // jobbra
      field = t;
      while (
        right(field) !== null &&
        !right(field).classList.contains("black")
      ) {
        field = right(field);
        if (!isLightBulbVertical(field)) field.classList.remove("light");
      }
    }

    if (!isLightBulbVertical(t)) {
      // fel
      field = t;
      while (
        above(field) !== null &&
        !above(field).classList.contains("black")
      ) {
        field = above(field);
        if (!isLightBulbHorizontal(field)) field.classList.remove("light");
      }

      // le
      field = t;
      while (
        below(field) !== null &&
        !below(field).classList.contains("black")
      ) {
        field = below(field);
        if (!isLightBulbHorizontal(field)) field.classList.remove("light");
      }
    }
  }
  // piros mezok eltuntetese, ha szukseges
  if (
    isOnlyOneLightBulbHorizontal(t) !== false ||
    isOnlyOneLightBulbVertical(t) !== false
  ) {
    removeWrong(t);
  }
}

function turnOnLight(t) {
  // t := e.target
  t.innerHTML = "💡";
  t.classList.add("light");

  // balra
  let field = t;
  while (left(field) !== null && !left(field).classList.contains("black")) {
    field = left(field);
    if (field.innerHTML === "💡") {
      t.classList.add("wrong");
      field.classList.add("wrong");
    }
    field.classList.add("light")
  }

  // jobbra
  field = t;
  while (right(field) !== null && !right(field).classList.contains("black")) {
    field = right(field);
    if (field.innerHTML === "💡") {
      t.classList.add("wrong");
      field.classList.add("wrong");
    }
    field.classList.add("light")
  }

  // fel
  field = t;
  while (above(field) !== null && !above(field).classList.contains("black")) {
    field = above(field);
    if (field.innerHTML === "💡") {
      t.classList.add("wrong");
      field.classList.add("wrong");
    }
    field.classList.add("light")
  }

  // le
  field = t;
  while (below(field) !== null && !below(field).classList.contains("black")) {
    field = below(field);
    if (field.innerHTML === "💡") {
      t.classList.add("wrong");
      field.classList.add("wrong");
    }
    field.classList.add("light")
  }
}

function isLightBulbHorizontal(t) {
  let field = t;
  while (left(field) !== null && !left(field).classList.contains("black")) {
    field = left(field);
    if (field.innerHTML === "💡") return true;
  }

  field = t;
  while (right(field) !== null && !right(field).classList.contains("black")) {
    field = right(field);
    if (field.innerHTML === "💡") return true;
  }

  return false;
}

function isOnlyOneLightBulbHorizontal(t) {
  let count = 0;
  let retField = null;
  let field = t;
  while (left(field) !== null && !left(field).classList.contains("black")) {
    field = left(field);
    if (field.innerHTML === "💡") {
      count++;
      retField = field;
      if (count > 1) return false;
    }
  }

  field = t;
  while (right(field) !== null && !right(field).classList.contains("black")) {
    field = right(field);
    if (field.innerHTML === "💡") {
      count++;
      retField = field;
      if (count > 1) return false;
    }
  }

  return retField;
}

function isLightBulbVertical(t) {
  let field = t;
  while (above(field) !== null && !above(field).classList.contains("black")) {
    field = above(field);
    if (field.innerHTML === "💡") {
      return true;
    }
  }

  field = t;
  while (below(field) !== null && !below(field).classList.contains("black")) {
    field = below(field);
    if (field.innerHTML === "💡") {
      return true;
    }
  }

  return false;
}

function isOnlyOneLightBulbVertical(t) {
  let count = 0;
  let field = t;
  while (above(field) !== null && !above(field).classList.contains("black")) {
    field = above(field);
    if (field.innerHTML === "💡") count++;
    if (count > 1) return false;
  }

  field = t;
  while (below(field) !== null && !below(field).classList.contains("black")) {
    field = below(field);
    if (field.innerHTML === "💡") count++;
    if (count > 1) return false;
  }

  return true;
}

function left(t) {
  return t.previousElementSibling;
}

function right(t) {
  return t.nextElementSibling;
}

function above(t) {
  if (
    t.parentElement !== null &&
    t.parentElement.previousElementSibling !== null &&
    t.parentElement.previousElementSibling.firstChild !== null
  ) {
    let aboveField =
      t.parentElement.previousElementSibling.firstChild.nextElementSibling;

    for (let i = 0; i < findIndex(t); i++) {
      aboveField = aboveField.nextElementSibling;
    }

    return aboveField;
  }

  return null;
}

function below(t) {
  if (
    t.parentElement !== null &&
    t.parentElement.nextElementSibling !== null &&
    t.parentElement.nextElementSibling.firstChild !== null
  ) {
    let belowField =
      t.parentElement.nextElementSibling.firstChild.nextElementSibling;

    for (let i = 0; i < findIndex(t); i++) {
      belowField = belowField.nextElementSibling;
    }

    return belowField;
  }

  return null;
}

function findIndex(t) {
  let leftField = t;

  let index = 0;
  while (leftField.previousElementSibling !== null) {
    index++;
    leftField = leftField.previousElementSibling;
  }

  return index;
}

function removeWrong(t) {
  let field = t;
  while (left(field) !== null && !left(field).classList.contains("black")) {
    field = left(field);
    if (!isLightBulbHorizontal(field) && !isLightBulbVertical(field)) {
      field.classList.remove("wrong");
    }
  }

  field = t;
  while (right(field) !== null && !right(field).classList.contains("black")) {
    field = right(field);
    if (!isLightBulbHorizontal(field) && !isLightBulbVertical(field)) {
      field.classList.remove("wrong");
    }
  }

  field = t;
  while (above(field) !== null && !above(field).classList.contains("black")) {
    field = above(field);
    if (!isLightBulbHorizontal(field) && !isLightBulbVertical(field)) {
      field.classList.remove("wrong");
    }
  }

  field = t;
  while (below(field) !== null && !below(field).classList.contains("black")) {
    field = below(field);
    if (!isLightBulbHorizontal(field) && !isLightBulbVertical(field)) {
      field.classList.remove("wrong");
    }
  }
}

function BlackFieldWithNumberNextTo(t) {
  let field = t;
  if (
    left(field) !== null &&
    left(field).classList.contains("black") &&
    left(field).innerHTML !== ""
  ) {
    BlackFieldWithNumberCheck(left(field));
  }

  field = t;
  if (
    right(field) !== null &&
    right(field).classList.contains("black") &&
    right(field).innerHTML !== ""
  ) {
    BlackFieldWithNumberCheck(right(field));
  }

  field = t;
  if (
    above(field) !== null &&
    above(field).classList.contains("black") &&
    above(field).innerHTML !== ""
  ) {
    BlackFieldWithNumberCheck(above(field));
  }

  field = t;
  if (
    below(field) !== null &&
    below(field).classList.contains("black") &&
    below(field).innerHTML !== ""
  ) {
    BlackFieldWithNumberCheck(below(field));
  }
}

function BlackFieldWithNumberCheck(t) {
  let count = 0;

  let field = t;
  if (left(field) !== null && left(field).innerHTML === "💡") {
    count++;
  }

  field = t;
  if (right(field) !== null && right(field).innerHTML === "💡") {
    count++;
  }

  field = t;
  if (above(field) !== null && above(field).innerHTML === "💡") {
    count++;
  }

  field = t;
  if (below(field) !== null && below(field).innerHTML === "💡") {
    count++;
  }

  if (count != t.innerHTML) {
    // ha nem megfelelo szamu villanykorte van
    t.style.color = "red";
  } else {
    t.style.color = "";
  }
}

// beszinezi pirosra a nem 0 szammal ellatott fekete mezoket:
let blackFields = [...table.querySelectorAll(".black")]
blackFields
  .filter((e) => e.innerHTML !== "" && e.innerHTML !== "0")
  .map((e) => (e.style.color = "red"));

// ellenorzes:
function isCorrect() {
  blackFields = [...table.querySelectorAll(".black")]
  let myBlackFields = blackFields.filter(e => !e.classList.contains("inactive"))
  if (myBlackFields.every((e) => e.style.color !== "red")) {
    let wrongCells = [...table.querySelectorAll(".wrong")].filter(e => !e.classList.contains("inactive"))
    if (wrongCells.length === 0) {
      let lightCells = [...table.querySelectorAll(".light")].filter(e => !e.classList.contains("inactive"))
      if (
        lightCells.length + myBlackFields.length ===
        fieldsCount
      ) {
        end();
      }
    }
  }
}

// jatek vege: nyert
function end() {
  store();
  timer.stop();
  btnSave.style.display = "none";
  winText.style.display = "table";
  if (saved) {
    localStorage.clear();
    previousGame.innerHTML = "Nincs mentett játék!"
    btnContinue.disabled = true;
  }
  btnDelete.style.display = "block"
}

// local storageba helyezes
function store() {
  let datas = `${text.innerHTML}: ${nickname.innerHTML} - ${timer.currentTime} másodperc`
  let results = []
  if (JSON.parse(localStorage.getItem("results")) !== null) {
    results = JSON.parse(localStorage.getItem("results"));
  }
  results.unshift(datas);
  localStorage.setItem("results", JSON.stringify(results))
  document.querySelector("#results").innerHTML = results.join("<br />");
}