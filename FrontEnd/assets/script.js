async function fetchData(url) {

    // Effectue une requête pour obtenir une ressource
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function generateGalleryCategoryFilter(parentElement, galleryElement, data) {

    // Initialise un Set pour stocker les ids des catégories et vérifier l'unicité
    let categoryIdSet = new Set();
    categoryIdSet.add(0);
    
    // Initialise un tableau pour mémoriser les objets de catégorie uniques
    let categoriesArray = [];

    // Ajoute la catégorie "Tous" au tableau des catégories
    categoriesArray.push({id: 0, name: "Tous"});
    
    // Insère les categories dans le tableau des catégories
    data.forEach(el => {
        const category = el.category;
        if (!categoriesArray.find((categoryAlreadyInserted) => categoryAlreadyInserted.id === category.id)) {
            categoriesArray.push({id: category.id, name: category.name});
        }
    })
    
    // Debug
    console.log(categoriesArray);

    // Creation du conteneur html
    let filtersContainer = document.createElement("div");
    filtersContainer.classList.add("filters");
    parentElement.insertBefore(filtersContainer, galleryElement);

    // Creation des boutons html du conteneur
    categoriesArray.forEach(el => {

        // Creation du bouton
        let filter = document.createElement("button");
        filter.classList.add("filters__button");
        filter.innerText = el.name;

        // Ajoute un attribut a chaque bouton
        filter.setAttribute('data-id', el.id);

        // Par défaut "Tous" est sélectionné
        if (el.id === 0) {filter.classList.add('selected')};
        
        // Ajoute le bouton au conteneur
        filtersContainer.appendChild(filter);
    });

    // Ajoute un écouteur d'événement au conteneur
    filtersContainer.addEventListener('click', (event) => {

        // Vérifie si l'élément cliqué est bien un bouton
        if (event.target.tagName === 'BUTTON') {
            const categoryId = parseInt(event.target.getAttribute('data-id'), 10);
            filterGalleryByCategory(galleryElement, data, categoryId);
        }
    });
}

function filterGalleryByCategory(galleryElement, data, categoryId) {

    // Creation d'un nouveau tableau
    let dataFiltered = [];

    if (categoryId === 0) {
        // La catégorie "Tous" ne filtre pas les donnees
        dataFiltered = data;
    } else {
        dataFiltered = data.filter(el => el.categoryId === categoryId);
    }

    // Mise a jour de la catégorie active
    updateActiveCategory(categoryId);
   
    // Rafraîchis l'affichage de la galerie
    displayGallery(galleryElement, dataFiltered);
}

function updateActiveCategory(categoryId) {

    // Retire si présente la classe "selected" de tous les boutons
    let filterButtonElements = document.querySelectorAll('.filters__button');
    filterButtonElements.forEach(el => el.classList.remove('selected'));

    // Ajoute la classe "selected" au bouton sélectionné
    let selectedButton = document.querySelector(`.filters__button[data-id="${categoryId}"]`);
    selectedButton.classList.add('selected');
}

function displayGallery(galleryElement, data) {

  // Supprime le contenu html du conteneur
  galleryElement.innerHTML = '';

  data.forEach(el => {

      // Creation des éléments html
      let figureContainerElement = document.createElement("figure");
      let imgElement = document.createElement("img");
      let figcaptionElement = document.createElement("figcaption");

      // Injection des donnees dans les elements html
      imgElement.src = el.imageUrl;
      figcaptionElement.textContent = el.title;

      // Ajoute les travaux a la galerie
      figureContainerElement.appendChild(imgElement);
      figureContainerElement.appendChild(figcaptionElement);
      galleryElement.appendChild(figureContainerElement);
  })
}

async function init() {

    // Récupère les éléments html
    let portfolioElement = document.querySelector("#portfolio");
    let galleryElement = document.querySelector(".gallery");

    // Récupère les donnees des travaux
    // const works = await fetchData("http://localhost:5678/api/works");
    const works = await fetchData("http://10.10.10.30:5678/api/works");

    // Debug
    console.log(works);

    // Ajoute le tri des projets dans la galerie
    generateGalleryCategoryFilter(portfolioElement, galleryElement, works);

    // Affiche la galerie
    displayGallery(galleryElement, works);
}

init();
