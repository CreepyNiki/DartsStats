let myIndex = 0;
let slideInterval;

carousel();
factOfTheDay()

// Methode, die den aktuellen Slide anzeigt
function showSlide(index) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    // Falls Index außerhalb der Grenzen ist, zurücksetzen
    if (index >= slides.length) myIndex = 0;

    // Alle Sildes ausblenden und alle Punkte deaktivieren
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        dots[i].classList.remove("active");
    }

    // Nur den aktuellen Slide anzeigen und den Style des Punkts aktivieren
    slides[myIndex].style.display = "block";
    dots[myIndex].classList.add("active");
}

// Methode, die den nächsten Slide anzeigt
function carousel() {
    myIndex++;
    showSlide(myIndex);
    slideInterval = setTimeout(carousel, 20000); // Image soll sich alle 2 Sekunden ändern
}

// Methode, die den aktuellen Slide anzeigt
function currentSlide(index) {
    clearTimeout(slideInterval);
    myIndex = index;
    showSlide(myIndex);
    slideInterval = setTimeout(carousel, 20000);
}

// Erlaubt das Klicken auf die Punkte, um den Slide zu wechseln
document.addEventListener("DOMContentLoaded", () => {
    let dots = document.getElementsByClassName("dot");
    for (let i = 0; i < dots.length; i++) {
        dots[i].addEventListener("click", () => currentSlide(i));
    }
});

// Funktion, die einen zufälligen Fakt über Darts anzeigt
function factOfTheDay(){
    let facts = [
        "Luke Littler ist nicht nur der jüngste Weltmeister der PDC-Geschichte, sondern hat bereits mit 18 Jahren über 2 Millionen Pfund durch Preisgelder und Werbedeals verdient.",
        "Luke Littler liebt Döner so sehr, dass er mit Deliveroo zusammenarbeitet, um den besten Kebab Großbritanniens zu finden.",
        "Luke Humphries, der aktuelle Weltranglistenerste, trägt den Spitznamen „Cool Hand Luke“ – eine Anspielung auf den gleichnamigen Filmklassiker. ",
        "Martin Schindler ist der erste deutsche Spieler, der drei European-Tour-Titel gewonnen hat und aktuell auf Platz 18 der Weltrangliste steht – ein Rekord für deutsche Darts-Spieler.",
        "Gerwyn Price war vor seiner Darts-Karriere professioneller Rugby-Spieler und wurde später der erste walisische PDC-Weltmeister.",
        "Gary Anderson war vor seiner Darts-Karriere Besitzer eines Pubs namens Wellington Arms in Somerset.",
        "Der höchste Average auf Kamera wurde von Peter Wright mit 123,5 Punkten im Jahr 2019 bei den Players Championship 29 erzielt – ein Rekord, der bis heute ungebrochen ist.",
        "Simon Whitlock hat über ein Jahr gebraucht, um seine erste 180 zu werfen.",
        "Rob Cross hat die European Darts Championship zweimal gewonnen, bevor er überhaupt ein European Tour-Turnier gewonnen hat.",
        "Die Premier League startete im Jahr 2005. Das erste mal, dass jemand anderes als Phil Taylor oder Michael van Gerwen die Premier League gewann, war 2020, als Glen Durrant den Titel holte.",
        "Phil Taylor hat nie einen 9-Darter bei der WM geworfen.",
        "Michael Smith begann im Jahr 2006 damit Darts zu spielen. Auf dem Weg zur Schule stürzte er vom Fahrrad und verletzte sich, sodass er eine Zeit auf Krücken gehen musste. Während dieser Zeit fing er aus Langeweile an, ein paar Pfeile zu werfen.",
        "James Wade leidet an einer bipolaren Störung. Eine psychische Erkrankung, bei der es zu Stimmungsschwankungen zwischen Depressionen und Hypomanie/Manie kommt."
    ];


    let randomIndex = Math.floor(Math.random() * facts.length);
    document.getElementsByClassName("fact")[0].innerHTML = `<strong>Zufälliger Fakt:</strong> ${facts[randomIndex]}`;

}


