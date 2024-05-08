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
let resetButton;
let startButton;
let gameOn = false;
let menuOn = true;
let imgLoadCount = 0;
let singleButton;
let multButton;
let menuButton;
// these are gonna be 88/93, they were org 100/105
let guessBoxSize = 100;
let guessXShift = guessBoxSize * 1.05;

let multiplayerEnabled = false;
let connected = false
let multiplayerGameStarted = false
let sharedDoneLoading = false
let mySharedDoneLoading = false
let watchedPlayers = []
let multiplayerInput
let multiplayerJoinButton
let multiplayerStartButton

function preload() {
  //randomSeed(1360925150294);
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

  menuButton = createButton('Back to Menu');
  menuButton.hide();
  menuButton.position((windowWidth - 30 > 1300 ? windowWidth - 150 : 1170), 10);
  menuButton.style('font-family', 'andy');
  menuButton.style('font-size: 20px');
  menuButton.style('color', 'black');
  menuButton.style('background-color', '#c9190c');
  menuButton.size(130, 30);
  menuButton.mouseOver(hoverButton);
  menuButton.mouseOut(unHoverButton);
  menuButton.mousePressed(function() {
    resetGame(false);
  });

  resetButton = createButton('New Game');
  resetButton.hide();
  resetButton.position((windowWidth - 30 > 1300 ? windowWidth - 260 : 1060), 10);
  resetButton.style('font-family', 'andy');
  resetButton.style('font-size: 20px');
  resetButton.style('color', 'black');
  resetButton.style('background-color', '#c9190c');
  resetButton.size(100, 30);
  resetButton.mouseOver(hoverButton);
  resetButton.mouseOut(unHoverButton);
  resetButton.mousePressed(function() {
    resetGame(true);
  });

  startButton = createButton('Play');
  startButton.position(windowWidth / 2 - 100, windowHeight / 4 - 30);
  startButton.style('font-family', 'andy');
  startButton.style('font-size: 40px');
  startButton.style('color', 'black');
  startButton.style('background-color', '#2cd124');
  startButton.size(200, 60);
  startButton.mouseOver(hoverButton);
  startButton.mouseOut(unHoverButton);
  startButton.mousePressed(function() {
    startButton.hide();
    singleButton.hide();
    multButton.hide();
    menuOn = false;
    gameOn = true;
    showInputs()
    if (!multiplayerEnabled) {
      startGame();
    }
  });

  singleButton = createButton('Singleplayer');
  singleButton.position(windowWidth * 0.48 - 110, windowHeight * 0.35 - 15);
  singleButton.style('font-family', 'andy');
  singleButton.style('font-size: 20px');
  singleButton.style('color', 'black');
  singleButton.style('background-color', '#c9190c');
  singleButton.size(110, 30);
  singleButton.mouseOver(hoverButton);
  singleButton.mouseOut(unHoverButton);
  singleButton.mousePressed(function() {
    multiplayerEnabled = false;
    print(multiplayerEnabled)
  });

  multButton = createButton('Multiplayer');
  multButton.position(windowWidth * 0.52, windowHeight * 0.35 - 15);
  multButton.style('font-family', 'andy');
  multButton.style('font-size: 20px');
  multButton.style('color', 'black');
  multButton.style('background-color', '#c9190c');
  multButton.size(110, 30);
  multButton.mouseOver(hoverButton);
  multButton.mouseOut(unHoverButton);
  multButton.mousePressed(function() {
    multiplayerEnabled = true;
    print(multiplayerEnabled)
  });
  //Multiplayer buttons
  multiplayerInput = createInput('[Enter Username]');
  multiplayerInput.position(9, 5);
  multiplayerInput.size(180, 20);
  multiplayerInput.style('font-family', 'andy');
  multiplayerInput.style('font-size: 14px');
  multiplayerInput.style('color', 'black');
  multiplayerInput.style('background', "#EA5252");
  multiplayerInput.elt.maxLength = 20;
  multiplayerInput.hide()

  multiplayerJoinButton = createButton('Join Multiplayer');
  multiplayerJoinButton.position(200, 5);
  multiplayerJoinButton.size(125, 24);
  multiplayerJoinButton.style('font-family', 'andy');
  multiplayerJoinButton.style('font-size: 16px');
  multiplayerJoinButton.style('background-color', "#696969");
  multiplayerJoinButton.style('border-radius', '5px');
  multiplayerJoinButton.mousePressed(joinPlayer)
  multiplayerJoinButton.hide()

  multiplayerStartButton = createButton('Start New Game');
  multiplayerStartButton.position(310, 5);
  multiplayerStartButton.size(125, 24);
  multiplayerStartButton.style('font-family', 'andy');
  multiplayerStartButton.style('font-size: 16px');
  multiplayerStartButton.style('background-color', "#696969");
  multiplayerStartButton.style('border-radius', '5px');
  multiplayerStartButton.mousePressed(() => { partyEmit("start") })
  multiplayerStartButton.hide()
}

