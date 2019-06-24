class Kontaktliste {

  /**
   * 
   * Klassen åpnes med en kontaktlisteSelektor (listContacts).
   * 
   *  @param {String} kontaktlisteSelektor
   * 
   */

   // URL til json-fil på server. Kjører _hentKontakter().

   // Oppdatering: Fjernet URL.

  constructor(kontaktlisteSelektor) {
    this._liste = document.querySelector(kontaktlisteSelektor);
    this._storeURL = URL;
    this._kontaktlisteID = 'torsteinf3_kontaktliste';
    this._hentKontakter();
  }

  /** 
   * @return {Array}
   * 
   *   Returnerer arrayen _kontaktliste
   */

  get kontakter() {
    return this._kontaktliste;
  }

  /**
   * 
   *  @param {String} fornavn
   *  @param {String} etternavn
   *  @param {String} gate
    * @param {Int} postnr
    * @param {String} poststed
   *  @param {String} epost
   *  @param {Int} telefon
   * 
  * Legger til ny kontakt i kontaktlista. Den får fornavn, etternavn, gate, postnummer, poststed, epost og telefon
   * fra skjemaet i index.html og så gjør den tre ting:
   * 
   * Push gjør at kontakten legges inn på slutten av arrayen _kontaktliste.
   * Deretter blir serveren oppdatert med den nye kontakten.
   * Til slutt blir _oppdaterKontaktliste() kjørt på nytt.
   */

  leggTilKontakt(fornavn, etternavn, gate, postnr, poststed, epost, telefon, idx) {
    const kontakt = {
      fornavn: fornavn,
      etternavn: etternavn,
      gate: gate,
      postnr: postnr,
      poststed: poststed,
      epost: epost,
      telefon: telefon
    }
    this._kontaktliste.push(kontakt);
    this._oppdaterServer(kontakt);
    this._oppdaterKontaktliste();
  }

  // Redigerer kontakt i kontaktlista. Den får fornavn, etternavn, gate, postnummer, poststed, epost, telefon og index
  // og deretter oppdaterere den server og kontaktliste.

  redigerKontakt(fornavn, etternavn, gate, postnr, poststed, epost, telefon, idx) {
    const kontakt = {
      fornavn: fornavn,
      etternavn: etternavn,
      gate: gate,
      postnr: postnr,
      poststed: poststed,
      epost: epost,
      telefon: telefon
    }
    this._oppdaterServer(kontakt, idx);
    this._oppdaterKontaktliste();
  }


  // Henter json-fila med kontakter fra server. Serveren returnerer SUCCESS eller
  // FAIL. Hvis det er suksess betyr det at det finnes noe i json-fila, og denne 
  // informasjonen legges inn i _kontaktliste. Hvis ikke opprettes det en tom array.

  _hentKontakter() {
  
    fetch(`${this._storeURL}getAll.php?store=${this._kontaktlisteID}`)
    .then(res=>res.json())
    .then(data => {
      
      if(data.status==`SUCCESS`) {
        if (data.data!=null) {
          
          this._kontaktliste = data.data;
        } else {
          this._kontaktliste = [];
        }
      } else {
        this._kontaktliste = [];
      }
      this._oppdaterKontaktliste();
    })
   }

   /**
    * 
    * @param {Object} kontakt 
    * @param {number} [idx=null] 
    *  
    * Det er to metoder her, den første, hvor idx==null, legger til en ny kontakt.
    * 
    * Den andre, set sjekker om det også følger med en idx - en plassering i arrayen -
    * for hvis det gjør det betyr det at en allerede eksisterende kontakt skal endres.
    * 
    */

   _oppdaterServer(kontakt, idx=null) {
      const skjema = new FormData();
      skjema.append('store', this._kontaktlisteID);
      skjema.append('data', JSON.stringify(kontakt));
      if (idx==null) {
        fetch(`${this._storeURL}add.php`, {
          method: "POST",
          body: skjema
        })
      } else {
        skjema.append('idx', idx);
        fetch(`${this._storeURL}set.php`, {
          method: "POST",
          body: skjema
        })
      }
   }

   /**
    * @param {String} fornavn
    * @param {String} etternavn
    * @param {String} gate
    * @param {Int} postnr
    * @param {String} poststed
    * @param {String} epost
    * @param {Int} telefon
    * 
    * Når en ny kontakt legges inn må serveren få inn denne kontakten.
    * Vi kaller en const skjema som henter inn funksjonen FormData() som 
    * ligger på server.
    * 
    * Først legger vi inn navnet på vår del av serveren, store, og så 
    * legger vi inn data på den nye kontakten.
    * 
    */

   _leggTilKontaktlisteServer(fornavn, etternavn, gate, postnr, poststed, epost, telefon) {
     const skjema = new FormData();
     skjema.append('store', this._kontaktlisteID);
     skjema.append('data', JSON.stringify({
      fornavn: fornavn,
      etternavn: etternavn,
      gate: gate,
      postnr: postnr,
      poststed: poststed,
      epost: epost,
      telefon: telefon 
    }));
    fetch(`${this._storeURL}add.php`, {
      method: `POST`,
      body: skjema
    });
    this._oppdaterKontaktliste;
   };

   /**
    * 
    * Tabellen i index.html som viser alle kontaker blir kjørt her.
    * 
    */
   

  _oppdaterKontaktliste() {
    // Finner tabell-id og tømmer den.
    const tabell = document.getElementById('kontaktlistetabell');
    tabell.innerHTML = '';
    
    // For hver kontakt i kontaktlista lages en tabellrad med informasjon om kontakten.
    this._kontaktliste.forEach(kontakt => {
      const tr = document.createElement('tr');
      
      tr.innerHTML = `
        <td>${kontakt.fornavn}</td>
        <td>${kontakt.etternavn}</td>
        <td>${kontakt.gate}</td>
        <td>${kontakt.postnr}</td>
        <td>${kontakt.poststed}</td>
        <td>${kontakt.epost}</td>
        <td>${kontakt.telefon}</td>
      `;
      tabell.append(tr);
    });
  }
}
