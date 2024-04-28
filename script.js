let itemArray = [];
let orgItemArray = [];
let imgArray = [];
let orgImgArray = [];
let scrollPos = 0;
let scaleY = 50;
let itemCount;
let orgItemCount;
let scrollBar;
let scrollHold = 0;
let search;
let selectedGuess = "";
let selectedGuessIndex = -1;
let guessButton;
let itemTables = [];
let guessList;
let guessIndexes = [];
let chosenItem;
let guessShift = 250;
let knockback = [];
let speedAttack = [];
let rarity = [];
let terrariaFont;
let rarityFound = false;

function preload() {
  terrariaFont = loadFont('andy.ttf');
  knockback = ["None", "Extremely weak", "Very weak", "Weak", "Average", "Strong", "Very strong", "Extremely strong", "Insane"];
  speedAttack = ["Snail", "Extremely slow", "Very slow", "Slow", "Average", "Fast", "Very fast", "Insanely fast"];
  rarity = [["White", "#ffffff"], ["Blue", "#9696ff"], ["Green", "#96ff96"], ["Orange", "#ffc896"], ["Light Red", "#ff9696"], ["Pink", "#ff96ff"], ["Light Purple", "#d2a0ff"], ["Lime", "#96ff0a"], ["Yellow", "#ffff0a"], ["Cyan", "#05c8ff"], ["Red", "#ff2864"], ["Purple", "#b428ff"], ["Turquoise", "#00ffc8"], ["Pure Green", "#00ff00"], ["Dark Blue", "#2b60de"], ["Violet", "#6c2dc7"], ["Hot Pink", "#ff00ff"]];
  guessList = loadTable("guessList.csv", "csv", "header");
  chosenItem = loadTable("chosenItem.csv", "csv", "header");
  list = loadTable("calamityWeapons.csv", "csv", "header");
  //list2 = loadTable("calamityWeaponsAltTest.csv", "csv", "header");
  itemTables.push(list);
  //itemTables.push(list2);
  guessButton = new Clickable();
  guessButton.image = loadImage('playbutton.png');
}
// e
function setup() {
  var cnv = createCanvas((windowWidth - 30 > 1300 ? windowWidth - 30 : 1300), windowHeight - 20 + 1000);
  cnv.style('display', 'block');
  textFont(terrariaFont);
  guessButton.locate(192, 25);
  guessButton.resize(24, 24);
  guessButton.color = "#696969";
  guessButton.stroke = "#000000";
  guessButton.strokeWeight = 1;
  guessButton.cornerRadius = 5;
  guessButton.text = "";
  guessButton.fitImage = true;
  guessButton.onPress = function() {
    if (selectedGuessIndex != -1) {
      guessList.addRow(itemTables[orgItemArray[selectedGuessIndex].value()].findRow(selectedGuess, 'name'));
      guessIndexes.push(selectedGuessIndex);
      selectedGuessIndex = -1;
      selectedGuess = "";
      search.value("");
      for (i = 0; i < guessList.getRowCount(); i++) {
        if (guessList.get(i, "rarityid") == chosenItem.get(0, "rarityid")) {
          rarityFound = true;
        }
      }
      searchAdjust();
    }
  }
  search = createInput('');
  search.position(9, 32);
  search.size(180, 20);
  search.style('font-family', 'andy');
  search.style('font-size: 14px');
  search.style('color', 'black');
  search.style('background', "#EA5252");
  scrollBar = createDiv();
  scrollBar.style('background', color(104));
  scrollBar.size(11, 20);
  for (j = 0; j < itemTables.length; j++) {
    for (let i = 0; i < itemTables[j].getRowCount(); ++i) {
      button = createButton(itemTables[j].get(i, "name"));
      button.size(140, scaleY - 4);
      button.style('font-family', 'andy');
      if (button.html().toString().length > 28)
        button.style('font-size: 13px');
      else
        button.style('font-size: 16px');
      button.style('color', 'black');
      button.style('background-color', '#C70039');
      button.hide();
      button.value(j);
      orgItemArray.push(button);
      orgImgArray.push(loadImage(itemTables[j].get(i, "image")));
    }
  }
  fill(255);
  sortButtons(orgItemArray);
  for (let i = 0; i < orgItemArray.length; ++i) {
    orgItemArray[i].mousePressed(() => selectGuess(i));
    orgItemArray[i].mouseOver(() => hoverGuess(i));
    orgItemArray[i].mouseOut(() => unHoverGuess(i));
  }
  itemArray = orgItemArray;
  imgArray = orgImgArray;
  orgItemCount = orgItemArray.length;
  itemCount = orgItemArray.length;
  chosenIndex = int(random(0, itemCount));
  chosenItem.addRow(itemTables[orgItemArray[chosenIndex].value()].findRow(orgItemArray[chosenIndex].html(), 'name'));
  print(chosenItem.getRow(0).getString(0));
}