function startGame() {
  resizeCanvas((windowWidth - 30 > 1300 ? windowWidth - 30 : 1300), windowHeight + 1000, true);

  for (j = 0; j < itemTables.length; j++) {
    for (let i = 0; i < itemTables[j].getRowCount(); ++i) {
      orgItemArray.push(createButton(itemTables[j].get(i, "name")));
      orgItemArray[i].size(140, scaleY - 4);
      orgItemArray[i].style('font-family', 'andy');
      if (orgItemArray[i].html().toString().length > 28)
        orgItemArray[i].style('font-size: 13px');
      else
        orgItemArray[i].style('font-size: 16px');
      orgItemArray[i].style('color', 'black');
      orgItemArray[i].style('background-color', '#C70039');
      orgItemArray[i].hide();
      orgItemArray[i].value(j);
      orgItemArray[i].mousePressed(selectGuess);
      orgItemArray[i].mouseOver(hoverButton);
      orgItemArray[i].mouseOut(unHoverButton);
      orgImgArray.push(loadImage(itemTables[j].get(i, "image"), imgLoaded, imgLoaded));
    }
  }
  fill(255);
  sortButtons(orgItemArray);
  itemArray = orgItemArray;
  imgArray = orgImgArray;
  orgItemCount = orgItemArray.length;
  itemCount = orgItemArray.length;
  chosenIndex = int(random(0, itemCount));
  chosenItem.addRow(itemTables[orgItemArray[chosenIndex].value()].findRow(orgItemArray[chosenIndex].html(), 'name'));
  print(chosenItem.getRow(0).getString(0));

  // showInputs()
}

function showInputs() {
  if (!multiplayerEnabled) {
    search.show();
    scrollBar.show();
  }

  if (multiplayerEnabled) {
    search.hide();
    scrollBar.hide();
    multiplayerInput.show()
    multiplayerJoinButton.show()
  }
}

function imgLoaded() {
  imgLoadCount++;
}

function resetGame(shouldStart) {
  resetButton.hide();
  menuButton.hide();
  imgLoadCount = 0;
  clear();
  for (i = orgItemArray.length - 1; i >= 0; i--) {
    orgItemArray[i].remove();
  }
  for (i = itemArray.length - 1; i >= 0; i--) {
    itemArray[i].remove();
  }
  orgItemArray = [];
  itemArray = [];
  orgImgArray = [];
  imgArray = [];
  scrollPos = 0;
  itemCount = 0;
  orgItemCount = 0;
  scrollHold = 0;
  search.value('');
  selectedGuess = "";
  selectedGuessIndex = -1;
  ///itemTables = [];
  guessList.clearRows();
  guessIndexes = [];
  chosenItem.clearRows();
  rarityFound = false;
  if (shouldStart) {
    startGame();
  }
  else {
    resizeCanvas(windowWidth - 20, windowHeight - 20, true);
    menuOn = true;
    gameOn = false;
    search.hide();
    scrollBar.hide();
    startButton.show();
    singleButton.show();
    multButton.show();
  }
}

