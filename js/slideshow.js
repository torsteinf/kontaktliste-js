// Lager en array som henter inn plassering til bildene i slideshowet.
const slideshowPhotos = [
  "images/alejandro_benet_1115_OdopM.jpg",
  "images/mathew_schwartz_7318_kcdwD",
  "images/raychan_740022_unspl_Zu38v.jpg",
  "images/thomas_kinto_1221870_puSnw.jpg"
];

// En liten console.log for å sjekke at slideshowet ikke kjører før man trykker på forsideknappen.
console.log("Slideshow kjører")

// Finner slideshow-div i index.html. Oppretter to div-er kalt slide1 og slide2 som legges til slideshow-diven.
const slideshow = document.querySelector('.slideshow');
const slide1 = document.createElement('DIV');
slideshow.appendChild(slide1);
const slide2 = document.createElement('DIV');
slideshow.appendChild(slide2);

// Setter bakgrunnsbilde til slide1. Den starter på første objekt i arrayen, altså [0].
slide1.style.backgroundImage = `url('${slideshowPhotos[0]}')`;

// Setter en timeout for hvor lang tid det første bildet skal bruke på å laste inn. Satt til 1 ms.
// Har også satt en opacity. 0 betyr at bildet er helt hvitt når det blir lastet inn, men vil gradvis bli helt synlig.
setTimeout(()=>{
  slide1.style.opacity = 0;
}, 1);                          

// Oppretter en 
let currentSlide = 1;   
nextSlide();            

// Funksjon for å skifte bilde i slideshowet. En timeout på 2500ms (2,5 sekunder). Bakgrunnsbilde byttes.
function nextSlide() {
  setTimeout(()=>{
    slide2.style.backgroundImage = slide1.style.backgroundImage;
    slide2.style.opacity = 1;
  }, 2500); 
}

// Lytter for å se når slide to er helt synlig/usynlig
slide2.addEventListener('transitionend', e=>{ 
  // Når det fremste bildet er lastet inn vil det bakerste bildet bli byttet ut (satt til [currentSlide], som er et nummer i arrayen).
  if (slide2.style.backgroundImage==slide1.style.backgroundImage) { 
    slide1.style.backgroundImage = `url('${slideshowPhotos[currentSlide]}')`;

    // Det fremste bildet blir fadet ut.
    slide2.style.opacity = 0;     
    
    // CurrentSlide blir plusset på.
    currentSlide++;    
    
    // currentSlide blir satt til currentSlide modulus lengden på arrayen slideshowPhotos. I dette tilfellet er arraylengden 4.
    // Så hvis currentSlide er 4 vil 4 % 4 = 0, og slideshowet vil starte på nytt. I de andre tilfellene vil currentSlide ikke endres 
    // (for eksempel er 2 % 4 = 2.)
    currentSlide = currentSlide%slideshowPhotos.length; // Dersom forbi slutten, gå til begynnelsen

    // Kjør funksjonen nextSlide()
    nextSlide();        
  }
})