function draw() {
  textFont(terrariaFont);
  search.input(searchAdjust);
  baseWindowItemCount = round((windowHeight - 150) / 50);
  currentWindowItemCount = baseWindowItemCount - (itemCount < baseWindowItemCount ? baseWindowItemCount - itemCount : 0);
  if (itemCount <= baseWindowItemCount) {
    scrollBar.hide();
  } else {
    scrollBar.show();
  }
  if (scrollPos < 0) {
    scrollPos = 0;
  }
  else if (scrollPos > (itemCount - currentWindowItemCount) * 50) {
    scrollPos = (itemCount - currentWindowItemCount) * 50;
  }
  guessButton.draw();
  strokeWeight(2);
  fill('#EA5252');
  rect(2, 52, 200, baseWindowItemCount * 50 + 10);
  fill(66);
  rect(202, 52, 15, baseWindowItemCount * 50 + 10);
  scrollBar.position(212, map(scrollPos, 0, (itemCount - currentWindowItemCount) * 50, 62, baseWindowItemCount * 50 + 62 - 14));
  fill(255);
  if (mouseX >= 202 && mouseX <= 217 && mouseY >= 52 && mouseY <= baseWindowItemCount * 50 + 62 && mouseIsPressed) {
    scrollPos = int(map(mouseY, 62, 52 + baseWindowItemCount * 50 + 10 - 10, 0, (itemCount - currentWindowItemCount) * 50) / 50) * 50;
    if (scrollPos < 0) {
      scrollPos = 0;
    }
    else if (scrollPos > (itemCount - currentWindowItemCount) * 50) {
      scrollPos = (itemCount - currentWindowItemCount) * 50;
    }
  }
  for (i = 0; i < itemCount; i++) {
    itemArray[i].hide();
  }
  for (i = scrollPos; i < scrollPos + currentWindowItemCount * scaleY; i += scaleY) {
    itemArray[i / scaleY].show();
    itemArray[i / scaleY].position(65, i - scrollPos + 65);
    image(imgArray[i / scaleY], 5, i - scrollPos + 58, scaleY, scaleY, 0, 0, imgArray[i / scaleY].width, imgArray[i / scaleY].height, CONTAIN);
  }
  displayGuesses();
}
// its so simple, it just scrolls and works, now with touchpad support
function mouseWheel(event) {
  if (mouseX <= 202) {
    scrollHold += event.delta;
    if (scrollHold >= 50 || scrollHold <= -50) {
      scrollPos += int(scrollHold / 50) * 50;
      scrollHold -= int(scrollHold / 50) * 50;
    }
    return false;
  }
}

function searchAdjust() {
  selectedGuess = "";
  selectedGuessIndex = -1;
  for (i = 0; i < itemCount; i++) {
    itemArray[i].hide();
  }
  query = search.value().toString();
  itemArray = [];
  imgArray = [];
  newCount = 0;
  for (i = 0; i < orgItemCount; i++) {
    if (orgItemArray[i].html().toLowerCase().includes(query.toLowerCase()) && guessList.findRow(orgItemArray[i].html(), 'name') == null && (rarityFound ? itemTables[orgItemArray[i].value()].findRow(orgItemArray[i].html(), 'name').getNum('rarityid') == chosenItem.getRow(0).getNum('rarityid') : true)) {
      newCount++;
      itemArray.push(orgItemArray[i]);
      imgArray.push(orgImgArray[i]);
    }
  }
  itemCount = newCount;
}

function selectGuess(n) {
  search.value(orgItemArray[n].html());
  searchAdjust();
  selectedGuess = orgItemArray[n].html();
  selectedGuessIndex = n;
}

function hoverGuess(n) {
  orgItemArray[n].style('background-color', '#900C3F');
}

function unHoverGuess(n) {
  orgItemArray[n].style('background-color', '#C70039');
}