function setup() {
  var cnv = createCanvas(windowWidth - 20, windowHeight - 20);
  //var cnv = createCanvas((windowWidth - 30 > 1300 ? windowWidth - 30 : 1300), windowHeight - 20 + 1000);
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
    guess()
  }
  search = createInput('');
  search.position(9, 32);
  search.size(180, 20);
  search.style('font-family', 'andy');
  search.style('font-size: 14px');
  search.style('color', 'black');
  search.style('background', "#EA5252");
  search.hide();
  scrollBar = createDiv();
  scrollBar.style('background', color(104));
  scrollBar.size(11, 20);
  scrollBar.hide();
}

function draw() {
  textFont(terrariaFont);
  // here's the lines which just get rid of the single/mult buttons to make sure it isnt confusing, you can remove these commands for actual functionality
  // singleButton.hide();
  // multButton.hide();
  if (gameOn) {
    if (!multiplayerEnabled) {
      drawSearchArea();
      if (imgLoadCount == orgItemCount) {
        resetButton.show();
        menuButton.show();
      } else {
        guessButton.draw();
        displayGuesses()
      }
    }
    if (multiplayerEnabled) {
      if (connected) {
        drawChat()
        updateScoreboard()
        drawScoreboard()
      }
      if (multiplayerGameStarted) {
        drawSearchArea();
        if (!myShared.loaded) {
          if (imgLoadCount == 0) {
            myShared.status[0] = "Preparing images"
            myShared.status[1] = 'rgba(255, 255, 0, 0.50)'
          } else {
            myShared.status[0] = "Imgs (" + imgLoadCount + "/" + orgItemCount + ")"
            myShared.status[1] = 'rgba(255, 255, 0, 0.50)'
          }
          if (imgLoadCount == orgItemCount) {
            myShared.loaded = true
            myShared.status[0] = "Loaded!"
            myShared.status[1] = 'rgba(0, 0, 255, 0.50)'
            myShared.lastChat[0] = myShared.username + " is done loading!"
            myShared.lastChat[1] = 'rgba(0, 0, 255, 0.20)'
          }
        }
        if (partyIsHost() && myShared.status[0] === "Loaded!") {
          let playersLoaded = 0
          for (let i = 0; i < guestShared.length; i++) {
            if (guestShared[i].loaded) {
              playersLoaded++
            }
          }
          if (playersLoaded == guestShared.length) {
            partyEmit("started")
          }
        }
      }
    }
  }
  else if (menuOn) {
    drawMenu();
  }
}

function guess() {
  if (selectedGuessIndex != -1) {
    guessList.addRow(itemTables[orgItemArray[selectedGuessIndex].value()].findRow(selectedGuess, 'name'));
    guessIndexes.push(selectedGuessIndex);

    let count = 0
    for (let i = 0; i < guessList.getColumnCount(); i++) {
      if (guessList.getRow(guessList.getRowCount() - 1).getString(i) == chosenItem.getRow(0).getString(i)) {
        count++
      }
    }
    if (count > myShared.foundCategories) {
      myShared.foundCategories = count
      myShared.progress = count / chosenItem.getColumnCount()
    }

    if (connected) {
      myShared.lastChat[0] = ""
      myShared.lastChat[1] = ""
      myShared.guesses.unshift(list.getRow(selectedGuessIndex).getString(0))
      if (guessList.getRow(guessList.getRowCount() - 1).getString("name") == shared.answer) {
        myShared.lastChat[0] = myShared.username + " guessed correctly! (guess " + myShared.guesses.length + ")"
        myShared.lastChat[1] = 'rgba(0, 255, 0, 0.20)'
      } else {
        myShared.lastChat[0] = myShared.username + " guessed incorrectly...(guess " + myShared.guesses.length + ")"
        myShared.lastChat[1] = 'rgba(255, 0, 0, 0.20)'
      }
    }
    selectedGuessIndex = -1;
    selectedGuess = "";
    search.value("");
    for (i = 0; i < guessList.getRowCount(); i++) {
      if (guessList.get(i, "rarityid") == chosenItem.get(0, "rarityid")) {
        rarityFound = true;
      }
    }
    searchAdjust();
    displayGuesses();
  }
}


