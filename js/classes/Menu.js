class Menu {
  // Constructoren henter inn tre egenskaper. For denne nettsiden er disse satt i index.html.
  // ('body>nav>ul', 'body>main>section', 'js/menu.json') viser til hvor menyen skal plasseres,
  // hvor man finner sections på index.html oog filplassering for json-fil.
  constructor (menuSelector, sectionSelector, jsonFile) {

    //Fetcher json-fila og gjør den leselig for json.
    fetch(jsonFile)                           
    .then(res=>res.json())                        
    .then(data=>{

      // Finner menyplassering i index.html og oppretter et nytt listeelement for hvert objekt i json-fila.
      let menu = document.querySelector(menuSelector);
      data.forEach((menuItem, idx)=>{             
        let li = document.createElement('li');    

        // Legger til linken som innerHTML i menyelementet, og setter inn menyelementet i menyen.
        li.innerHTML = `<a data-scriptsrc="${menuItem.scriptsrc}" data-id="${menuItem.id}" href="">${menuItem.menuText}</a>`;
        menu.appendChild(li);                     
      });

      // Finner alle menyelementer og lytter på om de blir klikket på.
      document.querySelectorAll(`${menuSelector} a`).forEach(a=>{
        a.addEventListener('click', e=>{
          // Når det klikkes på et menyelement blir valget lagret i sessionStorage.
          sessionStorage.setItem('activePage', e.target.dataset.id);
          e.preventDefault();

          // Sjekker om det følger med en javascriptfil i json-fila. Isåfall opprettes en script-tag. Den blir lagt til i head på index.html.
          if (e.target.dataset.scriptsrc!="") {
            if (document.querySelector(`[src="${e.target.dataset.scriptsrc}"]`)==null) {
              const script = document.createElement('SCRIPT');
              script.src = e.target.dataset.scriptsrc;
              document.querySelector('head').appendChild(script);
            } 
          } 

          // Så blir menyelementet satt til active. Da blir bakgrunnsfargen på menyelementet endret.
          // Den fjerner også active-delen fra menyelementet som ikke lenger er i bruk.
          document.querySelectorAll(`${menuSelector} a`).forEach(a=>{
            if (a==e.target) {
              a.parentNode.classList.add('active');
            } else {
              a.parentNode.classList.remove('active');
            }
          });

          // Her blir riktig section satt til active. Da vises riktig section, mens active-delen fjernes fra forrige section.
          document.querySelectorAll(sectionSelector).forEach(section=>{
            if (section.id == e.target.dataset.id) {
              section.classList.add('active');
            } else {
              section.classList.remove('active');
            }
          }); 
        })
      })

      // Sjekker om det finnes noe i sessionStorage.
      if (sessionStorage.getItem('activePage')!=null) { 
        // Klikk på det menyelementet som tilsvarer det siste menyelementet brukeren trykket på
        document.querySelector(`${menuSelector} a[data-id="${sessionStorage.getItem('activePage')}"]`).click();
      } else {  
        // Hvis det ikke er gjort noe på siden i denne sessionen starter brukeren på første punkt i json-fila, 
        // som i dette tilfelle blir forsida.
        document.querySelector(`${menuSelector} a`).click();
      }
    });
  }
}
