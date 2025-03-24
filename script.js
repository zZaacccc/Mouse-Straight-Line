
const speedDisplay = document.getElementById("abweichung");
const leaderboardList = document.getElementById("leaderboard");
const startPunkt = document.getElementById("1");
const endPunkt = document.getElementById("2");
const infoText = document.getElementById("infoText");
const startBtn = document.getElementById("startBtn");

const rectStart = startPunkt.getBoundingClientRect();
const rectEnd = endPunkt.getBoundingClientRect();

let countdownValue = 3; // Countdown-Zeit in Sekunden
let countdownInterval = null; // Speichert den Countdown-Interval
let testLäuft = false; // Verhindert Neustart nach "GO"
let aftergo = false;
let abweichungen =[];

//  Mausbewegung überwachen
document.addEventListener('mousemove', checkMousePosition);

document.getElementById("clearLeaderboard").addEventListener("click", function() {
    localStorage.removeItem("leaderboard");
    leaderboardList.innerHTML = ""; // UI aktualisieren
    alert("Leaderboard wurde gelöscht!");
});
document.getElementById("Help").addEventListener("click", function() {
    document.getElementById("Help").innerText = "Y Koordinate: " +rectStart.y;
});


//  Funktion: Überprüft, ob Maus über Startpunkt ist
function checkMousePosition(event) {
    //if (testLäuft) return; // Falls der Test läuft, nichts tun

    let x = event.clientX;
    let y = event.clientY;
    infoText.innerText = `X: ${x}, Y: ${y}`;


    
    if (x >= rectStart.left && x <= rectStart.right && y >= rectStart.top && y <= rectStart.bottom) {
        startCountdown();
    } else {
        stopCountdown();
    }
    let idealY = rectStart.y
    ;

    if(aftergo) {
        if(x >= rectEnd.left && x <= rectEnd.right && y >= rectEnd.top && y <= rectEnd.bottom) {
            startBtn.innerText = "Test vorbei"
            stopTest();
            //was passiert nach ende
        }
        let abweichung = Math.abs(idealY - y);
        abweichungen.push(abweichung)
    }

}   

//  rote Punkte visiable after Button clicked
function testStart() {
    startPunkt.style.visibility = 'visible';
    endPunkt.style.visibility = 'visible';
    startBtn.textContent = "Bereit...";
    testLäuft = false; // Test ist noch nicht gestartet
}

//  Funktion: Countdown starten
function startCountdown() {
    if (countdownInterval || testLäuft) return; // Falls bereits läuft oder Test aktiv, nichts tun

    countdownValue = 3; // Zurücksetzen
    countdownInterval = setInterval(() => {
        if (countdownValue > 0) {
            startBtn.textContent = countdownValue;
            countdownValue--;
        } else {
            startBtn.textContent = "GO";
            clearInterval(countdownInterval);
            countdownInterval = null;
            testLäuft = true; // Test läuft jetzt, kein Abbruch mehr möglich
            aftergo = true;
            startTest();
        }
    }, 1000);
}

//  Funktion: Countdown abbrechen (nur wenn nicht schon "GO" erreicht wurde)
function stopCountdown() {
    if (countdownInterval && !testLäuft) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        startBtn.textContent = "Abgebrochen";
    }
}

//  Funktion: Startet den Test nach Countdown
function startTest() {
}

function stopTest() {
    document.removeEventListener("mousemove", checkMousePosition);
    let sumAbweichung = 0;
    for (let i = 0; i < abweichungen.length; i++){
        sumAbweichung += abweichungen[i];
    }
    
    speedDisplay.textContent = sumAbweichung;
    
    saveScore(sumAbweichung);

}
//  Event-Listener für Button-Start
startBtn.addEventListener("click", testStart);



// Speichert die Ergebnisse lokal
function saveScore(sumAbweichung) {
    let name = prompt("Gib deinen Namen ein:");
    if (!name) return;

    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    scores.push({ name, sumAbweichung });

    // Sortieren nach Geschwindigkeit
    scores.sort((a, b) => a.sumAbweichung - b.sumAbweichung);

    // Top 5 speichern
    scores = scores.slice(0, 5);

    localStorage.setItem("leaderboard", JSON.stringify(scores));

    updateLeaderboard();
}

// Leaderboard aktualisieren
function updateLeaderboard() {
    leaderboardList.innerHTML = "";

    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];

    scores.forEach((entry) => {
        let li = document.createElement("li");
        li.textContent = `${entry.name}: ${entry.sumAbweichung} px`;
        leaderboardList.appendChild(li);
    });
}

// Beim Laden Leaderboard anzeigen
updateLeaderboard();
