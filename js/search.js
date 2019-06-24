// Oppretter en tom array som jeg putter kontaktene i.
let contacts = [];

// Fetcher hele kontaktlista. Arrayen fylles med det som måtte befinne seg i json-fila på server.
// Oppdatering: Fjernet URL.
fetch(URL)
.then(res => res.json())
.then(data => {
  // Fyller arrayen contacts med innholdet i json-fila. All dataen ligger
  // i feltet data, derfor setter jeg contacts lik data.data
  contacts = data.data;
    
  // Legger inn indexverdi i hver kontakt. 
  // Gjør dette for å hindre at den bare redigerer kontakten med idxverdi lik 0 (altså første treff i arrayen).
  contacts.forEach((contact, idx) => {
    // Går gjennom hele arrayen og legger til et felt index som får et nummer etter hvor det ligger i arrayen.
    contact.index = idx;
  });
});

// Lytter på søkefeltet for endringer. Filtrerer arrayen med en funksjon som heter filter.
document.getElementById('searchField').addEventListener('input', e=> {
  showContacts(contacts.filter(filter));
});

// Denne funksjonen søker gjennom kontaktlistearrayen for å se om søket treffer på fornavn eller etternavn.
function filter (contact) {
  if(document.getElementById('searchField').value===''){
    return false;
  } else {
    // Gjør fornavn og etternavn til små bokstaver. Returnerer resultat hvis det er treff på fornavn eller etternavn.
    const name = contact.fornavn.toLowerCase().indexOf(document.getElementById('searchField').value.toLowerCase())>-1;
    const lastname = contact.etternavn.toLowerCase().indexOf(document.getElementById('searchField').value.toLowerCase())>-1;
    return name || lastname;
  };
};

/**
 * 
 * @param {Array} contacts 
 * 
 * Funksjon som viser kontakter. Henter id fra div og legger inn overskrift. 
 * For hver kontakt legges det inn en div med informasjon om fornavn, etternavn, gate, postnummer, poststed, epost og telefon.
 * 
 */

function showContacts(contacts) {
  
  const searchtable = document.getElementById('searchTable');
  searchtable.innerHTML = '';

  // Går gjennom kontakter som søket finner og legger informasjonen inn i en tabellrad som får
  // classen lytterad.
  contacts.forEach(kontakt => {
    const tr = document.createElement('tr');
    tr.setAttribute('class', 'lytterad');
    tr.innerHTML = `
      <td>${kontakt.fornavn}</td>
      <td>${kontakt.etternavn}</td>
      <td>${kontakt.gate}</td>
      <td>${kontakt.postnr}</td>
      <td>${kontakt.poststed}</td>
      <td>${kontakt.epost}</td>
      <td>${kontakt.telefon}</td>
    `;
    searchtable.append(tr);
  });

  // AddEventListener på om noen trykker på noen av søkeresultatene. Hvis de gjør det vil funksjonen openModal() kjøres, som henter
  // all informasjon om kontakten og legger inn i redigeringsskjemaet.
  const lytterad =  document.querySelectorAll('.lytterad');
  contacts.forEach((kontakt, idx) => {
    lytterad[idx].addEventListener('click', e=> {
      openModal();
      document.getElementById('redigerfornavn').value = kontakt.fornavn;
      document.getElementById('redigeretternavn').value = kontakt.etternavn;
      document.getElementById('redigergate').value = kontakt.gate;
      document.getElementById('redigerpostnr').value = kontakt.postnr;
      document.getElementById('redigerpoststed').value = kontakt.poststed;
      document.getElementById('redigerepost').value = kontakt.epost;
      document.getElementById('redigertelefon').value = kontakt.telefon;  
      document.getElementById('idx').innerHTML = kontakt.index;
    });
  });
};