// játék változóinak deklarálása
var round = 'X';
var totalRounds = 0;
var finishedGame = false;
var rowAndColumnNumber = 3;

// a választások tömbe való létrehozása
var selectionsArray = new Array(); 
selectionsArray['X'] = new Array();
selectionsArray['O'] = new Array();

// Eredmény tömb létrehozása
var scoresArray = new Array(); 
scoresArray['X'] = 0;
scoresArray['O'] = 0;

// pálya visszaállítása 0-ra
function resetParameters() {
	round = 'X';
	totalRounds = 0;
	robot = true;
	finishedGame = false;
	selectionsArray['X'] = new Array();
	selectionsArray['O'] = new Array();
}


// játékos váltása: X-ről O-ra
function changeRound(){
	if (round == 'X') {
        round = 'O';
    } else {
        round = 'X';
    }
	
}

// Győztes minta definiálása
function isWinnerPatterns() {
	var wins = Array();

	wins = [ 
        [11,12,13], [21,22,23], [31,32,33],
        [11,21,31], [12,22,32], [13,23,33], 
        [11,22,33], [13,22,31]
    ];
	return wins;
}

// pálya generálásához szükséges attributomok csoportosítása egy function alatt (multiple attr)
function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
}

function generateGameBoard() {
    resetParameters(); // itt reseteljük a játékterek ha az már létezett akkor visszaállítjuk eredeti állapotába.
    var mainBoard = document.getElementById('tic-tac-to-board');
    mainBoard.innerHTML = ''; // reseteljük a szöveget a divből
    mainBoard.classList.add('active');

    // pálya generálása
    for (var row = 1; row <= rowAndColumnNumber; row ++) {
        for (var column = 1; column <= rowAndColumnNumber; column++) {
            var gridName = 'g-' + row + '-' + column;
            var gridId = row + '' + column;
            var btn = document.createElement('input');

            setAttributes(btn, {
                'id': gridId,
                'class': 'area',
                'value': '',
                'name': gridName,
                'type': 'button',
                'onclick': 'markingCheck(this)'
            });

            document.getElementById('tic-tac-to-board').appendChild(btn); // divhez füzzük hozzá a kattintható területeket
        }
    }
}

// A kiválasztott pozícióba írás
function markingCheck(object){

	object.value = round;
	totalRounds++;

	if (round == 'X' ) {
		object.classList.add('x-player');
	} else {
		object.classList.add('o-player');
	}

	object.setAttribute("disabled", 'disabled'); // gomb kattintás letiltása az adott területen
	selectionsArray[round].push(Number(object.id)); // selectionsArray tömb feltöltése a kattintott terület id-jával

	checkingWinner(); // győztes csekkolása 
	changeRound(); // játékos váltása a körben
}

// Győztes elleneörzése
function checkingWinner() {

	var winPatterns = isWinnerPatterns();

	finishedGame = false;
	for (var x = 0; x < winPatterns.length; x++) {
		
		if (finishedGame == false) { 
			finishedGame = whoIsWinner(winPatterns[x], selectionsArray[round]);

			if ( finishedGame === true ) {
				
				// Eredményjelző frissítése
				updateToScore(round);

				// dobozok letiltása
				disableAllAreas();

				alert(round + ' játékos '+' NYERT !!'); // Győztes játékos kiírása
				
				break;
			} 
		}
	}

	// ha egyik fél sem nyert, kiírjuk, hogy döntetlen és vége a játéknak.
	if ( ( totalRounds == 9 ) && finishedGame === false ) { 
		alert('Döntetlen!');
		finishedGame = true;
        disableAllAreas(); // dobozok letiltása itt is
	}
}

// Kattintható területek letiltása győzelem és döntetlen esetén
function disableAllAreas() {

	var boxes = document.getElementsByClassName("area");
	for (var i = 0; i < boxes.length; i++) {
        boxes[i].disabled = true;
	}

}

// Minden egyes választás ellenörzése a nyerő minta szerint
function whoIsWinner(winPatternParam, selectionsArray){

	var match = 0;

	for (var x = 0; x < winPatternParam.length; x++) {
		for (var y = 0; y < selectionsArray.length; y++) {
			if (winPatternParam[x] == selectionsArray[y]) {
				match++;
			}
		}
	}

	if (match == winPatternParam.length) {
        return true;
    }

	return false;
}

// eredmény kiíratása az egyes játékosokhoz
function updateToScore(round){
	scoresArray[round]++;
	document.getElementById('score-'+round).innerHTML = scoresArray[round];
}