function sortButtons(arr) {
  const engC = new Intl.Collator('en');
  for (i = 1; i < arr.length; i++) {
    for (j = i; j > 0; j--) {
      if (engC.compare(arr[j].html(), arr[j - 1].html()) < 0) {
        temp = arr[j - 1];
        arr[j - 1] = arr[j];
        arr[j] = temp;

        temp2 = orgImgArray[j - 1];
        orgImgArray[j - 1] = orgImgArray[j];
        orgImgArray[j] = temp2;
      }
    }
  }
}
// adriens codde
function displayGuesses() {
  if (guessList.getRowCount() > 0) {
    drawColumnTitles(["Item", "Name", "Damage Type", "Damage", "Knockback", "Speed", "Rarity", "Autoswing", "Material", "Dedication"], 55, 105)
    drawImageGuessBox(0);
    drawStringGuessBox("name", 1);
    drawStringGuessBox("class", 2);
    drawNumberGuessBox("damage", 3);
    drawStringNumberGuessBox("knockback", 4, knockback);
    drawStringNumberGuessBox("speed", 5, speedAttack);
    drawColoredStringNumberGuessBox("rarityid", 6, rarity);
    drawBooleanGuessBox("autoswing", 7);
    drawBooleanGuessBox("material", 8);
    drawStringGuessBox("dedication", 9);
  }
}

function drawColumnTitles(titles, xInitial, xIncrement) {
  push()
  fill(25, 25, 25)
  strokeWeight(0)
  rect(5 + guessShift, 240, xIncrement * titles.length, 25)
  pop()
  push()
  textAlign(CENTER)
  textSize(20)
  fill(250)
  noStroke()
  for (let i = 0; i < titles.length; i++) {
    text(titles[i], guessShift + xInitial + xIncrement * i, 260)
  }
  pop()
}

function drawStringGuessBox(category, num) {
  for (let i = guessList.getRowCount() - 1; i > -1; i--) {
    if (guessList.getRow(i).getString(category) == chosenItem.getRow(0).getString(category)) {
      fill('green')
    } else {
      fill('red')
    }
    push()
    rectMode(CENTER)
    strokeWeight(2)
    rect(guessShift + 55 + num * 105, 310 + (guessList.getRowCount() - 1 - i) * 85, 100, 75)
    pop()
    push()
    textAlign(CENTER, CENTER)
    textWrap(WORD)
    if (guessList.getRow(i).getString(category).length < 16)
      textSize(20);
    else if (guessList.getRow(i).getString(category).length < 32)
      textSize(17);
    else
      textSize(14);
    fill(250)
    noStroke()
    text(guessList.getRow(i).getString(category), guessShift + 17.5 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 75, 70)
    pop()
  }
}

function drawBooleanGuessBox(category, num) {
  for (let i = guessList.getRowCount() - 1; i > -1; i--) {
    if (guessList.getRow(i).getNum(category) == chosenItem.getRow(0).getNum(category)) {
      fill('green')
    } else {
      fill('red')
    }
    push()
    rectMode(CENTER)
    strokeWeight(2)
    rect(guessShift + 55 + num * 105, 310 + (guessList.getRowCount() - 1 - i) * 85, 100, 75)
    pop()
    push()
    textAlign(CENTER, CENTER)
    textWrap(WORD)
    textSize(20)
    fill(250)
    noStroke()
    if (guessList.getRow(i).getNum(category) == 0) {
      text("No", guessShift + 30 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70)
    } else {
      text("Yes", guessShift + 30 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70)
    }
    pop()
  }
}

function drawNumberGuessBox(category, num) {
  for (let i = guessList.getRowCount() - 1; i > -1; i--) {
    if (guessList.getRow(i).getNum(category) == chosenItem.getRow(0).getNum(category)) {
      fill('green')
    } else {
      fill('red')
    }
    push()
    rectMode(CENTER)
    strokeWeight(2)
    rect(guessShift + 55 + num * 105, 310 + (guessList.getRowCount() - 1 - i) * 85, 100, 75)
    pop()
    push()
    textAlign(CENTER, CENTER)
    textWrap(WORD)
    textSize(20)
    fill(250)
    noStroke()
    if (guessList.getRow(i).getNum(category) > chosenItem.getRow(0).getNum(category)) {
      text(guessList.getRow(i).getNum(category), guessShift + 30 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70)
      textFont('system');
      text("↓", guessShift + 65 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70);
    } else if (guessList.getRow(i).getNum(category) < chosenItem.getRow(0).getNum(category)) {
      text(guessList.getRow(i).getNum(category), guessShift + 30 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70)
      textFont('system');
      text("↑", guessShift + 65 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70);
    } else {
      text(guessList.getRow(i).getNum(category), guessShift + 30 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70)
    }
    pop()
  }
}

