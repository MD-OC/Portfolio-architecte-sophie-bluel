// === CONTROLLERS ===

async function loadGallery() {

  try {
      // Recupere des travaux sur le serveur
      const r = await getWorks();
      const works = await r.json();

      // Debug
      console.log(works);

      // Recupere les travaux en local
      localWorks = works;

      // Affiche de la galerie
      displayGallery(localWorks);

  } catch (e) {
      throw e;
  }

}

// === BACKEND ===

async function getWorks() {

  try {
      // Execution de la requete HTTP
      const r = await fetch('http://localhost:5678/api/works', {
          method: 'GET',
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
          }
      });

      // Gestion des erreurs HTTP
      if (!r.ok) {
          throw new Error(`HTTP error! Status: ${r.status}`);      
      }

      // Retourne la reponse
      return r;

  } catch (e) {
      // Gestion des erreurs de la fonction fetch()
      console.error(e);
      throw e;
  }
}

// === DOM ===

function displayGallery(data) {

  // Récupération des éléments
  const gallery = document.querySelector(".gallery");

  // Purge la galerie actuelle
  document.querySelectorAll('.js-work').forEach((work) => {
      gallery.removeChild(work);
  });

  // Genere la nouvelle galerie
  data.forEach(work => {
      createWork(work, gallery);
  });
}

function createWork(work, gallery) {

    // Création des éléments html
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    // Ajout des selecteurs
    figure.classList.add("js-work");
    figure.setAttribute('data-work-id', work.id);

    // Modification des proprietes
    img.src = work.imageUrl;
    figcaption.textContent = work.title;

    // Ajoute les travaux a la galerie
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}

