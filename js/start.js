window.addEventListener('load', e=>{
  Kontaktliste = new Kontaktliste('listContacts');

  // Lytter på knappen til skjemaet for å legge inn ny kontakt. Bruker funksjonen
  // leggTilKontakt som ligger i klassen Kontaktliste.
  // Når knapper har blitt trykket på tømmes skjemaet.
  // En alert kommer opp for å bekrefte at en ny kontakt er lagt til.
  const leggTilKnapp = document.getElementById('leggTilKontaktKnapp');
  leggTilKnapp.addEventListener('click', e => {
    Kontaktliste.leggTilKontakt(
      e.target.form.fornavn.value, 
      e.target.form.etternavn.value, 
      e.target.form.gate.value,
      e.target.form.postnr.value,
      e.target.form.poststed.value,
      e.target.form.epost.value, 
      e.target.form.telefon.value
    );
    e.target.form.fornavn.value = '';
    e.target.form.etternavn.value = ''; 
    e.target.form.gate.value = '';
    e.target.form.postnr.value = '';
    e.target.form.poststed.value = '';
    e.target.form.epost.value = ''; 
    e.target.form.telefon.value = '';
    alert('Ny kontakt er lagt til');
  });
  
  // Lytter på skjemaet for å redigere kontakt. Fungerer likt som knappen ovenfor, 
  // men forskjellen er at den også henter inn idx. Trenger ikke tømme skjemaet,
  // fordi redigeringsvinduet lukkes når man trykker på knappen. Skulle man ønske å redigere en ny
  // kontakt vil informasjonen fra den kontakten legges inn i feltene.
  const redigerKnapp = document.getElementById('redigerKontaktKnapp');
  redigerKnapp.addEventListener('click', e => {
    Kontaktliste.redigerKontakt(
      e.target.form.redigerfornavn.value, 
      e.target.form.redigeretternavn.value, 
      e.target.form.redigergate.value,
      e.target.form.redigerpostnr.value,
      e.target.form.redigerpoststed.value,
      e.target.form.redigerepost.value, 
      e.target.form.redigertelefon.value,
      document.getElementById('idx').innerHTML
    )
  });
});

// Hindrer tilfeldig reloading av siden, for eksempel hvis man trykker på enter-knappen når man søker.
document.querySelectorAll('form').forEach(form=>{
  form.addEventListener('submit', e=>{
    e.preventDefault(); 
    return false;       
  })
})


// Denne koden brukes når man trykker på en kontakt man har søkt opp på seksjonen "Søk kontakter". 
// Når man trykker på en kontakt åpnes et nytt vindu, en modal, med mulighet for 
// redigering av kontakten. Ved siden av redigeringsskjemaet vises et kart.

// Har hentet inspirasjon til modalen fra 
// https://www.cssscript.com/minimal-modal-window-with-plain-javascript/

var overlay = document.getElementById('overlay');

function openModal(){

  // Fjerner css-classen "is-hidden" fra div-en overlay. Modalen vises.
  overlay.classList.remove("is-hidden");

  // Initaliserer kartet
  let mymap;

  // Har en liten timeout på 10 millisekunder her. Grunnen er at kartet var litt ivrig
  // og lastet seg inn før det var en adresse å hente.
  setTimeout(() => {

    // Starter med å sjekke om det allerede finnes noe i mymap. Isåfall kjøres Leaflet-kommandoen
    // remove(), som fjerner hele div-en mapid hvor kartet er.
    if (mymap) {
      mymap.remove();
    }

    // Oppretter div-en hvor kartet skal vises.
    document.getElementById('kartplassering').innerHTML = '<div id="mapid"></div>';

    // Legger inn kartet i div-en.
    mymap = L.map('mapid');

    // Henter adresse fra redigeringsfeltene gate og poststed.
    let hentadresse = document.getElementById('redigergate').value + ' ' + document.getElementById('redigerpoststed').value;

    // Bruker encodeURIComponent for å gjøre eventuelle symboler og mellomrom om til tegn som kan leses i urlen som fetches nedenfor. Mellomrom funker for eksempel ikke i en url.
    let sted = encodeURIComponent(hentadresse);
    
    // Søker opp adressen og fetcher info i en json-fil.
    fetch(`https://nominatim.openstreetmap.org/search?q=${sted}&format=json&polygon=1&addressdetails=1`)
    .then(res=>res.json())
    .then(data=>{

      //Hvis objektet som hentes fra server er tomt betyr det at Leaflet ikke fant adressen.
      // Da skrur jeg av kartet og viser en tekst der kartet egentlig skal vises.
      
      if(!Object.keys(data).length){
        mymap.off();
        document.getElementById('kartplassering').innerHTML = "<h3>Fant dessverre ikke denne adressen:</h3><br /><br /><h4>" + hentadresse + ".</h4>";
      } else {
      // Kartet henter data fra Openstreetmap og flytter kartet til riktig bredde- og lengdegrad.
      mymap.setView([data[0].lat, data[0].lon], 15);
          
      // Setter en tegnestift på adressen.
      L.marker([data[0].lat, data[0].lon]).addTo(mymap);
      }
    })
  
				// Her trenger man en nøkkel for å hente informasjonen
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=ACCESS_TOKEN', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'ACCESS_TOKEN'
    }).addTo(mymap)
  }, 10)
}

// Denne funksjonen lukker modalen. Div-en overlay får igjen lagt inn klassen "is-hidden", 
// som gjør den usynlig.
function closeModal(){
  overlay.classList.add("is-hidden");
}