function drawColoredStringNumberGuessBox(category, num, options) {
  for (let i = guessList.getRowCount() - 1; i > -1; i--) {
    if (guessList.getRow(i).getNum(category) == chosenItem.getRow(0).getNum(category)) {
      fill('green');
    } else {
      fill('red');
    }
    push();
    rectMode(CENTER);
    strokeWeight(2);
    rect(guessShift + 55 + num * 105, 310 + (guessList.getRowCount() - 1 - i) * 85, 100, 75);
    pop();
    push();
    textAlign(CENTER, CENTER);
    textWrap(WORD);
    textSize(19);
    strokeWeight(3);
    stroke(10);
    strokeJoin(ROUND);
    if (guessList.getRow(i).getNum(category) > chosenItem.getRow(0).getNum(category)) {
      fill(options[guessList.getRow(i).getNum(category)][1]);
      text(options[guessList.getRow(i).getNum(category)][0], guessShift + 30 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70);
      textFont('system');
      strokeWeight(0);
      fill(255);
      textSize(20);
      text("↓", guessShift + 65 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70);
    } else if (guessList.getRow(i).getNum(category) < chosenItem.getRow(0).getNum(category)) {
      fill(options[guessList.getRow(i).getNum(category)][1]);
      text(options[guessList.getRow(i).getNum(category)][0], guessShift + 30 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70);
      textFont('system');
      strokeWeight(0);
      fill(255);
      textSize(20);
      text("↑", guessShift + 65 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70);
    } else {
      fill(options[guessList.getRow(i).getNum(category)][1]);
      text(options[guessList.getRow(i).getNum(category)][0], guessShift + 30 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70);
    }
    pop()
  }
}

function drawStringNumberGuessBox(category, num, options) {
  for (let i = guessList.getRowCount() - 1; i > -1; i--) {
    if (guessList.getRow(i).getNum(category) == chosenItem.getRow(0).getNum(category)) {
      fill('green');
    } else {
      fill('red');
    }
    push();
    rectMode(CENTER);
    strokeWeight(2);
    rect(guessShift + 55 + num * 105, 310 + (guessList.getRowCount() - 1 - i) * 85, 100, 75);
    pop();
    push();
    textAlign(CENTER, CENTER);
    textWrap(WORD);
    textSize(20);
    fill(255);
    strokeJoin(ROUND);
    if (guessList.getRow(i).getNum(category) > chosenItem.getRow(0).getNum(category)) {
      text(options[guessList.getRow(i).getNum(category)], guessShift + 30 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70);
      textFont('system');
      strokeWeight(0);
      fill(255);
      textSize(20);
      text("↓", guessShift + 65 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70);
    } else if (guessList.getRow(i).getNum(category) < chosenItem.getRow(0).getNum(category)) {
      text(options[guessList.getRow(i).getNum(category)], guessShift + 30 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70);
      textFont('system');
      strokeWeight(0);
      fill(255);
      textSize(20);
      text("↑", guessShift + 65 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70);
    } else {
      text(options[guessList.getRow(i).getNum(category)], guessShift + 30 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 50, 70);
    }
    pop()
  }
}

function drawImageGuessBox(num) {
  for (let i = guessList.getRowCount() - 1; i > -1; i--) {
    push();
    rectMode(CENTER);
    imageMode(CENTER);
    strokeWeight(2);
    fill(60, 60, 60, 120);
    erase();
    rect(guessShift + 55 + num * 105, 310 + (guessList.getRowCount() - 1 - i) * 85, 100, 75);
    noErase();
    rect(guessShift + 55 + num * 105, 310 + (guessList.getRowCount() - 1 - i) * 85, 100, 75);
    pop();
    image(orgImgArray[guessIndexes[i]], guessShift + 20 + num * 105, 275 + (guessList.getRowCount() - 1 - i) * 85, 70, 70, 0, 0, orgImgArray[guessIndexes[i]].width, orgImgArray[guessIndexes[i]].height, CONTAIN);
  }
}