function drawSearchArea() {
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
  if (imgLoadCount == orgItemCount) {
    guessButton.draw();
  }
  // guessButton.draw();
  strokeWeight(2);
  fill('#EA5252');
  erase();
  rect(2, 52, 215, height);
  noErase();
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
}

function drawMenu() {

}

// its so simple, it just scrolls and works, now with touchpad support
function mouseWheel(event) {
  if (mouseX <= 202 && gameOn) {
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

function selectGuess() {
  search.value(this.html());
  searchAdjust();
  selectedGuess = this.html();
  selectedGuessIndex = orgItemArray.indexOf(this);
}

function hoverButton() {
  this.originalColor = this.style('background-color');
  this.style('background-color', darkenColor(this.style('background-color'), 30));
}

function unHoverButton() {
  this.style('background-color', this.originalColor);
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

function windowResized() {
  if (gameOn) {
    resizeCanvas((windowWidth - 30 > 1300 ? windowWidth - 30 : 1300), windowHeight + 1000, true);
  } else {
    resizeCanvas(windowWidth - 20, windowHeight - 20, true);
  }
  menuButton.position((windowWidth - 30 > 1300 ? windowWidth - 150 : 1170), 10);
  resetButton.position((windowWidth - 30 > 1300 ? windowWidth - 260 : 1060), 10);

  startButton.position(windowWidth / 2 - 100, windowHeight / 4 - 30);
  singleButton.position(windowWidth * 0.48 - 110, windowHeight * 0.35 - 15);
  multButton.position(windowWidth * 0.52, windowHeight * 0.35 - 15);
  displayGuesses();
}
// adriens codde
function displayGuesses() {
  if (guessList.getRowCount() > 0) {
    drawColumnTitles(["Item", "Name", "Damage Type", "Damage", "Knockback", "Speed", "Rarity", "Autoswing", "Material", "Dedication"], 55, guessXShift)
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
    rect(guessShift + 55 + num * guessXShift, 310 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, guessBoxSize, guessBoxSize * 0.75)
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
    text(guessList.getRow(i).getString(category), guessShift + 17.5 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 75, 70)
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
    rect(guessShift + 55 + num * guessXShift, 310 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, guessBoxSize, guessBoxSize * 0.75)
    pop()
    push()
    textAlign(CENTER, CENTER)
    textWrap(WORD)
    textSize(20)
    fill(250)
    noStroke()
    if (guessList.getRow(i).getNum(category) == 0) {
      text("No", guessShift + 30 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70)
    } else {
      text("Yes", guessShift + 30 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70)
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
    rect(guessShift + 55 + num * guessXShift, 310 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, guessBoxSize, guessBoxSize * 0.75)
    pop()
    push()
    textAlign(CENTER, CENTER)
    textWrap(WORD)
    textSize(20)
    fill(250)
    noStroke()
    if (guessList.getRow(i).getNum(category) > chosenItem.getRow(0).getNum(category)) {
      text(guessList.getRow(i).getNum(category), guessShift + 30 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70)
      textFont('system');
      text("↓", guessShift + 65 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70);
    } else if (guessList.getRow(i).getNum(category) < chosenItem.getRow(0).getNum(category)) {
      text(guessList.getRow(i).getNum(category), guessShift + 30 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70)
      textFont('system');
      text("↑", guessShift + 65 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70);
    } else {
      text(guessList.getRow(i).getNum(category), guessShift + 30 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70)
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
    rect(guessShift + 55 + num * guessXShift, 310 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, guessBoxSize, guessBoxSize * 0.75);
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
      text(options[guessList.getRow(i).getNum(category)][0], guessShift + 30 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70);
      textFont('system');
      strokeWeight(0);
      fill(255);
      textSize(20);
      text("↓", guessShift + 65 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70);
    } else if (guessList.getRow(i).getNum(category) < chosenItem.getRow(0).getNum(category)) {
      fill(options[guessList.getRow(i).getNum(category)][1]);
      text(options[guessList.getRow(i).getNum(category)][0], guessShift + 30 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70);
      textFont('system');
      strokeWeight(0);
      fill(255);
      textSize(20);
      text("↑", guessShift + 65 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70);
    } else {
      fill(options[guessList.getRow(i).getNum(category)][1]);
      text(options[guessList.getRow(i).getNum(category)][0], guessShift + 30 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70);
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
    rect(guessShift + 55 + num * guessXShift, 310 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, guessBoxSize, guessBoxSize * 0.75);
    pop();
    push();
    textAlign(CENTER, CENTER);
    textWrap(WORD);
    textSize(20);
    fill(255);
    strokeJoin(ROUND);
    if (guessList.getRow(i).getNum(category) > chosenItem.getRow(0).getNum(category)) {
      text(options[guessList.getRow(i).getNum(category)], guessShift + 30 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70);
      textFont('system');
      strokeWeight(0);
      fill(255);
      textSize(20);
      text("↓", guessShift + 65 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70);
    } else if (guessList.getRow(i).getNum(category) < chosenItem.getRow(0).getNum(category)) {
      text(options[guessList.getRow(i).getNum(category)], guessShift + 30 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70);
      textFont('system');
      strokeWeight(0);
      fill(255);
      textSize(20);
      text("↑", guessShift + 65 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70);
    } else {
      text(options[guessList.getRow(i).getNum(category)], guessShift + 30 + num * guessXShift, 275 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, 50, 70);
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
    rect(guessShift + 55 + num * guessXShift, 310 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, guessBoxSize, guessBoxSize * 0.75);
    noErase();
    rect(guessShift + 55 + num * guessXShift, 310 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, guessBoxSize, guessBoxSize * 0.75);
    pop();
    push();
    imageMode(CENTER);
    // 20 & 275 need to be based on guessShift and box size to make sure they're centered always
    image(orgImgArray[guessIndexes[i]], guessShift + 55 + num * guessXShift, 310 + (guessList.getRowCount() - 1 - i) * guessBoxSize * 0.85, guessBoxSize * 0.7, guessBoxSize * 0.7, 0, 0, orgImgArray[guessIndexes[i]].width, orgImgArray[guessIndexes[i]].height, CONTAIN);
    pop();
  }
}

// i love chatgpt
function darkenColor(colorString, amount) {
  let components = colorString.match(/\d+/g);
  let r = parseInt(components[0]);
  let g = parseInt(components[1]);
  let b = parseInt(components[2]);

  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

//-----------------------------------------Multiplayer Code-----------------------------------------
function joinPlayer() {
  multiplayerJoinButton.hide()
  push()
  strokeWeight(1)
  fill('red')
  rect(195, 0, 100, 20, 5)
  pop()
  push()
  textFont(terrariaFont)
  textSize(16)
  fill(250)
  noStroke()
  text("Connecting...", 205, 14)
  pop()

  partyConnect("wss://demoserver.p5party.org", "wordleRoomThingy")
  myShared = partyLoadMyShared({ player: 0, username: "", inGame: false, loaded: false, status: ["Not playing", 'rgba(255, 0, 0, 0.50)'], score: 0, progress: 0, foundCategories: 0, guesses: [], lastChat: ["", ""] }, mySharedLoaded)
  shared = partyLoadShared("shared", {}, sharedLoaded)
  guestShared = partyLoadGuestShareds()
}

function sharedLoaded() {
  shared.chat = shared.chat || [];
  shared.category = shared.category || ""
  shared.answer = shared.answer || ""
  shared.gameInProgress = shared.gameInProgress || false;
  shared.gameStarted = shared.gameStarted || false;
  shared.timePassed = shared.timePassed || 0;
  partySubscribe("start", startNewRound)
  partySubscribe("started", roundStarted)

  if (partyIsHost()) {
    // partyToggleInfo(true)
    // partySubscribe("updateChat", updateChat)
    shared.chat = [];
    shared.chat.push("New room created")
    shared.chat.push('rgba(0, 0, 255, 0.20)')
  }
  sharedDoneLoading = true
  if (mySharedDoneLoading) {
    connected = true
    newPlayer()
  }
}

function mySharedLoaded() {
  myShared.username = multiplayerInput.value()
  myShared.player = guestShared.length - 1
  multiplayerInput.value("")
  print("shared " + myShared.player)
  // inputBox.input(filterGuessList)
  push()
  strokeWeight(1)
  fill('green')
  rect(195, 0, 100, 20, 5)
  pop()
  push()
  textFont(terrariaFont)
  textSize(16)
  fill(250)
  noStroke()
  text("Connected!!", 208, 14)
  pop()
  mySharedDoneLoading = true
  if (sharedDoneLoading) {
    connected = true
    newPlayer()
  }
}

function newPlayer() {
  if (shared.gameInProgress) {
    multiplayerStartButton.hide()
    push()
    strokeWeight(1)
    fill('white')
    rect(300, 0, 135, 20, 5)
    pop()
    push()
    textFont(terrariaFont)
    textSize(16)
    fill(0)
    noStroke()
    text("Game in progress...", 310, 14)
    pop()
  } else {
    multiplayerStartButton.show()
  }
}

function startNewRound() {
  startGame()
  multiplayerGameStarted = true
  search.show();
  scrollBar.show();
  if (partyIsHost()) {
    shared.gameInProgress = true;
    shared.timePassed = 0
    shared.chat = [];
    chosenIndex = int(random(0, itemCount));
    chosenItem.removeRow(0)
    chosenItem.addRow(itemTables[orgItemArray[chosenIndex].value()].findRow(orgItemArray[chosenIndex].html(), 'name'));
    shared.answer = chosenItem.getRow(0).getString(0);
    print(shared.answer)
    print(guestShared.length + " players")
    for (let i = 0; i < guestShared.length; i++) {
      if (!watchedPlayers.includes(i)) {
        print("watching " + i)
        partyWatchShared(guestShared[i], "lastChat", () => { updateChat(i) })
        watchedPlayers.push(i)
      }
    }
  }
  myShared.inGame = true;
  myShared.score = 10000
  myShared.guesses = []
  search.value("")
  searchAdjust()
  multiplayerStartButton.hide()
  push()
  strokeWeight(1)
  fill('white')
  rect(300, 0, 135, 20, 5)
  pop()
  push()
  textFont(terrariaFont)
  textSize(16)
  fill(0)
  noStroke()
  text("Game in progress...", 310, 14)
  pop()
}

function roundStarted() {
  guessButton.draw();
  myShared.status[0] = "Playing"
  myShared.status[1] = 'rgba(0, 255, 0, 0.20)'
  if (partyIsHost()) {
    shared.gameStarted = true;
  }
}

function updateChat(player) {
  if (guestShared[player].lastChat[0] != "" && guestShared[player].lastChat[1] != "") {
    shared.chat.push(guestShared[player].lastChat[0])
    shared.chat.push(guestShared[player].lastChat[1])
  }
}

function drawChat() {
  push()
  strokeWeight(1)
  fill('rgba(255, 255, 255, 0.75)')
  erase()
  rect(255, 27.5, 300, 200, 5)
  noErase()
  rect(255, 27.5, 300, 200, 5)
  pop()
  if (shared.chat.length > 20) {
    shared.chat.splice(0, 2)
  }
  if (shared.chat.length % 2 == 0) {
    for (let i = 0; i < shared.chat.length; i += 2) {
      push()
      fill(shared.chat[i + 1])
      noStroke()
      rect(255, 27.5 + i * 10, 300, 20, 5)
      pop()
      push()
      fill('black')
      text(shared.chat[i], 260, 40 + i * 10)
      pop()
    }
  }
}

function updateScoreboard() {
  if (shared.gameStarted) {
    if (partyIsHost()) {
      shared.timePassed++
    }
    if (myShared.score > 0 && myShared.progress < 1) {
      myShared.score = 10000 - Math.round(shared.timePassed / 4) - (myShared.guesses.length * 500)
    } else if (myShared.score < 0) {
      myShared.score = 0
    }
  }
}

function drawScoreboard() {
  push()
  strokeWeight(1)
  fill('rgb(0, 0, 0)')
  rect(560, 27.5, 410, 20, 5)
  fill('rgba(150, 150, 150, 0.75)')
  erase()
  rect(560, 47.5, 120, 180, 5)
  noErase()
  rect(560, 47.5, 120, 180, 5)
  fill('rgba(125, 125, 125, 0.75)')
  erase()
  rect(680, 47.5, 150, 180, 5)
  noErase()
  rect(680, 47.5, 150, 180, 5)
  fill('rgba(150, 150, 150, 0.75)')
  erase()
  rect(830, 47.5, 70, 180, 5)
  noErase()
  rect(830, 47.5, 70, 180, 5)
  fill('rgba(125, 125, 125, 0.75)')
  erase()
  rect(900, 47.5, 70, 180, 5)
  noErase()
  rect(900, 47.5, 70, 180, 5)
  pop()

  push()
  textFont(terrariaFont)
  textSize(16)
  fill(250)
  noStroke()
  text("Status", 600, 42.5)
  text("Players", 730, 42.5)
  text("Score", 850, 42.5)
  text("Progress", 910, 42.5)
  pop()

  for (let i = 0; i < guestShared.length; i++) {
    push()
    textFont(terrariaFont)
    textSize(16)
    fill(250)
    noStroke()
    fill(guestShared[i].status[1])
    rectMode(CORNER)
    rect(560, 47.5 + i * 25, 120, 25, 5)
    //Score ranks (subject to change)
    if (guestShared[i].score > 9000 && guestShared[i].score <= 10000) {
      fill('rgba(0, 255, 255, 1)')
      text("X", 880, 65 + i * 25)
    } else if (guestShared[i].score > 7500 && guestShared[i].score <= 9000) {
      fill('rgba(255, 255, 0, 1)')
      text("S", 880, 65 + i * 25)
    } else if (guestShared[i].score > 6000 && guestShared[i].score <= 7500) {
      fill('rgba(0, 255, 0, 1)')
      text("A", 880, 65 + i * 25)
    } else if (guestShared[i].score > 4000 && guestShared[i].score <= 6000) {
      fill('rgba(0, 0, 255, 1)')
      text("B", 880, 65 + i * 25)
    } else if (guestShared[i].score > 2000 && guestShared[i].score <= 4000) {
      fill('rgba(0, 110, 170, 1)')
      text("C", 880, 65 + i * 25)
    } else if (guestShared[i].score >= 0 && guestShared[i].score <= 2000) {
      fill('rgba(255, 0, 0, 1)')
      text("F", 880, 65 + i * 25)
    }
    fill(250)
    text(guestShared[i].status[0], 565, 65 + i * 25)
    text(guestShared[i].username, 685, 65 + i * 25)
    text(guestShared[i].score, 835, 65 + i * 25)
    text(Math.round(guestShared[i].progress * 100) + "%", 905, 65 + i * 25)
    pop()
  }
}